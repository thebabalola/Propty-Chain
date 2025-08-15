// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./UserRegistry.sol";

// Factory contract for creating and managing property NFTs
contract PropertyNFTFactory is ERC721, ERC721URIStorage, Ownable {

    enum PropertyType {
        RESIDENTIAL,
        COMMERCIAL,
        LAND,
        HOTEL,
        SHORTLET
    }

    struct PropertyMetadata {
        PropertyType propertyType;
        string location;
        uint256 price;
        uint256 creationTimestamp;
        address owner;
        bool isListed;
        string tokenURI; // IPFS URI containing images, descriptions, etc.
    }

    // State variables
    uint256 private _tokenIds;
    mapping(uint256 => PropertyMetadata) public properties;
    mapping(address => uint256) public userPropertyCount;
    mapping(address => bool) public hasFreeUploads;
    mapping(address => uint256) public subscriptionExpiry;
    
    // Dynamic configurable values
    uint256 public freeUploadsLimit = 2;
    uint256 public subscriptionPrice = 3 ether; // $3 in wei (assuming 1 ETH = $1)
    uint256 public subscriptionDuration = 30 days;
    
    // Contracts
    UserRegistry public userRegistry;
    
    // Events
    event PropertyCreated(
        uint256 indexed tokenId,
        address indexed owner,
        PropertyType propertyType,
        string location,
        uint256 price,
        string tokenURI
    );
    
    event PropertyListed(
        uint256 indexed tokenId,
        address indexed owner,
        bool isListed
    );
    
    event SubscriptionPurchased(
        address indexed user,
        uint256 expiryDate
    );
    
    event PropertyTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to
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

    modifier onlyPropertyOwner(uint256 tokenId) {
        require(ownerOf(tokenId) == msg.sender, "Not property owner");
        _;
    }

    modifier onlyValidPropertyType(PropertyType propertyType) {
        require(uint256(propertyType) <= 4, "Invalid property type");
        _;
    }

    modifier onlyAdmin() {
        require(owner() == msg.sender, "Only admin can perform this action");
        _;
    }

    // Constructor
    constructor(address _userRegistry) ERC721("ProptyChain Property", "PROP") Ownable(msg.sender) {
        userRegistry = UserRegistry(_userRegistry);
    }

    // Create a new property NFT
    function createProperty(
        PropertyType propertyType,
        string memory location,
        uint256 price,
        string memory tokenURI
    ) external onlyRegistered onlyValidPropertyType(propertyType) {
        require(bytes(location).length > 0, "Location cannot be empty");
        require(price > 0, "Price must be greater than 0");
        require(bytes(tokenURI).length > 0, "Token URI cannot be empty");

        // Check upload limits
        if (!hasFreeUploads[msg.sender] && userPropertyCount[msg.sender] >= freeUploadsLimit) {
            require(
                subscriptionExpiry[msg.sender] > block.timestamp,
                "Free upload limit reached. Purchase subscription to continue."
            );
        }

        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        PropertyMetadata memory newProperty = PropertyMetadata({
            propertyType: propertyType,
            location: location,
            price: price,
            creationTimestamp: block.timestamp,
            owner: msg.sender,
            isListed: false,
            tokenURI: tokenURI
        });

        properties[newTokenId] = newProperty;
        userPropertyCount[msg.sender]++;

        // Mint NFT
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        // Update user property count in UserRegistry
        userRegistry.updatePropertyCount(msg.sender, userPropertyCount[msg.sender]);

        emit PropertyCreated(newTokenId, msg.sender, propertyType, location, price, tokenURI);
    }

    // Purchase subscription for unlimited uploads
    function purchaseSubscription() external payable {
        require(msg.value >= subscriptionPrice, "Insufficient payment for subscription");
        
        uint256 currentExpiry = subscriptionExpiry[msg.sender];
        uint256 newExpiry = currentExpiry > block.timestamp 
            ? currentExpiry + subscriptionDuration 
            : block.timestamp + subscriptionDuration;
        
        subscriptionExpiry[msg.sender] = newExpiry;
        
        emit SubscriptionPurchased(msg.sender, newExpiry);
    }

    // List/unlist property for sale
    function setPropertyListed(uint256 tokenId, bool isListed) 
        external 
        onlyPropertyOwner(tokenId) 
    {
        properties[tokenId].isListed = isListed;
        emit PropertyListed(tokenId, msg.sender, isListed);
    }

    // Update property metadata (only owner can update)
    function updatePropertyMetadata(
        uint256 tokenId,
        uint256 newPrice,
        string memory newTokenURI
    ) external onlyPropertyOwner(tokenId) {
        require(newPrice > 0, "Price must be greater than 0");
        require(bytes(newTokenURI).length > 0, "Token URI cannot be empty");

        properties[tokenId].price = newPrice;
        properties[tokenId].tokenURI = newTokenURI;
        _setTokenURI(tokenId, newTokenURI);
    }

    // Get property metadata
    function getProperty(uint256 tokenId) external view returns (PropertyMetadata memory) {
        require(tokenId > 0 && tokenId <= _tokenIds, "Property does not exist");
        return properties[tokenId];
    }

    // Get user's property count
    function getUserPropertyCount(address userAddress) external view returns (uint256) {
        return userPropertyCount[userAddress];
    }

    // Check if user has active subscription
    function hasActiveSubscription(address userAddress) external view returns (bool) {
        return subscriptionExpiry[userAddress] > block.timestamp;
    }

    // Get user's subscription expiry
    function getSubscriptionExpiry(address userAddress) external view returns (uint256) {
        return subscriptionExpiry[userAddress];
    }

    // Check if user can upload more properties
    function canUploadMore(address userAddress) external view returns (bool) {
        if (hasFreeUploads[userAddress] || userPropertyCount[userAddress] < freeUploadsLimit) {
            return true;
        }
        return subscriptionExpiry[userAddress] > block.timestamp;
    }

    // Get total number of properties
    function getTotalProperties() external view returns (uint256) {
        return _tokenIds;
    }

    // Admin functions to update configurable values
    function updateFreeUploadsLimit(uint256 newLimit) external onlyAdmin {
        uint256 oldLimit = freeUploadsLimit;
        freeUploadsLimit = newLimit;
        emit ConfigUpdated("freeUploadsLimit", oldLimit, newLimit);
    }

    function updateSubscriptionPrice(uint256 newPrice) external onlyAdmin {
        uint256 oldPrice = subscriptionPrice;
        subscriptionPrice = newPrice;
        emit ConfigUpdated("subscriptionPrice", oldPrice, newPrice);
    }

    function updateSubscriptionDuration(uint256 newDuration) external onlyAdmin {
        uint256 oldDuration = subscriptionDuration;
        subscriptionDuration = newDuration;
        emit ConfigUpdated("subscriptionDuration", oldDuration, newDuration);
    }

    // Grant free uploads to a user
    function grantFreeUploads(address userAddress) external onlyAdmin {
        hasFreeUploads[userAddress] = true;
    }

    // Withdraw subscription payments (admin only)
    function withdrawPayments() external onlyAdmin {
        payable(owner()).transfer(address(this).balance);
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
