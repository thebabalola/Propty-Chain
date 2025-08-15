// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./UserRegistry.sol";

// Manages property reviews, validation, and reporting system
contract ReviewRegistry is Ownable {

    enum ReviewType {
        RESIDENT,
        PAST_TENANT,
        COMMUNITY_MEMBER
    }

    struct Review {
        uint256 reviewId;
        uint256 propertyId;
        address reviewer;
        ReviewType reviewType;
        string ipfsHash; // Review content stored on IPFS
        uint256 timestamp;
        bool isValid;
        uint256 reportCount;
        uint256 rating; // 1-5 stars
        string category; // Property conditions, disputes, landlord behavior, area safety
    }

    struct ReviewStats {
        uint256 totalReviews;
        uint256 validReviews;
        uint256 averageRating;
        uint256 totalReports;
    }

    // State variables
    uint256 private _reviewIds;
    mapping(uint256 => Review) public reviews;
    mapping(uint256 => ReviewStats) public propertyReviewStats; // propertyId => stats
    mapping(address => uint256) public userReviewCount;
    mapping(address => uint256) public userReportCount;
    mapping(uint256 => mapping(address => bool)) public hasReviewed; // propertyId => user => hasReviewed
    mapping(uint256 => mapping(address => bool)) public hasReported; // reviewId => user => hasReported
    
    // Dynamic configurable values
    uint256 public maxReportsBeforeRestriction = 3;
    uint256 public maxNegativeReviewsBeforeRemoval = 5;
    uint256 public minRating = 1;
    uint256 public maxRating = 5;
    
    // Contracts
    UserRegistry public userRegistry;
    
    // Events
    event ReviewSubmitted(
        uint256 indexed reviewId,
        uint256 indexed propertyId,
        address indexed reviewer,
        ReviewType reviewType,
        string ipfsHash,
        uint256 rating
    );
    
    event ReviewReported(
        uint256 indexed reviewId,
        address indexed reporter,
        string reason
    );
    
    event ReviewInvalidated(
        uint256 indexed reviewId,
        address indexed reviewer,
        string reason
    );
    
    event UserRestricted(
        address indexed user,
        string reason
    );
    
    event PropertyRemoved(
        uint256 indexed propertyId,
        string reason
    );

    event ConfigUpdated(
        string config,
        uint256 oldValue,
        uint256 newValue
    );

    // Modifiers
    modifier onlyRegistered() {
        require(userRegistry.isUserActive(msg.sender), "User not registered or inactive");
        _;
    }

    modifier onlyValidRating(uint256 rating) {
        require(rating >= minRating && rating <= maxRating, "Rating must be between 1 and 5");
        _;
    }

    modifier onlyValidReviewType(ReviewType reviewType) {
        require(uint256(reviewType) <= 2, "Invalid review type");
        _;
    }

    modifier onlyAdmin() {
        require(owner() == msg.sender, "Only admin can perform this action");
        _;
    }

    // Constructor
    constructor(address _userRegistry) Ownable(msg.sender) {
        userRegistry = UserRegistry(_userRegistry);
    }

    // Submit a property review
    function submitReview(
        uint256 propertyId,
        ReviewType reviewType,
        string memory ipfsHash,
        uint256 rating,
        string memory category
    ) external onlyRegistered onlyValidReviewType(reviewType) onlyValidRating(rating) {
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(bytes(category).length > 0, "Category cannot be empty");
        require(!hasReviewed[propertyId][msg.sender], "Already reviewed this property");

        _reviewIds++;
        uint256 reviewId = _reviewIds;

        Review memory newReview = Review({
            reviewId: reviewId,
            propertyId: propertyId,
            reviewer: msg.sender,
            reviewType: reviewType,
            ipfsHash: ipfsHash,
            timestamp: block.timestamp,
            isValid: true,
            reportCount: 0,
            rating: rating,
            category: category
        });

        reviews[reviewId] = newReview;
        hasReviewed[propertyId][msg.sender] = true;
        userReviewCount[msg.sender]++;

        // Update property review stats
        _updatePropertyReviewStats(propertyId, rating, true);

        // Update user reputation in UserRegistry
        userRegistry.updateReputation(msg.sender, 1, userReviewCount[msg.sender]);

        emit ReviewSubmitted(reviewId, propertyId, msg.sender, reviewType, ipfsHash, rating);
    }

    // Report a review as false/inappropriate
    function reportReview(uint256 reviewId, string memory reason) external onlyRegistered {
        require(reviewId > 0 && reviewId <= _reviewIds, "Invalid review ID");
        require(reviews[reviewId].isValid, "Review already invalidated");
        require(!hasReported[reviewId][msg.sender], "Already reported this review");
        require(bytes(reason).length > 0, "Reason cannot be empty");

        reviews[reviewId].reportCount++;
        hasReported[reviewId][msg.sender] = true;
        userReportCount[msg.sender]++;

        emit ReviewReported(reviewId, msg.sender, reason);

        // Check if review should be invalidated
        if (reviews[reviewId].reportCount >= maxReportsBeforeRestriction) {
            _invalidateReview(reviewId, "Too many reports");
        }
    }

    // Invalidate a review (admin only)
    function invalidateReview(uint256 reviewId, string memory reason) external onlyAdmin {
        require(reviewId > 0 && reviewId <= _reviewIds, "Invalid review ID");
        require(reviews[reviewId].isValid, "Review already invalidated");

        _invalidateReview(reviewId, reason);
    }

    // Get review by ID
    function getReview(uint256 reviewId) external view returns (Review memory) {
        require(reviewId > 0 && reviewId <= _reviewIds, "Invalid review ID");
        return reviews[reviewId];
    }

    // Get property review statistics
    function getPropertyReviewStats(uint256 propertyId) external view returns (ReviewStats memory) {
        return propertyReviewStats[propertyId];
    }

    // Get user review count
    function getUserReviewCount(address userAddress) external view returns (uint256) {
        return userReviewCount[userAddress];
    }

    // Get user report count
    function getUserReportCount(address userAddress) external view returns (uint256) {
        return userReportCount[userAddress];
    }

    // Check if user has reviewed a property
    function hasUserReviewed(uint256 propertyId, address userAddress) external view returns (bool) {
        return hasReviewed[propertyId][userAddress];
    }

    // Check if user has reported a review
    function hasUserReported(uint256 reviewId, address userAddress) external view returns (bool) {
        return hasReported[reviewId][userAddress];
    }

    // Get total number of reviews
    function getTotalReviews() external view returns (uint256) {
        return _reviewIds;
    }

    // Get reviews for a property
    function getPropertyReviews(
        uint256 propertyId,
        uint256 offset,
        uint256 limit
    ) external view returns (Review[] memory) {
        require(limit > 0 && limit <= 50, "Limit must be between 1 and 50");

        Review[] memory propertyReviews = new Review[](limit);
        uint256 count = 0;

        for (uint256 i = 1; i <= _reviewIds && count < limit; i++) {
            if (reviews[i].propertyId == propertyId && reviews[i].isValid) {
                if (offset == 0) {
                    propertyReviews[count] = reviews[i];
                    count++;
                } else {
                    offset--;
                }
            }
        }

        // Resize array to actual count
        assembly {
            mstore(propertyReviews, count)
        }

        return propertyReviews;
    }

    // Admin functions to update configurable values
    function updateMaxReportsBeforeRestriction(uint256 newValue) external onlyAdmin {
        uint256 oldValue = maxReportsBeforeRestriction;
        maxReportsBeforeRestriction = newValue;
        emit ConfigUpdated("maxReportsBeforeRestriction", oldValue, newValue);
    }

    function updateMaxNegativeReviewsBeforeRemoval(uint256 newValue) external onlyAdmin {
        uint256 oldValue = maxNegativeReviewsBeforeRemoval;
        maxNegativeReviewsBeforeRemoval = newValue;
        emit ConfigUpdated("maxNegativeReviewsBeforeRemoval", oldValue, newValue);
    }

    function updateRatingRange(uint256 newMinRating, uint256 newMaxRating) external onlyAdmin {
        require(newMinRating < newMaxRating, "Min rating must be less than max rating");
        uint256 oldMin = minRating;
        uint256 oldMax = maxRating;
        minRating = newMinRating;
        maxRating = newMaxRating;
        emit ConfigUpdated("minRating", oldMin, newMinRating);
        emit ConfigUpdated("maxRating", oldMax, newMaxRating);
    }

    // Internal function to invalidate a review
    function _invalidateReview(uint256 reviewId, string memory reason) internal {
        Review storage review = reviews[reviewId];
        review.isValid = false;

        // Update property review stats
        _updatePropertyReviewStats(review.propertyId, review.rating, false);

        // Update user reputation (negative impact)
        userRegistry.updateReputation(review.reviewer, -2, userReviewCount[review.reviewer]);

        emit ReviewInvalidated(reviewId, review.reviewer, reason);

        // Check if user should be restricted
        if (userReportCount[review.reviewer] >= maxReportsBeforeRestriction) {
            userRegistry.deactivateUser(review.reviewer);
            emit UserRestricted(review.reviewer, "Too many false reviews");
        }

        // Check if property should be removed
        ReviewStats storage stats = propertyReviewStats[review.propertyId];
        if (stats.totalReports >= maxNegativeReviewsBeforeRemoval) {
            emit PropertyRemoved(review.propertyId, "Too many negative reviews");
        }
    }

    // Internal function to update property review statistics
    function _updatePropertyReviewStats(uint256 propertyId, uint256 rating, bool isAdding) internal {
        ReviewStats storage stats = propertyReviewStats[propertyId];
        
        if (isAdding) {
            stats.totalReviews++;
            stats.validReviews++;
            stats.averageRating = ((stats.averageRating * (stats.validReviews - 1)) + rating) / stats.validReviews;
        } else {
            if (stats.validReviews > 0) {
                stats.validReviews--;
                if (stats.validReviews > 0) {
                    stats.averageRating = ((stats.averageRating * (stats.validReviews + 1)) - rating) / stats.validReviews;
                } else {
                    stats.averageRating = 0;
                }
            }
        }
    }
}
