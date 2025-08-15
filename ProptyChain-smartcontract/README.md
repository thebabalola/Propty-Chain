# ProptyChain Smart Contracts

A comprehensive Web3-powered real estate platform built on Ethereum Layer-2 networks (Base and Lisk) that brings transparency, trust, and accessibility to global property markets.

## 🏗️ Architecture Overview

ProptyChain consists of six core smart contracts that work together to create a decentralized real estate ecosystem:

### Core Contracts

1. **UserRegistry** - User identity and reputation management
2. **PropertyNFTFactory** - Property NFT creation and management
3. **ReviewRegistry** - Property review system with IPFS storage
4. **PropertyEscrow** - Secure transaction escrow system
5. **SoulboundNFT** - Achievement-based gamification system
6. **AdminContract** - Platform oversight and dispute resolution

### 🚀 Live Deployment (Base Sepolia)

| Contract | Address | Status |
|----------|---------|--------|
| **AdminContract** | `0x48866a7aB8aDb8F2Eb8708BBc69eafB8BA3C7365` | ✅ Verified |
| **UserRegistry** | `0xB1bcc419096785a0e43d441F81b69f539773d299` | ✅ Verified |
| **PropertyNFTFactory** | `0x667D663405AeeB90d6Af2D31f21C5C2bE809A5e0` | ✅ Verified |
| **ReviewRegistry** | `0x78702F5e1fC795C2bb23f2B342bcFB57BB8dCaC1` | ✅ Verified |
| **SoulboundNFT** | `0x65e4c8bb0270bC60Af5DCe60CE6323f2BA720171` | ✅ Verified |
| **PropertyEscrow** | `0x778269B6Fb31089714d4cd3FaC63d0ab602e9E8d` | ✅ Verified |

**📋 Full deployment details**: [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)

## 📋 Contract Details

### UserRegistry
- **Purpose**: Manages user registration, identity, and role-based access control
- **Key Features**:
  - User registration with Ethereum address and DID
  - Role-based access (Seeker, Owner, Agent, Representative)
  - Reputation scoring system
  - One address per user policy

### PropertyNFTFactory
- **Purpose**: Creates and manages property NFTs with metadata
- **Key Features**:
  - Property NFT minting with metadata
  - Freemium model (2 free uploads, then $3/month subscription)
  - Property listing/unlisting functionality
  - Metadata updates and management

### ReviewRegistry
- **Purpose**: Manages property reviews stored on IPFS
- **Key Features**:
  - Review submission with IPFS storage
  - Review validation and reporting system
  - Rating system (1-5 stars)
  - Automatic review invalidation for false reviews

### PropertyEscrow
- **Purpose**: Handles secure property transactions
- **Key Features**:
  - Smart contract escrow for secure transactions
  - Dispute resolution system
  - Platform fee collection (2%)
  - Automatic property transfer upon completion

### SoulboundNFT
- **Purpose**: Achievement-based gamification system
- **Key Features**:
  - Non-transferable achievement badges
  - Badge types: Trusted Owner, Top Reviewer, Verified Professional, etc.
  - Level-based badge system (1-5 levels)
  - Reputation-based badge requirements

### AdminContract
- **Purpose**: Central platform management and oversight
- **Key Features**:
  - Dispute creation and resolution
  - User verification system
  - Content moderation (property/review removal)
  - Platform statistics and analytics

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Hardhat
- MetaMask or other Web3 wallet

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ProptyChain-smartcontract
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp env.example .env
# Edit .env with your configuration
```

4. **Compile contracts**
```bash
npm run compile
```

5. **Run tests**
```bash
npm test
```

## 🚀 Deployment

### Deployed Contracts (Base Sepolia)

All contracts have been successfully deployed and verified on Base Sepolia testnet:

| Contract | Address | BaseScan | Status |
|----------|---------|----------|--------|
| **AdminContract** | `0x48866a7aB8aDb8F2Eb8708BBc69eafB8BA3C7365` | [View Code](https://sepolia.basescan.org/address/0x48866a7aB8aDb8F2Eb8708BBc69eafB8BA3C7365#code) | ✅ Verified |
| **UserRegistry** | `0xB1bcc419096785a0e43d441F81b69f539773d299` | [View Code](https://sepolia.basescan.org/address/0xB1bcc419096785a0e43d441F81b69f539773d299#code) | ✅ Verified |
| **PropertyNFTFactory** | `0x667D663405AeeB90d6Af2D31f21C5C2bE809A5e0` | [View Code](https://sepolia.basescan.org/address/0x667D663405AeeB90d6Af2D31f21C5C2bE809A5e0#code) | ✅ Verified |
| **ReviewRegistry** | `0x78702F5e1fC795C2bb23f2B342bcFB57BB8dCaC1` | [View Code](https://sepolia.basescan.org/address/0x78702F5e1fC795C2bb23f2B342bcFB57BB8dCaC1#code) | ✅ Verified |
| **SoulboundNFT** | `0x65e4c8bb0270bC60Af5DCe60CE6323f2BA720171` | [View Code](https://sepolia.basescan.org/address/0x65e4c8bb0270bC60Af5DCe60CE6323f2BA720171#code) | ✅ Verified |
| **PropertyEscrow** | `0x778269B6Fb31089714d4cd3FaC63d0ab602e9E8d` | [View Code](https://sepolia.basescan.org/address/0x778269B6Fb31089714d4cd3FaC63d0ab602e9E8d#code) | ✅ Verified |

**Network**: Base Sepolia (Chain ID: 84532)  
**Deployer**: `0x0eE1F2b663547dAa487F57C517C7563AdCf86da0`  
**Deployment Date**: August 14, 2024  
**Status**: All contracts deployed and verified ✅

### Deployment Commands

1. **Deploy to local network**
```bash
npx hardhat node
npx hardhat run scripts/deploy.ts --network localhost
```

2. **Deploy to Base Sepolia testnet**
```bash
npm run deploy:base-sepolia
```

3. **Deploy to Base mainnet**
```bash
npm run deploy:base
```

4. **Deploy and verify in one command**
```bash
npm run deploy-and-verify:base-sepolia
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Private key for deployment
PRIVATE_KEY=your_private_key_here

# Network RPC URLs
BASE_RPC_URL=https://mainnet.base.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
LISK_RPC_URL=https://rpc.lisk.com

# Block Explorer API Keys
BASESCAN_API_KEY=your_basescan_api_key_here

# IPFS Configuration
PINATA_API_KEY=your_pinata_api_key_here
PINATA_SECRET_KEY=your_pinata_secret_key_here
```

### Network Configuration

The contracts are configured to work on:
- **Base** (Ethereum L2) - Mainnet
- **Base Sepolia** - Testnet
- **Lisk** (Ethereum L2) - Alternative network

## 📖 Usage Examples

### User Registration
```solidity
// Register a new user
await userRegistry.registerUser(
    "John Doe",
    "did:ethr:0x123...",
    UserRegistry.UserRole.SEEKER
);
```

### Property Creation
```solidity
// Create a property NFT
await propertyFactory.createProperty(
    PropertyNFTFactory.PropertyType.RESIDENTIAL,
    "Lagos, Nigeria",
    ethers.utils.parseEther("100000"), // 100,000 ETH
    "Monthly payment plan available",
    "QmHash...", // IPFS hash for additional metadata
    "https://metadata.uri"
);
```

### Review Submission
```solidity
// Submit a property review
await reviewRegistry.submitReview(
    1, // propertyId
    ReviewRegistry.ReviewType.RESIDENT,
    "QmReviewHash...", // IPFS hash for review content
    5, // rating (1-5)
    "Property conditions"
);
```

### Escrow Transaction
```solidity
// Create escrow for property purchase
await propertyEscrow.createEscrow(
    1, // propertyId
    "0xSellerAddress...",
    "QmTermsHash..." // IPFS hash for transaction terms
);

// Fund the escrow
await propertyEscrow.fundEscrow(1, { value: ethers.utils.parseEther("100000") });
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run specific test files:
```bash
npx hardhat test test/UserRegistry.test.ts
npx hardhat test test/PropertyNFTFactory.test.ts
```

## 🔒 Security Features

- **OpenZeppelin Contracts**: Uses battle-tested security libraries
- **Access Control**: Role-based permissions and ownership controls
- **Reentrancy Protection**: Guards against reentrancy attacks
- **Input Validation**: Comprehensive parameter validation
- **Emergency Functions**: Admin controls for emergency situations

## 📊 Gas Optimization

- **Efficient Storage**: Optimized data structures and mappings
- **Batch Operations**: Support for batch processing where applicable
- **Lazy Loading**: On-demand data retrieval patterns
- **Gas-Efficient Loops**: Optimized iteration patterns

## 🌐 IPFS Integration

The platform uses IPFS for decentralized storage of:
- Property metadata and images
- Review content and attachments
- Transaction terms and documents
- Badge metadata and achievements

## 🎯 Badge System

### Available Badges
1. **Trusted Owner** - For property owners with good reputation
2. **Top Reviewer** - For active and helpful reviewers
3. **Verified Professional** - For verified real estate professionals
4. **First Property** - For first-time property uploaders
5. **Successful Transaction** - For completed property transactions
6. **Community Contributor** - For active community members
7. **Early Adopter** - For early platform users
8. **Premium Member** - For subscription holders

### Badge Requirements
Each badge has specific requirements based on:
- Number of properties owned
- Number of reviews submitted
- Reputation score
- Number of successful transactions
- Days active on platform

## 🔄 Contract Interactions

```mermaid
graph TD
    A[UserRegistry] --> B[PropertyNFTFactory]
    A --> C[ReviewRegistry]
    A --> D[PropertyEscrow]
    A --> E[SoulboundNFT]
    B --> D
    C --> A
    D --> A
    E --> A
    F[AdminContract] --> A
    F --> B
    F --> C
    F --> D
    F --> E
```

## 📈 Platform Statistics

The AdminContract provides comprehensive platform analytics:
- Total users registered
- Total properties created
- Total reviews submitted
- Total escrow transactions
- Total disputes resolved
- Platform revenue
- Active subscriptions

## 🚨 Emergency Procedures

### Pause Platform
```solidity
await adminContract.pausePlatform("Emergency maintenance");
```

### Emergency Refund
```solidity
await propertyEscrow.emergencyRefund(escrowId);
```

### Emergency Dispute Closure
```solidity
await adminContract.emergencyCloseDispute(disputeId);
```

## 🔧 Maintenance

### Update Platform Fees
```solidity
await adminContract.updatePlatformFee(3); // 3%
```

### Update Platform Limits
```solidity
await adminContract.updatePlatformLimits(100, 200, 150);
```

### Award Badges
```solidity
await adminContract.awardBadgeToUser(
    userAddress,
    SoulboundNFT.BadgeType.TRUSTED_OWNER,
    "QmBadgeHash...",
    1
);
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Join our Discord community
- Email: support@proptychain.com

## 🔮 Roadmap

- [ ] Multi-chain deployment (Polygon, Arbitrum)
- [ ] Advanced dispute resolution with DAO governance
- [ ] Integration with DeFi protocols for property financing
- [ ] Mobile app with wallet integration
- [ ] AI-powered property valuation
- [ ] International property support
- [ ] Advanced analytics dashboard

---

**Built with ❤️ for the future of real estate**
