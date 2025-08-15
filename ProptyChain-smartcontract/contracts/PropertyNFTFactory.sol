// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

import "./UserRegistry.sol";
import "./AdminContract.sol";

// Factory contract for creating and managing property NFTs with Chainlink Data Feeds
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
        uint256 basePrice;           // Original listing price
        uint256 currentMarketPrice;  // Real-time market value from Chainlink
        uint256 priceLastUpdated;    // Timestamp of last price update
        uint256 marketVolatility;    // Risk score (0-100)
        uint256 creationTimestamp;
        address owner;
        bool isListed;
        string tokenURI; // IPFS URI containing images, descriptions, etc.
    }

    struct MarketData {
        uint256 propertyValueIndex;      // Current property market index
        uint256 marketTrend;             // Market trend percentage (positive/negative)
        uint256 interestRate;            // Current mortgage interest rate
        uint256 marketVolatility;        // Overall market volatility score
        uint256 lastUpdated;             // Timestamp of last market data update
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
    
    // Chainlink Data Feeds
    AggregatorV3Interface public propertyPriceFeed;      // Property value index
    AggregatorV3Interface public marketTrendFeed;        // Market trend data
    AggregatorV3Interface public interestRateFeed;       // Interest rates
    AggregatorV3Interface public marketVolatilityFeed;   // Market volatility
    
    // Feed addresses for easy reference and updates
    address public propertyPriceFeedAddress;
    address public marketTrendFeedAddress;
    address public interestRateFeedAddress;
    address public marketVolatilityFeedAddress;
    
    // Market data cache
    MarketData public currentMarketData;
    uint256 public marketDataUpdateInterval = 1 hours;   // How often to update market data
    uint256 public priceUpdateThreshold = 5;             // 5% change threshold for price updates
    
    // Risk management
    uint256 public maxPriceDeviation = 50;               // 50% max deviation from base price
    bool public marketProtectionEnabled = true;          // Enable market protection
    
    // Contracts
    UserRegistry public userRegistry;
    AdminContract public adminContract;
    
    // Events
    event PropertyCreated(
        uint256 indexed tokenId,
        address indexed owner,
        PropertyType propertyType,
        string location,
        uint256 basePrice,
        uint256 currentMarketPrice,
        string tokenUri
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

    event MarketDataUpdated(
        uint256 propertyValueIndex,
        uint256 marketTrend,
        uint256 interestRate,
        uint256 marketVolatility
    );

    event PropertyPriceUpdated(
        uint256 indexed tokenId,
        uint256 oldPrice,
        uint256 newPrice,
        uint256 marketVolatility
    );

    event MarketProtectionTriggered(
        uint256 indexed tokenId,
        string reason
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
        require(adminContract.isAdmin(msg.sender), "Only admin can perform this action");
        _;
    }

    // Constructor
    constructor(address _userRegistry, address payable _adminContract) ERC721("ProptyChain Property", "PROP") Ownable(msg.sender) {
        userRegistry = UserRegistry(_userRegistry);
        adminContract = AdminContract(_adminContract);
    }

    // Update market data from Chainlink feeds
    function updateMarketData() public {
        require(
            block.timestamp >= currentMarketData.lastUpdated + marketDataUpdateInterval,
            "Market data update too frequent"
        );

        // Get latest data from Chainlink feeds
        (
            uint80 roundId,
            int256 propertyValue,
            ,
            uint256 updatedAt,
            uint80 answeredInRound
        ) = propertyPriceFeed.latestRoundData();

        require(answeredInRound >= roundId, "Stale price data");

        (
            ,
            int256 marketTrend,
            ,
            ,
        ) = marketTrendFeed.latestRoundData();

        (
            ,
            int256 interestRate,
            ,
            ,
        ) = interestRateFeed.latestRoundData();

        (
            ,
            int256 volatility,
            ,
            ,
        ) = marketVolatilityFeed.latestRoundData();

        // Update market data
        currentMarketData = MarketData({
            propertyValueIndex: uint256(propertyValue),
            marketTrend: uint256(marketTrend),
            interestRate: uint256(interestRate),
            marketVolatility: uint256(volatility),
            lastUpdated: updatedAt
        });

        emit MarketDataUpdated(
            currentMarketData.propertyValueIndex,
            currentMarketData.marketTrend,
            currentMarketData.interestRate,
            currentMarketData.marketVolatility
        );
    }

    // Calculate current market price based on base price and market conditions
    function calculateMarketPrice(uint256 basePrice) public view returns (uint256) {
        // If Chainlink feeds are not set, return base price
        if (propertyPriceFeedAddress == address(0) || marketTrendFeedAddress == address(0) || 
            interestRateFeedAddress == address(0) || marketVolatilityFeedAddress == address(0)) {
            return basePrice; // Fallback to base price if feeds not set
        }

        if (currentMarketData.propertyValueIndex == 0) {
            return basePrice; // Fallback to base price if no market data
        }

        // Calculate price adjustment based on market trend
        uint256 priceAdjustment = (basePrice * currentMarketData.marketTrend) / 10000; // Assuming trend is in basis points
        uint256 adjustedPrice = basePrice + priceAdjustment;

        // Apply market volatility factor
        uint256 volatilityFactor = (adjustedPrice * currentMarketData.marketVolatility) / 10000;
        uint256 finalPrice = adjustedPrice + volatilityFactor;

        // Ensure price doesn't deviate too much from base price
        uint256 maxDeviation = (basePrice * maxPriceDeviation) / 100;
        if (finalPrice > basePrice + maxDeviation) {
            finalPrice = basePrice + maxDeviation;
        } else if (finalPrice < basePrice - maxDeviation) {
            finalPrice = basePrice - maxDeviation;
        }

        return finalPrice;
    }

    // Update property prices based on current market data
    function updatePropertyPrices() external {
        require(
            block.timestamp >= currentMarketData.lastUpdated + marketDataUpdateInterval,
            "Market data update too frequent"
        );

        updateMarketData();

        for (uint256 i = 1; i <= _tokenIds; i++) {
            PropertyMetadata storage property = properties[i];
            uint256 oldPrice = property.currentMarketPrice;
            uint256 newPrice = calculateMarketPrice(property.basePrice);

            // Only update if price change exceeds threshold
            uint256 priceChange = oldPrice > newPrice ? oldPrice - newPrice : newPrice - oldPrice;
            uint256 changePercentage = (priceChange * 100) / oldPrice;

            if (changePercentage >= priceUpdateThreshold) {
                property.currentMarketPrice = newPrice;
                property.priceLastUpdated = block.timestamp;
                property.marketVolatility = currentMarketData.marketVolatility;

                emit PropertyPriceUpdated(i, oldPrice, newPrice, currentMarketData.marketVolatility);

                // Check if market protection should be triggered
                if (marketProtectionEnabled && changePercentage > 20) {
                    emit MarketProtectionTriggered(i, "Significant price change detected");
                }
            }
        }
    }

    // Create a new property NFT with market data integration
    function createProperty(
        PropertyType propertyType,
        string memory location,
        uint256 basePrice,
        string memory tokenUri
    ) external onlyRegistered onlyValidPropertyType(propertyType) {
        require(bytes(location).length > 0, "Location cannot be empty");
        require(basePrice > 0, "Base price must be greater than 0");
        require(bytes(tokenUri).length > 0, "Token URI cannot be empty");

        // Check upload limits
        if (!hasFreeUploads[msg.sender] && userPropertyCount[msg.sender] >= freeUploadsLimit) {
            require(
                subscriptionExpiry[msg.sender] > block.timestamp,
                "Free upload limit reached. Purchase subscription to continue."
            );
        }

        // Calculate current market price
        uint256 currentMarketPrice = calculateMarketPrice(basePrice);

        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        PropertyMetadata memory newProperty = PropertyMetadata({
            propertyType: propertyType,
            location: location,
            basePrice: basePrice,
            currentMarketPrice: currentMarketPrice,
            priceLastUpdated: block.timestamp,
            marketVolatility: currentMarketData.marketVolatility,
            creationTimestamp: block.timestamp,
            owner: msg.sender,
            isListed: false,
            tokenURI: tokenUri
        });

        properties[newTokenId] = newProperty;
        userPropertyCount[msg.sender]++;

        // Mint NFT
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenUri);

        // Update user property count in UserRegistry
        userRegistry.updatePropertyCount(msg.sender, userPropertyCount[msg.sender]);

        emit PropertyCreated(newTokenId, msg.sender, propertyType, location, basePrice, currentMarketPrice, tokenUri);
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
        uint256 newBasePrice,
        string memory newTokenURI
    ) external onlyPropertyOwner(tokenId) {
        require(newBasePrice > 0, "Base price must be greater than 0");
        require(bytes(newTokenURI).length > 0, "Token URI cannot be empty");

        uint256 oldPrice = properties[tokenId].currentMarketPrice;
        properties[tokenId].basePrice = newBasePrice;
        properties[tokenId].currentMarketPrice = calculateMarketPrice(newBasePrice);
        properties[tokenId].priceLastUpdated = block.timestamp;
        properties[tokenId].tokenURI = newTokenURI;
        _setTokenURI(tokenId, newTokenURI);

        emit PropertyPriceUpdated(tokenId, oldPrice, properties[tokenId].currentMarketPrice, currentMarketData.marketVolatility);
    }

    // Get property metadata
    function getProperty(uint256 tokenId) external view returns (PropertyMetadata memory) {
        require(tokenId > 0 && tokenId <= _tokenIds, "Property does not exist");
        return properties[tokenId];
    }

    // Get current market data
    function getMarketData() external view returns (MarketData memory) {
        return currentMarketData;
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

    // Admin functions for market data configuration
    function updateMarketDataUpdateInterval(uint256 newInterval) external onlyAdmin {
        uint256 oldInterval = marketDataUpdateInterval;
        marketDataUpdateInterval = newInterval;
        emit ConfigUpdated("marketDataUpdateInterval", oldInterval, newInterval);
    }

    function updatePriceUpdateThreshold(uint256 newThreshold) external onlyAdmin {
        uint256 oldThreshold = priceUpdateThreshold;
        priceUpdateThreshold = newThreshold;
        emit ConfigUpdated("priceUpdateThreshold", oldThreshold, newThreshold);
    }

    function updateMaxPriceDeviation(uint256 newDeviation) external onlyAdmin {
        uint256 oldDeviation = maxPriceDeviation;
        maxPriceDeviation = newDeviation;
        emit ConfigUpdated("maxPriceDeviation", oldDeviation, newDeviation);
    }

    function setMarketProtectionEnabled(bool enabled) external onlyAdmin {
        marketProtectionEnabled = enabled;
        emit ConfigUpdated("marketProtectionEnabled", marketProtectionEnabled ? 1 : 0, enabled ? 1 : 0);
    }

    // Admin functions to set and update Chainlink feed addresses
    function setPropertyPriceFeed(address feedAddress) external onlyAdmin {
        require(feedAddress != address(0), "Invalid feed address");
        propertyPriceFeedAddress = feedAddress;
        propertyPriceFeed = AggregatorV3Interface(feedAddress);
        emit ConfigUpdated("propertyPriceFeedAddress", 0, uint256(uint160(feedAddress)));
    }

    function setMarketTrendFeed(address feedAddress) external onlyAdmin {
        require(feedAddress != address(0), "Invalid feed address");
        marketTrendFeedAddress = feedAddress;
        marketTrendFeed = AggregatorV3Interface(feedAddress);
        emit ConfigUpdated("marketTrendFeedAddress", 0, uint256(uint160(feedAddress)));
    }

    function setInterestRateFeed(address feedAddress) external onlyAdmin {
        require(feedAddress != address(0), "Invalid feed address");
        interestRateFeedAddress = feedAddress;
        interestRateFeed = AggregatorV3Interface(feedAddress);
        emit ConfigUpdated("interestRateFeedAddress", 0, uint256(uint160(feedAddress)));
    }

    function setMarketVolatilityFeed(address feedAddress) external onlyAdmin {
        require(feedAddress != address(0), "Invalid feed address");
        marketVolatilityFeedAddress = feedAddress;
        marketVolatilityFeed = AggregatorV3Interface(feedAddress);
        emit ConfigUpdated("marketVolatilityFeedAddress", 0, uint256(uint160(feedAddress)));
    }

    // Set all Chainlink feeds at once
    function setAllChainlinkFeeds(
        address propertyPriceFeedAddr,
        address marketTrendFeedAddr,
        address interestRateFeedAddr,
        address marketVolatilityFeedAddr
    ) external onlyAdmin {
        require(propertyPriceFeedAddr != address(0), "Invalid property price feed address");
        require(marketTrendFeedAddr != address(0), "Invalid market trend feed address");
        require(interestRateFeedAddr != address(0), "Invalid interest rate feed address");
        require(marketVolatilityFeedAddr != address(0), "Invalid market volatility feed address");

        propertyPriceFeedAddress = propertyPriceFeedAddr;
        marketTrendFeedAddress = marketTrendFeedAddr;
        interestRateFeedAddress = interestRateFeedAddr;
        marketVolatilityFeedAddress = marketVolatilityFeedAddr;

        propertyPriceFeed = AggregatorV3Interface(propertyPriceFeedAddr);
        marketTrendFeed = AggregatorV3Interface(marketTrendFeedAddr);
        interestRateFeed = AggregatorV3Interface(interestRateFeedAddr);
        marketVolatilityFeed = AggregatorV3Interface(marketVolatilityFeedAddr);

        emit ConfigUpdated("allChainlinkFeeds", 0, 1);
    }

    // Update existing feed addresses
    function updatePropertyPriceFeed(address newFeedAddress) external onlyAdmin {
        require(newFeedAddress != address(0), "Invalid feed address");
        address oldAddress = propertyPriceFeedAddress;
        propertyPriceFeedAddress = newFeedAddress;
        propertyPriceFeed = AggregatorV3Interface(newFeedAddress);
        emit ConfigUpdated("propertyPriceFeedAddress", uint256(uint160(oldAddress)), uint256(uint160(newFeedAddress)));
    }

    function updateMarketTrendFeed(address newFeedAddress) external onlyAdmin {
        require(newFeedAddress != address(0), "Invalid feed address");
        address oldAddress = marketTrendFeedAddress;
        marketTrendFeedAddress = newFeedAddress;
        marketTrendFeed = AggregatorV3Interface(newFeedAddress);
        emit ConfigUpdated("marketTrendFeedAddress", uint256(uint160(oldAddress)), uint256(uint160(newFeedAddress)));
    }

    function updateInterestRateFeed(address newFeedAddress) external onlyAdmin {
        require(newFeedAddress != address(0), "Invalid feed address");
        address oldAddress = interestRateFeedAddress;
        interestRateFeedAddress = newFeedAddress;
        interestRateFeed = AggregatorV3Interface(newFeedAddress);
        emit ConfigUpdated("interestRateFeedAddress", uint256(uint160(oldAddress)), uint256(uint160(newFeedAddress)));
    }

    function updateMarketVolatilityFeed(address newFeedAddress) external onlyAdmin {
        require(newFeedAddress != address(0), "Invalid feed address");
        address oldAddress = marketVolatilityFeedAddress;
        marketVolatilityFeedAddress = newFeedAddress;
        marketVolatilityFeed = AggregatorV3Interface(newFeedAddress);
        emit ConfigUpdated("marketVolatilityFeedAddress", uint256(uint160(oldAddress)), uint256(uint160(newFeedAddress)));
    }

    // Batch update all feed addresses
    function updateAllFeedAddresses(
        address newPropertyPriceFeed,
        address newMarketTrendFeed,
        address newInterestRateFeed,
        address newMarketVolatilityFeed
    ) external onlyAdmin {
        require(newPropertyPriceFeed != address(0), "Invalid property price feed address");
        require(newMarketTrendFeed != address(0), "Invalid market trend feed address");
        require(newInterestRateFeed != address(0), "Invalid interest rate feed address");
        require(newMarketVolatilityFeed != address(0), "Invalid market volatility feed address");

        // Update all addresses
        propertyPriceFeedAddress = newPropertyPriceFeed;
        marketTrendFeedAddress = newMarketTrendFeed;
        interestRateFeedAddress = newInterestRateFeed;
        marketVolatilityFeedAddress = newMarketVolatilityFeed;

        // Update all interfaces
        propertyPriceFeed = AggregatorV3Interface(newPropertyPriceFeed);
        marketTrendFeed = AggregatorV3Interface(newMarketTrendFeed);
        interestRateFeed = AggregatorV3Interface(newInterestRateFeed);
        marketVolatilityFeed = AggregatorV3Interface(newMarketVolatilityFeed);

        emit ConfigUpdated("allFeedAddresses", 0, 1);
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
