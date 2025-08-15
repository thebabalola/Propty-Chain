# Chainlink Data Feeds Integration - ProptyChain

## Overview

ProptyChain has been enhanced with **Chainlink Data Feeds** to provide real-time property valuation, market-based pricing, and risk assessment. This integration makes the platform more robust and trustworthy by incorporating live market data from multiple sources.

## 🎯 Key Features Added

### 1. **Real-time Property Valuation** ⭐⭐⭐⭐⭐
- **Dynamic Pricing**: Properties now have both `basePrice` (original listing) and `currentMarketPrice` (real-time market value)
- **Market Data Integration**: Prices automatically adjust based on Chainlink feed data
- **Risk Assessment**: Each property includes a `marketVolatility` score (0-100)

### 2. **Market Protection System** ⭐⭐⭐⭐⭐
- **Automatic Cancellation**: Escrows can be automatically cancelled if property values drop significantly (>20%)
- **Dynamic Escrow Amounts**: Escrow amounts adjust based on current market conditions
- **Interest Rate Integration**: Payment terms adjust based on current mortgage rates

### 3. **Risk Management** ⭐⭐⭐⭐
- **Volatility Monitoring**: Real-time market volatility tracking
- **Price Deviation Limits**: Maximum 50% deviation from base price to prevent extreme fluctuations
- **Market Alerts**: Automatic notifications for significant market changes

## 📊 Chainlink Data Feeds Used

### Primary Feeds (Essential)
1. **Property Price Feed** (`propertyPriceFeed`)
   - **Purpose**: Real-time property value index
   - **Usage**: Calculate current market prices for properties
   - **Example Sources**: Zillow Home Value Index, Redfin Market Data

2. **Market Trend Feed** (`marketTrendFeed`)
   - **Purpose**: Housing market trend percentage
   - **Usage**: Adjust property prices based on market direction
   - **Format**: Basis points (e.g., 500 = 5% increase)

3. **Interest Rate Feed** (`interestRateFeed`)
   - **Purpose**: Current mortgage interest rates
   - **Usage**: Adjust escrow amounts and payment terms
   - **Format**: Basis points (e.g., 700 = 7% interest rate)

4. **Market Volatility Feed** (`marketVolatilityFeed`)
   - **Purpose**: Market volatility score
   - **Usage**: Risk assessment and price adjustments
   - **Format**: 0-100 scale (higher = more volatile)

## 🔧 Smart Contract Enhancements

### PropertyNFTFactory.sol - Chainlink Integration Only

#### Price System Explanation
```solidity
// User Input (Static)
uint256 basePrice;           // User sets their desired asking price
// Example: User wants to sell for $500,000

// Chainlink Calculated (Dynamic)  
uint256 currentMarketPrice;  // Real-time market value from Chainlink
// Example: Market data shows property worth $520,000
```

#### New Data Structures
```solidity
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
    string tokenURI;
}

struct MarketData {
    uint256 propertyValueIndex;      // Current property market index
    uint256 marketTrend;             // Market trend percentage
    uint256 interestRate;            // Current mortgage interest rate
    uint256 marketVolatility;        // Overall market volatility score
    uint256 lastUpdated;             // Timestamp of last market data update
}
```

#### New Functions
- `updateMarketData()` - Fetches latest data from Chainlink feeds
- `calculateMarketPrice(uint256 basePrice)` - Calculates current market price
- `updatePropertyPrices()` - Updates all property prices based on market data

#### Dynamic Feed Address Management
- `updatePropertyPriceFeed(address newFeedAddress)` - Update property price feed
- `updateMarketTrendFeed(address newFeedAddress)` - Update market trend feed
- `updateInterestRateFeed(address newFeedAddress)` - Update interest rate feed
- `updateMarketVolatilityFeed(address newFeedAddress)` - Update volatility feed
- `updateAllFeedAddresses(...)` - Batch update all feed addresses

### PropertyEscrow.sol - Reverted to Original (No Chainlink)

#### Original Escrow Structure
```solidity
struct Escrow {
    uint256 escrowId;
    uint256 propertyId;
    address buyer;
    address seller;
    uint256 amount;              // Simple amount - no market adjustments
    uint256 deadline;
    EscrowStatus status;
    uint256 createdAt;
    uint256 completedAt;
    string terms;
    bool buyerApproved;
    bool sellerApproved;
}
```

#### Functionality
- **Simple Fund Holding**: Escrow holds funds for property transactions
- **Dynamic Amounts**: Uses current market price from PropertyNFTFactory
- **No Market Protection**: Basic escrow functionality only
- **Buyer/Seller Approval**: Both parties must approve for completion

## 🚀 Deployment Configuration

### No Chainlink Feeds Required for Deployment

**PropertyNFTFactory** can be deployed without Chainlink feeds and configured later:

```typescript
// Deploy without Chainlink feeds
const propertyFactory = m.contract("PropertyNFTFactory", [userRegistry]);

// PropertyEscrow - no Chainlink needed
const propertyEscrow = m.contract("PropertyEscrow", [userRegistry, propertyFactory]);
```

### Set Chainlink Feeds After Deployment

After deployment, set Chainlink feeds using admin functions:

```typescript
// Set all feeds at once
await propertyFactory.setAllChainlinkFeeds(
    "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70", // Property price feed
    "0x1234567890abcdef1234567890abcdef12345678", // Market trend feed
    "0xabcdef1234567890abcdef1234567890abcdef12", // Interest rate feed
    "0x9876543210fedcba9876543210fedcba98765432"  // Market volatility feed
);

// Or set individually
await propertyFactory.setPropertyPriceFeed("0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70");
await propertyFactory.setMarketTrendFeed("0x1234567890abcdef1234567890abcdef12345678");
await propertyFactory.setInterestRateFeed("0xabcdef1234567890abcdef1234567890abcdef12");
await propertyFactory.setMarketVolatilityFeed("0x9876543210fedcba9876543210fedcba98765432");
```

### Network-Specific Feed Addresses

#### Mantle Sepolia Testnet
- **Property Price Feed**: [Find on Chainlink Docs](https://docs.chain.link/data-feeds/price-feeds/addresses)
- **Market Trend Feed**: [Find on Chainlink Docs](https://docs.chain.link/data-feeds/price-feeds/addresses)
- **Interest Rate Feed**: [Find on Chainlink Docs](https://docs.chain.link/data-feeds/price-feeds/addresses)
- **Market Volatility Feed**: [Find on Chainlink Docs](https://docs.chain.link/data-feeds/price-feeds/addresses)

#### Mantle Mainnet (when available)
- **Property Price Feed**: [Find on Chainlink Docs](https://docs.chain.link/data-feeds/price-feeds/addresses)
- **Market Trend Feed**: [Find on Chainlink Docs](https://docs.chain.link/data-feeds/price-feeds/addresses)
- **Interest Rate Feed**: [Find on Chainlink Docs](https://docs.chain.link/data-feeds/price-feeds/addresses)
- **Market Volatility Feed**: [Find on Chainlink Docs](https://docs.chain.link/data-feeds/price-feeds/addresses)

## 📈 Market Data Update Intervals

### Configurable Parameters
- **Market Data Update Interval**: 1 hour (default)
- **Price Update Threshold**: 5% change required for updates
- **Market Protection Threshold**: 20% value drop triggers protection
- **Max Price Deviation**: 50% maximum deviation from base price

## 🔄 Post-Deployment Chainlink Configuration

### Why Post-Deployment Configuration Matters
- **No Constructor Dependencies**: Deploy contracts without needing Chainlink addresses
- **Flexible Setup**: Configure Chainlink feeds when ready
- **Network Migration**: Easy switch between testnet and mainnet
- **Future Flexibility**: Add Chainlink integration when needed

### Admin Functions for Feed Management
```solidity
// Set feeds after deployment
function setPropertyPriceFeed(address feedAddress) external onlyAdmin
function setMarketTrendFeed(address feedAddress) external onlyAdmin
function setInterestRateFeed(address feedAddress) external onlyAdmin
function setMarketVolatilityFeed(address feedAddress) external onlyAdmin

// Set all feeds at once
function setAllChainlinkFeeds(
    address propertyPriceFeedAddr,
    address marketTrendFeedAddr,
    address interestRateFeedAddr,
    address marketVolatilityFeedAddr
) external onlyAdmin

// Update existing feeds
function updatePropertyPriceFeed(address newFeedAddress) external onlyAdmin
function updateMarketTrendFeed(address newFeedAddress) external onlyAdmin
function updateInterestRateFeed(address newFeedAddress) external onlyAdmin
function updateMarketVolatilityFeed(address newFeedAddress) external onlyAdmin
```

### Example Usage
```javascript
// Deploy first (no Chainlink needed)
await deployContracts();

// Later, set Chainlink feeds
await propertyFactory.setAllChainlinkFeeds(
    "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70", // Property price feed
    "0x1234567890abcdef1234567890abcdef12345678", // Market trend feed
    "0xabcdef1234567890abcdef1234567890abcdef12", // Interest rate feed
    "0x9876543210fedcba9876543210fedcba98765432"  // Market volatility feed
);

// Switch networks later
await propertyFactory.updateAllFeedAddresses(
    "0xNewPropertyFeed", // New network property feed
    "0xNewTrendFeed",    // New network trend feed
    "0xNewInterestFeed", // New network interest feed
    "0xNewVolatilityFeed" // New network volatility feed
);
```

### Admin Functions
```solidity
// Update market data update interval
function updateMarketDataUpdateInterval(uint256 newInterval) external onlyAdmin

// Update price update threshold
function updatePriceUpdateThreshold(uint256 newThreshold) external onlyAdmin

// Update market protection threshold
function updateMarketProtectionThreshold(uint256 newThreshold) external onlyAdmin

// Enable/disable market protection
function setMarketProtectionEnabled(bool enabled) external onlyAdmin
```

## 🔄 How It Works

### 1. Property Creation
1. User creates property with `basePrice`
2. System fetches current market data from Chainlink
3. `currentMarketPrice` calculated using market conditions
4. Property stored with both prices and volatility score

### 2. Escrow Creation
1. Buyer creates escrow for property
2. System calculates `adjustedAmount` based on current market data
3. Escrow created with market protection enabled
4. `marketValueAtCreation` recorded for comparison

### 3. Market Updates
1. System periodically calls `updateMarketData()`
2. All property prices updated if change > 5%
3. All escrow amounts recalculated
4. Market protection triggered if value drops > 20%

### 4. Transaction Protection
1. Before completing escrow, system checks market conditions
2. If significant value change detected, transaction can be cancelled
3. Buyers protected from overpaying in volatile markets
4. Sellers protected from undervaluing in rising markets

## 🛡️ Security Features

### Market Protection
- **Automatic Cancellation**: Escrows cancelled if property value drops >20%
- **Price Deviation Limits**: Prevents extreme price fluctuations
- **Stale Data Protection**: Rejects outdated market data

### Risk Management
- **Volatility Scoring**: Each property has risk assessment
- **Market Alerts**: Automatic notifications for significant changes
- **Fallback Mechanisms**: Uses base price if market data unavailable

## 📊 Events and Monitoring

### Key Events
```solidity
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
    uint256 originalValue,
    uint256 currentValue,
    string reason
);
```

## 🔧 Testing

### Test Scenarios
1. **Market Data Updates**: Verify price updates when market data changes
2. **Market Protection**: Test automatic cancellation on significant value drops
3. **Escrow Adjustments**: Verify escrow amounts adjust with market conditions
4. **Fallback Behavior**: Test behavior when Chainlink feeds are unavailable

### Test Commands
```bash
# Compile contracts
npm run compile

# Run tests
npm run test

# Deploy to testnet
npm run deploy:mantle-sepolia
```

## 🚀 Next Steps

### Immediate Actions
1. **Get Chainlink Feed Addresses**: Obtain actual feed addresses for your target networks
2. **Update Deployment Script**: Replace placeholder addresses with real ones
3. **Test Integration**: Deploy to testnet and verify functionality
4. **Monitor Performance**: Track market data updates and protection triggers

### Dynamic Feed Management
1. **No Redeployment Needed**: Feed addresses can be updated via admin functions
2. **Easy Migration**: Switch between different data sources without redeploying contracts
3. **Network Flexibility**: Move between testnets and mainnet easily
4. **Future-Proof**: Add new data sources as they become available

### Future Enhancements
1. **Additional Data Feeds**: Add more property-specific feeds (rental rates, construction costs)
2. **Advanced Analytics**: Implement machine learning for price predictions
3. **Cross-chain Integration**: Use Chainlink CCIP for multi-chain property trading
4. **Automation**: Implement Chainlink Automation for scheduled market updates

## 📚 Resources

- [Chainlink Data Feeds Documentation](https://docs.chain.link/data-feeds)
- [Chainlink Price Feed Addresses](https://docs.chain.link/data-feeds/price-feeds/addresses)
- [Chainlink Automation](https://docs.chain.link/chainlink-automation)
- [Chainlink CCIP](https://docs.chain.link/ccip)

---

**Note**: This integration significantly enhances ProptyChain's reliability and market responsiveness. Make sure to thoroughly test all functionality before deploying to mainnet.
