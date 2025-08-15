// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

import "./UserRegistry.sol";
import "./PropertyNFTFactory.sol";
import "./ReviewRegistry.sol";
import "./PropertyEscrow.sol";
import "./SoulboundNFT.sol";

// Central admin contract for platform management and oversight
contract AdminContract is Ownable, ReentrancyGuard, Pausable {

    enum DisputeType {
        PROPERTY_DISPUTE,
        REVIEW_DISPUTE,
        ESCROW_DISPUTE,
        USER_DISPUTE
    }

    enum DisputeStatus {
        OPEN,
        UNDER_REVIEW,
        RESOLVED,
        CLOSED
    }

    struct Dispute {
        uint256 disputeId;
        DisputeType disputeType;
        DisputeStatus status;
        address complainant;
        address respondent;
        uint256 relatedId; // Property ID, Review ID, Escrow ID, or User ID
        string description; // IPFS hash for dispute details
        uint256 createdAt;
        uint256 resolvedAt;
        address resolver;
        string resolution; // IPFS hash for resolution details
        bool complainantWins;
    }

    struct PlatformStats {
        uint256 totalUsers;
        uint256 totalProperties;
        uint256 totalReviews;
        uint256 totalEscrows;
        uint256 totalDisputes;
        uint256 totalRevenue;
        uint256 activeSubscriptions;
    }

    struct WithdrawalProposal {
        address proposer;
        uint96 amount;
        uint8 approvals;
        bool executed;
        mapping(address => bool) hasApproved;
    }

    // State variables
    uint256 private _disputeIds;
    mapping(uint256 => Dispute) public disputes;
    mapping(address => uint256[]) public userDisputes; // user => dispute IDs
    mapping(DisputeType => uint256) public disputeTypeCounts;
    
    // Admin management
    mapping(uint8 => address) public admin;
    uint8 public adminCount;
    uint8 constant MAX_ADMINS = 10;
    
    // Withdrawal proposals
    mapping(uint32 => WithdrawalProposal) public withdrawalProposals;
    uint32 public proposalCounter;
    
    // Platform fees and limits
    uint256 public platformFeePercentage = 2; // 2%
    uint256 public maxPropertiesPerUser = 50;
    uint256 public maxReviewsPerProperty = 100;
    uint256 public minReputationForVerification = 100;
    
    // Contracts
    UserRegistry public userRegistry;
    PropertyNFTFactory public propertyFactory;
    ReviewRegistry public reviewRegistry;
    PropertyEscrow public propertyEscrow;
    SoulboundNFT public soulboundNFT;
    
    // Events
    event DisputeCreated(
        uint256 indexed disputeId,
        DisputeType disputeType,
        address indexed complainant,
        address indexed respondent,
        uint256 relatedId
    );
    
    event DisputeResolved(
        uint256 indexed disputeId,
        address indexed resolver,
        bool complainantWins,
        string resolution
    );
    
    event PlatformFeeUpdated(
        uint256 oldFee,
        uint256 newFee
    );
    
    event UserVerified(
        address indexed user,
        bool verified
    );
    
    event PropertyRemoved(
        uint256 indexed propertyId,
        string reason
    );
    
    event ReviewRemoved(
        uint256 indexed reviewId,
        string reason
    );
    
    event PlatformPaused(
        address indexed pauser,
        string reason
    );
    
    event PlatformUnpaused(
        address indexed unpauser
    );

    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);
    event WithdrawalProposed(uint32 indexed proposalId, address indexed proposer, uint96 amount);
    event WithdrawalApproved(uint32 indexed proposalId, address indexed admin);
    event WithdrawalExecuted(uint32 indexed proposalId, uint96 amount);
    event ConfigUpdated(string config, uint256 oldValue, uint256 newValue);

    // Errors
    error NotAdmin();
    error InvalidAddress();
    error AdminLimitReached();
    error CannotRemoveLastAdmin();
    error InvalidAmount();
    error InsufficientFunds();
    error InvalidProposal();
    error AlreadyApproved();
    error ProposalExecuted();

    // Modifiers
    modifier onlyRegistered() {
        require(userRegistry.isUserActive(msg.sender), "User not registered or inactive");
        _;
    }

    modifier onlyValidDisputeType(DisputeType disputeType) {
        require(uint256(disputeType) <= 3, "Invalid dispute type");
        _;
    }

    modifier onlyValidDisputeStatus(DisputeStatus status) {
        require(uint256(status) <= 3, "Invalid dispute status");
        _;
    }

    modifier onlyAdmin() {
        bool isAdmin;
        for (uint8 i = 0; i < adminCount; i++) {
            if (admin[i] == msg.sender) {
                isAdmin = true;
                break;
            }
        }
        if (!isAdmin) revert NotAdmin();
        _;
    }

    // Constructor
    constructor(address initialAdmin) Ownable(initialAdmin) {
        if (initialAdmin == address(0)) revert InvalidAddress();
        admin[0] = initialAdmin;
        adminCount = 1;
    }

    // Set contract addresses
    function setContracts(
        address _userRegistry,
        address _propertyFactory,
        address _reviewRegistry,
        address _propertyEscrow,
        address _soulboundNFT
    ) external onlyAdmin {
        if (_userRegistry == address(0)) revert InvalidAddress();
        if (_propertyFactory == address(0)) revert InvalidAddress();
        if (_reviewRegistry == address(0)) revert InvalidAddress();
        if (_propertyEscrow == address(0)) revert InvalidAddress();
        if (_soulboundNFT == address(0)) revert InvalidAddress();

        userRegistry = UserRegistry(_userRegistry);
        propertyFactory = PropertyNFTFactory(_propertyFactory);
        reviewRegistry = ReviewRegistry(_reviewRegistry);
        propertyEscrow = PropertyEscrow(_propertyEscrow);
        soulboundNFT = SoulboundNFT(_soulboundNFT);
    }

    // Create a dispute
    function createDispute(
        DisputeType disputeType,
        address respondent,
        uint256 relatedId,
        string memory description
    ) external onlyRegistered onlyValidDisputeType(disputeType) {
        require(respondent != address(0), "Invalid respondent address");
        require(respondent != msg.sender, "Cannot dispute yourself");
        require(bytes(description).length > 0, "Description cannot be empty");

        _disputeIds++;
        uint256 disputeId = _disputeIds;

        Dispute memory newDispute = Dispute({
            disputeId: disputeId,
            disputeType: disputeType,
            status: DisputeStatus.OPEN,
            complainant: msg.sender,
            respondent: respondent,
            relatedId: relatedId,
            description: description,
            createdAt: block.timestamp,
            resolvedAt: 0,
            resolver: address(0),
            resolution: "",
            complainantWins: false
        });

        disputes[disputeId] = newDispute;
        userDisputes[msg.sender].push(disputeId);
        userDisputes[respondent].push(disputeId);
        disputeTypeCounts[disputeType]++;

        emit DisputeCreated(disputeId, disputeType, msg.sender, respondent, relatedId);
    }

    // Resolve a dispute (admin only)
    function resolveDispute(
        uint256 disputeId,
        bool complainantWins,
        string memory resolution
    ) external onlyAdmin {
        require(disputeId > 0 && disputeId <= _disputeIds, "Invalid dispute ID");
        require(disputes[disputeId].status == DisputeStatus.OPEN, "Dispute not open");
        require(bytes(resolution).length > 0, "Resolution cannot be empty");

        Dispute storage dispute = disputes[disputeId];
        dispute.status = DisputeStatus.RESOLVED;
        dispute.resolvedAt = block.timestamp;
        dispute.resolver = msg.sender;
        dispute.resolution = resolution;
        dispute.complainantWins = complainantWins;

        // Take action based on dispute type and outcome
        _handleDisputeResolution(dispute);

        emit DisputeResolved(disputeId, msg.sender, complainantWins, resolution);
    }

    // Verify a user (admin only)
    function verifyUser(address userAddress, bool verified) external onlyAdmin {
        require(userRegistry.isUserActive(userAddress), "User not registered or inactive");

        UserRegistry.User memory user = userRegistry.getUser(userAddress);
        
        if (verified) {
            require(user.reputationScore >= minReputationForVerification, "Insufficient reputation for verification");
        }

        emit UserVerified(userAddress, verified);
    }

    // Remove a property (admin only)
    function removeProperty(uint256 propertyId, string memory reason) external onlyAdmin {
        require(propertyId > 0, "Invalid property ID");
        require(bytes(reason).length > 0, "Reason cannot be empty");

        // Note: Actual property removal would require additional logic in PropertyNFTFactory
        emit PropertyRemoved(propertyId, reason);
    }

    // Remove a review (admin only)
    function removeReview(uint256 reviewId, string memory reason) external onlyAdmin {
        require(reviewId > 0, "Invalid review ID");
        require(bytes(reason).length > 0, "Reason cannot be empty");

        reviewRegistry.invalidateReview(reviewId, reason);
        emit ReviewRemoved(reviewId, reason);
    }

    // Update platform fee percentage (admin only)
    function updatePlatformFee(uint256 newFeePercentage) external onlyAdmin {
        require(newFeePercentage <= 10, "Fee cannot exceed 10%");
        uint256 oldFee = platformFeePercentage;
        platformFeePercentage = newFeePercentage;

        emit PlatformFeeUpdated(oldFee, newFeePercentage);
    }

    // Update platform limits (admin only)
    function updatePlatformLimits(
        uint256 newMaxProperties,
        uint256 newMaxReviews,
        uint256 newMinReputation
    ) external onlyAdmin {
        uint256 oldMaxProperties = maxPropertiesPerUser;
        uint256 oldMaxReviews = maxReviewsPerProperty;
        uint256 oldMinReputation = minReputationForVerification;

        maxPropertiesPerUser = newMaxProperties;
        maxReviewsPerProperty = newMaxReviews;
        minReputationForVerification = newMinReputation;

        emit ConfigUpdated("maxPropertiesPerUser", oldMaxProperties, newMaxProperties);
        emit ConfigUpdated("maxReviewsPerProperty", oldMaxReviews, newMaxReviews);
        emit ConfigUpdated("minReputationForVerification", oldMinReputation, newMinReputation);
    }

    // Pause platform (admin only)
    function pausePlatform(string memory reason) external onlyAdmin {
        _pause();
        emit PlatformPaused(msg.sender, reason);
    }

    // Unpause platform (admin only)
    function unpausePlatform() external onlyAdmin {
        _unpause();
        emit PlatformUnpaused(msg.sender);
    }

    // Award badge to user (admin only)
    function awardBadgeToUser(
        address userAddress,
        SoulboundNFT.BadgeType badgeType,
        string memory metadata,
        uint256 level
    ) external onlyAdmin {
        soulboundNFT.awardBadge(userAddress, badgeType, metadata, level);
    }

    // Admin management functions
    function addAdmin(address newAdmin) external onlyAdmin {
        if (newAdmin == address(0)) revert InvalidAddress();
        for (uint8 i = 0; i < adminCount; i++) {
            if (admin[i] == newAdmin) revert InvalidAddress();
        }
        if (adminCount >= MAX_ADMINS) revert AdminLimitReached();

        admin[adminCount] = newAdmin;
        adminCount++;
        emit AdminAdded(newAdmin);
    }

    function removeAdmin(address adminToRemove) external onlyAdmin {
        if (adminToRemove == address(0)) revert InvalidAddress();
        if (adminCount <= 1) revert CannotRemoveLastAdmin();

        bool found;
        uint8 index;
        for (uint8 i = 0; i < adminCount; i++) {
            if (admin[i] == adminToRemove) {
                found = true;
                index = i;
                break;
            }
        }
        if (!found) revert InvalidAddress();

        admin[index] = admin[adminCount - 1];
        delete admin[adminCount - 1];
        adminCount--;
        emit AdminRemoved(adminToRemove);
    }

    // Withdrawal proposal system
    function proposeWithdrawal(uint96 amount) external onlyAdmin nonReentrant returns (uint32) {
        if (amount == 0) revert InvalidAmount();
        if (address(this).balance < amount) revert InsufficientFunds();

        proposalCounter++;
        WithdrawalProposal storage proposal = withdrawalProposals[proposalCounter];
        proposal.proposer = msg.sender;
        proposal.amount = amount;
        proposal.approvals = 1;
        proposal.hasApproved[msg.sender] = true;

        emit WithdrawalProposed(proposalCounter, msg.sender, amount);
        return proposalCounter;
    }

    function approveWithdrawal(uint32 proposalId) external onlyAdmin nonReentrant {
        WithdrawalProposal storage proposal = withdrawalProposals[proposalId];
        if (proposal.amount == 0) revert InvalidProposal();
        if (proposal.executed) revert ProposalExecuted();
        if (proposal.hasApproved[msg.sender]) revert AlreadyApproved();

        proposal.hasApproved[msg.sender] = true;
        proposal.approvals++;

        emit WithdrawalApproved(proposalId, msg.sender);

        uint8 requiredApprovals = uint8((adminCount * 70) / 100);
        if (proposal.approvals >= requiredApprovals) {
            proposal.executed = true;
            (bool success, ) = proposal.proposer.call{value: proposal.amount}("");
            if (!success) revert("Transfer failed");
            emit WithdrawalExecuted(proposalId, proposal.amount);
        }
    }

    // Get dispute details
    function getDispute(uint256 disputeId) external view returns (Dispute memory) {
        require(disputeId > 0 && disputeId <= _disputeIds, "Invalid dispute ID");
        return disputes[disputeId];
    }

    // Get user's disputes
    function getUserDisputes(address userAddress) external view returns (uint256[] memory) {
        return userDisputes[userAddress];
    }

    // Get platform statistics
    function getPlatformStats() external view returns (PlatformStats memory) {
        return PlatformStats({
            totalUsers: userRegistry.getTotalUsers(),
            totalProperties: propertyFactory.getTotalProperties(),
            totalReviews: reviewRegistry.getTotalReviews(),
            totalEscrows: propertyEscrow.getTotalEscrows(),
            totalDisputes: _disputeIds,
            totalRevenue: address(this).balance,
            activeSubscriptions: 0 // Would need to be tracked separately
        });
    }

    // Get dispute count by type
    function getDisputeCountByType(DisputeType disputeType) 
        external 
        view 
        onlyValidDisputeType(disputeType) 
        returns (uint256) 
    {
        return disputeTypeCounts[disputeType];
    }

    // Get total number of disputes
    function getTotalDisputes() external view returns (uint256) {
        return _disputeIds;
    }

    // Check if user is verified
    function isUserVerified(address userAddress) external view returns (bool) {
        if (!userRegistry.isUserActive(userAddress)) return false;
        UserRegistry.User memory user = userRegistry.getUser(userAddress);
        return user.reputationScore >= minReputationForVerification;
    }

    // Get contract balance
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Internal function to handle dispute resolution
    function _handleDisputeResolution(Dispute storage dispute) internal {
        if (dispute.disputeType == DisputeType.REVIEW_DISPUTE) {
            if (dispute.complainantWins) {
                // Remove the review
                reviewRegistry.invalidateReview(dispute.relatedId, "Dispute resolved in favor of complainant");
            }
        } else if (dispute.disputeType == DisputeType.ESCROW_DISPUTE) {
            if (dispute.complainantWins) {
                // Resolve escrow in favor of complainant
                propertyEscrow.resolveDispute(dispute.relatedId, true);
            } else {
                // Resolve escrow in favor of respondent
                propertyEscrow.resolveDispute(dispute.relatedId, false);
            }
        } else if (dispute.disputeType == DisputeType.USER_DISPUTE) {
            if (dispute.complainantWins) {
                // Take action against respondent (e.g., reduce reputation, suspend)
                userRegistry.updateReputation(dispute.respondent, -50, 0);
            } else {
                // Take action against complainant
                userRegistry.updateReputation(dispute.complainant, -20, 0);
            }
        }
    }

    // Emergency function to handle stuck disputes (admin only)
    function emergencyCloseDispute(uint256 disputeId) external onlyAdmin {
        require(disputeId > 0 && disputeId <= _disputeIds, "Invalid dispute ID");
        require(disputes[disputeId].status == DisputeStatus.OPEN, "Dispute not open");

        disputes[disputeId].status = DisputeStatus.CLOSED;
        disputes[disputeId].resolvedAt = block.timestamp;
        disputes[disputeId].resolver = msg.sender;
    }

    // Receive function to accept payments
    receive() external payable {}
}
