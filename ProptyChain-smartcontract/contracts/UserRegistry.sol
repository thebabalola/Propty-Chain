// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";


// User identity and reputation management system
contract UserRegistry is Ownable {

    enum UserRole {
        SEEKER,
        OWNER,
        AGENT,
        REPRESENTATIVE
    }

    struct User {
        string fullName;
        uint256 registrationTimestamp;
        string did; // Decentralized Identifier
        UserRole role;
        bool isActive;
        uint256 reputationScore;
        uint256 totalReviews;
        uint256 totalProperties;
    }

    // State variables
    uint256 private _userIds;
    mapping(address => uint256) public addressToUserId;
    mapping(uint256 => User) public users;
    mapping(address => bool) public isRegistered;
    
    // Events
    event UserRegistered(
        address indexed userAddress,
        uint256 indexed userId,
        string fullName,
        UserRole role,
        string did
    );
    
    event UserRoleUpdated(
        address indexed userAddress,
        uint256 indexed userId,
        UserRole newRole
    );
    
    event UserDeactivated(
        address indexed userAddress,
        uint256 indexed userId
    );
    
    event ReputationUpdated(
        address indexed userAddress,
        uint256 indexed userId,
        uint256 newScore,
        uint256 totalReviews
    );

    // Modifiers
    modifier onlyRegistered() {
        require(isRegistered[msg.sender], "User not registered");
        _;
    }

    modifier onlyAdmin() {
        require(owner() == msg.sender, "Only admin can perform this action");
        _;
    }

    // Constructor
    constructor() Ownable(msg.sender) {}

    // Register a new user
    function registerUser(
        string memory fullName,
        string memory did,
        UserRole role
    ) external {
        require(!isRegistered[msg.sender], "User already registered");
        require(bytes(fullName).length > 0, "Full name cannot be empty");
        require(bytes(did).length > 0, "DID cannot be empty");

        _userIds++;
        uint256 userId = _userIds;

        User memory newUser = User({
            fullName: fullName,
            registrationTimestamp: block.timestamp,
            did: did,
            role: role,
            isActive: true,
            reputationScore: 0,
            totalReviews: 0,
            totalProperties: 0
        });

        users[userId] = newUser;
        addressToUserId[msg.sender] = userId;
        isRegistered[msg.sender] = true;

        emit UserRegistered(msg.sender, userId, fullName, role, did);
    }

    // Get user information
    function getUser(address userAddress) external view returns (User memory) {
        require(isRegistered[userAddress], "User not registered");
        uint256 userId = addressToUserId[userAddress];
        return users[userId];
    }

    // Get user by ID
    function getUserById(uint256 userId) external view returns (User memory) {
        require(userId > 0 && userId <= _userIds, "Invalid user ID");
        return users[userId];
    }

    // Update user role (admin only)
    function updateUserRole(address userAddress, UserRole newRole) external onlyAdmin {
        require(isRegistered[userAddress], "User not registered");
        uint256 userId = addressToUserId[userAddress];
        users[userId].role = newRole;
        
        emit UserRoleUpdated(userAddress, userId, newRole);
    }

    // Deactivate user (admin only)
    function deactivateUser(address userAddress) external onlyAdmin {
        require(isRegistered[userAddress], "User not registered");
        uint256 userId = addressToUserId[userAddress];
        users[userId].isActive = false;
        
        emit UserDeactivated(userAddress, userId);
    }

    // Update user reputation (called by other contracts)
    function updateReputation(
        address userAddress,
        int256 scoreChange,
        uint256 reviewCount
    ) external onlyAdmin {
        require(isRegistered[userAddress], "User not registered");
        uint256 userId = addressToUserId[userAddress];
        
        if (scoreChange > 0) {
            users[userId].reputationScore += uint256(scoreChange);
        } else {
            users[userId].reputationScore = users[userId].reputationScore > uint256(-scoreChange) 
                ? users[userId].reputationScore - uint256(-scoreChange) 
                : 0;
        }
        
        users[userId].totalReviews = reviewCount;
        
        emit ReputationUpdated(userAddress, userId, users[userId].reputationScore, reviewCount);
    }

    // Update user property count
    function updatePropertyCount(address userAddress, uint256 propertyCount) external onlyAdmin {
        require(isRegistered[userAddress], "User not registered");
        uint256 userId = addressToUserId[userAddress];
        users[userId].totalProperties = propertyCount;
    }

    // Check if user is registered and active
    function isUserActive(address userAddress) external view returns (bool) {
        if (!isRegistered[userAddress]) return false;
        uint256 userId = addressToUserId[userAddress];
        return users[userId].isActive;
    }

    // Get total number of registered users
    function getTotalUsers() external view returns (uint256) {
        return _userIds;
    }

    // Get user ID by address
    function getUserId(address userAddress) external view returns (uint256) {
        require(isRegistered[userAddress], "User not registered");
        return addressToUserId[userAddress];
    }
}
