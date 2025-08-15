// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./UserRegistry.sol";
import "./AdminContract.sol";

// Soulbound NFT contract for achievement-based rewards
// Soulbound NFTs cannot be transferred - they represent reputation and achievements
contract SoulboundNFT is ERC721, ERC721URIStorage, Ownable {

    enum BadgeType {
        TRUSTED_OWNER,
        TOP_REVIEWER,
        VERIFIED_PROFESSIONAL,
        FIRST_PROPERTY,
        SUCCESSFUL_TRANSACTION,
        COMMUNITY_CONTRIBUTOR,
        EARLY_ADOPTER,
        PREMIUM_MEMBER
    }

    struct Badge {
        uint256 badgeId;
        BadgeType badgeType;
        address recipient;
        uint256 awardedAt;
        string metadata; // IPFS hash for badge metadata
        bool isActive;
        uint256 level; // Badge level (1-5)
    }

    struct BadgeRequirements {
        BadgeType badgeType;
        uint256 minProperties;
        uint256 minReviews;
        uint256 minReputation;
        uint256 minTransactions;
        uint256 minDaysActive;
    }

    // State variables
    uint256 private _badgeIds;
    mapping(uint256 => Badge) public badges;
    mapping(address => uint256[]) public userBadges; // user => badge IDs
    mapping(address => mapping(BadgeType => uint256)) public userBadgeCount; // user => badgeType => count
    mapping(BadgeType => BadgeRequirements) public badgeRequirements;
    
    // Contracts
    UserRegistry public userRegistry;
    AdminContract public adminContract;
    
    // Events
    event BadgeAwarded(
        uint256 indexed badgeId,
        address indexed recipient,
        BadgeType badgeType,
        uint256 level
    );
    
    event BadgeRevoked(
        uint256 indexed badgeId,
        address indexed recipient,
        BadgeType badgeType,
        string reason
    );
    
    event BadgeLevelUp(
        uint256 indexed badgeId,
        address indexed recipient,
        BadgeType badgeType,
        uint256 newLevel
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

    modifier onlyValidBadgeType(BadgeType badgeType) {
        require(uint256(badgeType) <= 7, "Invalid badge type");
        _;
    }

    modifier onlyAdmin() {
        require(adminContract.isAdmin(msg.sender), "Only admin can perform this action");
        _;
    }

    // Constructor
    constructor(address _userRegistry, address payable _adminContract) ERC721("ProptyChain Soulbound Badge", "PSB") Ownable(msg.sender) {
        userRegistry = UserRegistry(_userRegistry);
        adminContract = AdminContract(_adminContract);
        _initializeBadgeRequirements();
    }

    // Initialize badge requirements
    function _initializeBadgeRequirements() internal {
        // Trusted Owner Badge
        badgeRequirements[BadgeType.TRUSTED_OWNER] = BadgeRequirements({
            badgeType: BadgeType.TRUSTED_OWNER,
            minProperties: 5,
            minReviews: 0,
            minReputation: 100,
            minTransactions: 3,
            minDaysActive: 30
        });

        // Top Reviewer Badge
        badgeRequirements[BadgeType.TOP_REVIEWER] = BadgeRequirements({
            badgeType: BadgeType.TOP_REVIEWER,
            minProperties: 0,
            minReviews: 20,
            minReputation: 200,
            minTransactions: 0,
            minDaysActive: 60
        });

        // Verified Professional Badge
        badgeRequirements[BadgeType.VERIFIED_PROFESSIONAL] = BadgeRequirements({
            badgeType: BadgeType.VERIFIED_PROFESSIONAL,
            minProperties: 10,
            minReviews: 10,
            minReputation: 500,
            minTransactions: 10,
            minDaysActive: 90
        });

        // First Property Badge
        badgeRequirements[BadgeType.FIRST_PROPERTY] = BadgeRequirements({
            badgeType: BadgeType.FIRST_PROPERTY,
            minProperties: 1,
            minReviews: 0,
            minReputation: 0,
            minTransactions: 0,
            minDaysActive: 0
        });

        // Successful Transaction Badge
        badgeRequirements[BadgeType.SUCCESSFUL_TRANSACTION] = BadgeRequirements({
            badgeType: BadgeType.SUCCESSFUL_TRANSACTION,
            minProperties: 0,
            minReviews: 0,
            minReputation: 0,
            minTransactions: 1,
            minDaysActive: 0
        });

        // Community Contributor Badge
        badgeRequirements[BadgeType.COMMUNITY_CONTRIBUTOR] = BadgeRequirements({
            badgeType: BadgeType.COMMUNITY_CONTRIBUTOR,
            minProperties: 0,
            minReviews: 5,
            minReputation: 50,
            minTransactions: 0,
            minDaysActive: 15
        });

        // Early Adopter Badge
        badgeRequirements[BadgeType.EARLY_ADOPTER] = BadgeRequirements({
            badgeType: BadgeType.EARLY_ADOPTER,
            minProperties: 0,
            minReviews: 0,
            minReputation: 0,
            minTransactions: 0,
            minDaysActive: 0
        });

        // Premium Member Badge
        badgeRequirements[BadgeType.PREMIUM_MEMBER] = BadgeRequirements({
            badgeType: BadgeType.PREMIUM_MEMBER,
            minProperties: 0,
            minReviews: 0,
            minReputation: 0,
            minTransactions: 0,
            minDaysActive: 0
        });
    }

    // Award a badge to a user (admin only - for special cases)
    function awardBadge(
        address recipient,
        BadgeType badgeType,
        string memory metadata,
        uint256 level
    ) external onlyAdmin onlyValidBadgeType(badgeType) {
        require(userRegistry.isUserActive(recipient), "Recipient not registered or inactive");
        require(level >= 1 && level <= 5, "Invalid badge level");
        require(bytes(metadata).length > 0, "Metadata cannot be empty");

        _mintBadge(recipient, badgeType, metadata, level);
    }

    // User-initiated badge minting
    function mintBadge(BadgeType badgeType, string memory metadata) external onlyRegistered onlyValidBadgeType(badgeType) {
        require(bytes(metadata).length > 0, "Metadata cannot be empty");
        require(checkBadgeEligibility(msg.sender, badgeType), "Not eligible for this badge");
        require(userBadgeCount[msg.sender][badgeType] == 0, "Already have this badge type");

        // Mint badge with level 1 (default)
        _mintBadge(msg.sender, badgeType, metadata, 1);
    }

    // Internal function to mint badge
    function _mintBadge(
        address recipient,
        BadgeType badgeType,
        string memory metadata,
        uint256 level
    ) internal {
        _badgeIds++;
        uint256 badgeId = _badgeIds;

        Badge memory newBadge = Badge({
            badgeId: badgeId,
            badgeType: badgeType,
            recipient: recipient,
            awardedAt: block.timestamp,
            metadata: metadata,
            isActive: true,
            level: level
        });

        badges[badgeId] = newBadge;
        userBadges[recipient].push(badgeId);
        userBadgeCount[recipient][badgeType]++;

        // Mint Soulbound NFT
        _safeMint(recipient, badgeId);
        _setTokenURI(badgeId, metadata);

        emit BadgeAwarded(badgeId, recipient, badgeType, level);
    }

    // Check if user qualifies for a badge
    function checkBadgeEligibility(address userAddress, BadgeType badgeType) 
        public 
        view 
        onlyValidBadgeType(badgeType) 
        returns (bool)
    {
        if (!userRegistry.isUserActive(userAddress)) return false;

        UserRegistry.User memory user = userRegistry.getUser(userAddress);
        BadgeRequirements memory requirements = badgeRequirements[badgeType];

        // Check if user already has this badge type
        if (userBadgeCount[userAddress][badgeType] > 0) return false;

        // Check requirements based on badge type
        if (badgeType == BadgeType.TRUSTED_OWNER) {
            return user.totalProperties >= requirements.minProperties &&
                   user.reputationScore >= requirements.minReputation &&
                   (block.timestamp - user.registrationTimestamp) >= requirements.minDaysActive * 1 days;
        } else if (badgeType == BadgeType.TOP_REVIEWER) {
            return user.totalReviews >= requirements.minReviews &&
                   user.reputationScore >= requirements.minReputation &&
                   (block.timestamp - user.registrationTimestamp) >= requirements.minDaysActive * 1 days;
        } else if (badgeType == BadgeType.VERIFIED_PROFESSIONAL) {
            return user.totalProperties >= requirements.minProperties &&
                   user.totalReviews >= requirements.minReviews &&
                   user.reputationScore >= requirements.minReputation &&
                   (block.timestamp - user.registrationTimestamp) >= requirements.minDaysActive * 1 days;
        } else if (badgeType == BadgeType.FIRST_PROPERTY) {
            return user.totalProperties >= requirements.minProperties;
        } else if (badgeType == BadgeType.COMMUNITY_CONTRIBUTOR) {
            return user.totalReviews >= requirements.minReviews &&
                   user.reputationScore >= requirements.minReputation &&
                   (block.timestamp - user.registrationTimestamp) >= requirements.minDaysActive * 1 days;
        }

        return false;
    }

    // Revoke a badge (admin only)
    function revokeBadge(uint256 badgeId, string memory reason) external onlyAdmin {
        require(badgeId > 0 && badgeId <= _badgeIds, "Invalid badge ID");
        require(badges[badgeId].isActive, "Badge already revoked");

        Badge storage badge = badges[badgeId];
        badge.isActive = false;

        emit BadgeRevoked(badgeId, badge.recipient, badge.badgeType, reason);
    }

    // Level up a badge (admin only)
    function levelUpBadge(uint256 badgeId, uint256 newLevel) external onlyAdmin {
        require(badgeId > 0 && badgeId <= _badgeIds, "Invalid badge ID");
        require(newLevel >= 1 && newLevel <= 5, "Invalid badge level");
        require(badges[badgeId].isActive, "Badge not active");

        Badge storage badge = badges[badgeId];
        uint256 oldLevel = badge.level;
        badge.level = newLevel;

        emit BadgeLevelUp(badgeId, badge.recipient, badge.badgeType, newLevel);
    }

    // Update badge requirements (admin only)
    function updateBadgeRequirements(
        BadgeType badgeType,
        uint256 minProperties,
        uint256 minReviews,
        uint256 minReputation,
        uint256 minTransactions,
        uint256 minDaysActive
    ) external onlyAdmin onlyValidBadgeType(badgeType) {
        BadgeRequirements storage requirements = badgeRequirements[badgeType];
        
        // Store old values for event
        uint256 oldMinProperties = requirements.minProperties;
        uint256 oldMinReviews = requirements.minReviews;
        uint256 oldMinReputation = requirements.minReputation;
        uint256 oldMinTransactions = requirements.minTransactions;
        uint256 oldMinDaysActive = requirements.minDaysActive;
        
        // Update requirements
        requirements.minProperties = minProperties;
        requirements.minReviews = minReviews;
        requirements.minReputation = minReputation;
        requirements.minTransactions = minTransactions;
        requirements.minDaysActive = minDaysActive;

        emit ConfigUpdated("badgeRequirements", uint256(badgeType), 1);
    }

    // Update individual requirement fields
    function updateBadgeMinProperties(BadgeType badgeType, uint256 minProperties) external onlyAdmin onlyValidBadgeType(badgeType) {
        uint256 oldValue = badgeRequirements[badgeType].minProperties;
        badgeRequirements[badgeType].minProperties = minProperties;
        emit ConfigUpdated("minProperties", oldValue, minProperties);
    }

    function updateBadgeMinReviews(BadgeType badgeType, uint256 minReviews) external onlyAdmin onlyValidBadgeType(badgeType) {
        uint256 oldValue = badgeRequirements[badgeType].minReviews;
        badgeRequirements[badgeType].minReviews = minReviews;
        emit ConfigUpdated("minReviews", oldValue, minReviews);
    }

    function updateBadgeMinReputation(BadgeType badgeType, uint256 minReputation) external onlyAdmin onlyValidBadgeType(badgeType) {
        uint256 oldValue = badgeRequirements[badgeType].minReputation;
        badgeRequirements[badgeType].minReputation = minReputation;
        emit ConfigUpdated("minReputation", oldValue, minReputation);
    }

    function updateBadgeMinTransactions(BadgeType badgeType, uint256 minTransactions) external onlyAdmin onlyValidBadgeType(badgeType) {
        uint256 oldValue = badgeRequirements[badgeType].minTransactions;
        badgeRequirements[badgeType].minTransactions = minTransactions;
        emit ConfigUpdated("minTransactions", oldValue, minTransactions);
    }

    function updateBadgeMinDaysActive(BadgeType badgeType, uint256 minDaysActive) external onlyAdmin onlyValidBadgeType(badgeType) {
        uint256 oldValue = badgeRequirements[badgeType].minDaysActive;
        badgeRequirements[badgeType].minDaysActive = minDaysActive;
        emit ConfigUpdated("minDaysActive", oldValue, minDaysActive);
    }

    // Get badge details
    function getBadge(uint256 badgeId) external view returns (Badge memory) {
        require(badgeId > 0 && badgeId <= _badgeIds, "Invalid badge ID");
        return badges[badgeId];
    }

    // Get user's badges
    function getUserBadges(address userAddress) external view returns (uint256[] memory) {
        return userBadges[userAddress];
    }

    // Get user's badge count by type
    function getUserBadgeCount(address userAddress, BadgeType badgeType) 
        external 
        view 
        onlyValidBadgeType(badgeType) 
        returns (uint256) 
    {
        return userBadgeCount[userAddress][badgeType];
    }

    // Get badge requirements
    function getBadgeRequirements(BadgeType badgeType) 
        external 
        view 
        onlyValidBadgeType(badgeType) 
        returns (BadgeRequirements memory) 
    {
        return badgeRequirements[badgeType];
    }

    // Get total number of badges
    function getTotalBadges() external view returns (uint256) {
        return _badgeIds;
    }

    // Check if user has a specific badge type
    function hasBadge(address userAddress, BadgeType badgeType) 
        external 
        view 
        onlyValidBadgeType(badgeType) 
        returns (bool) 
    {
        return userBadgeCount[userAddress][badgeType] > 0;
    }

    // Get user's total badge count
    function getUserTotalBadgeCount(address userAddress) external view returns (uint256) {
        return userBadges[userAddress].length;
    }

    // Get user's progress towards a specific badge
    function getUserBadgeProgress(address userAddress, BadgeType badgeType) 
        external 
        view 
        onlyValidBadgeType(badgeType) 
        returns (
            uint256 currentProperties,
            uint256 requiredProperties,
            uint256 currentReviews,
            uint256 requiredReviews,
            uint256 currentReputation,
            uint256 requiredReputation,
            uint256 currentTransactions,
            uint256 requiredTransactions,
            uint256 currentDaysActive,
            uint256 requiredDaysActive,
            bool isEligible
        ) 
    {
        if (!userRegistry.isUserActive(userAddress)) {
            return (0, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);
        }

        UserRegistry.User memory user = userRegistry.getUser(userAddress);
        BadgeRequirements memory requirements = badgeRequirements[badgeType];

        currentProperties = user.totalProperties;
        requiredProperties = requirements.minProperties;
        currentReviews = user.totalReviews;
        requiredReviews = requirements.minReviews;
        currentReputation = user.reputationScore;
        requiredReputation = requirements.minReputation;
        currentTransactions = 0; // Would need to be tracked separately
        requiredTransactions = requirements.minTransactions;
        currentDaysActive = (block.timestamp - user.registrationTimestamp) / 1 days;
        requiredDaysActive = requirements.minDaysActive;

        isEligible = checkBadgeEligibility(userAddress, badgeType);
    }

    // Get all badges user is eligible for
    function getEligibleBadges(address userAddress) external view returns (BadgeType[] memory) {
        if (!userRegistry.isUserActive(userAddress)) {
            return new BadgeType[](0);
        }

        BadgeType[] memory eligibleBadges = new BadgeType[](8); // Max 8 badge types
        uint256 eligibleCount = 0;

        for (uint256 i = 0; i < 8; i++) {
            BadgeType badgeType = BadgeType(i);
            if (checkBadgeEligibility(userAddress, badgeType) && 
                userBadgeCount[userAddress][badgeType] == 0) {
                eligibleBadges[eligibleCount] = badgeType;
                eligibleCount++;
            }
        }

        // Resize array to actual count
        BadgeType[] memory result = new BadgeType[](eligibleCount);
        for (uint256 i = 0; i < eligibleCount; i++) {
            result[i] = eligibleBadges[i];
        }

        return result;
    }



    // Override required functions
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }


}
