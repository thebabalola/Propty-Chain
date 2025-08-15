# 🚀 ProptyChain Smart Contracts - Base Sepolia Deployment Guide

## 📋 Prerequisites

Before deploying to Base Sepolia, ensure you have:

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **Base Sepolia ETH** for gas fees
4. **Private key** for deployment
5. **BaseScan API key** for contract verification

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your actual values
nano .env
```

### 3. Required Environment Variables

#### Essential Variables:
```bash
# Your private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Base Sepolia RPC URL
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# BaseScan API key for verification
BASESCAN_API_KEY=your_basescan_api_key_here
```

#### Optional Variables:
```bash
# Enable gas reporting
REPORT_GAS=true

# IPFS configuration (for metadata)
PINATA_API_KEY=your_pinata_api_key_here
PINATA_SECRET_KEY=your_pinata_secret_key_here
```

## 🚀 Deployment Steps

### 1. Compile Contracts
```bash
npm run compile
```

### 2. Check Contract Sizes
```bash
npm run size
```

## 🎯 Deployment Options

### Option A: Deploy and Verify (Recommended)
This option deploys all contracts and automatically verifies them on BaseScan in one command:

```bash
npm run deploy-and-verify:base-sepolia
```

**What this does:**
- ✅ Deploys all 6 contracts in the correct order
- ✅ Sets up contract relationships automatically
- ✅ Waits for network confirmation
- ✅ Verifies all contracts on BaseScan
- ✅ Saves deployment info to JSON file
- ✅ Provides BaseScan links for all contracts

### Option B: Deploy Only
If you prefer to deploy first and verify later:

```bash
npm run deploy:base-sepolia
```

### 3. Deploy and Verify to Base Sepolia (Recommended)
```bash
npm run deploy-and-verify:base-sepolia
```

### 4. Alternative: Deploy Only
```bash
npm run deploy:base-sepolia
```

### 5. Manual Verification (if needed)
```bash
# After deployment, verify each contract manually
npm run verify:base-sepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## 📊 Contract Deployment Order

The deployment follows this order using Hardhat Ignition (`DeployProptyChain.ts`):

1. **AdminContract** - Deployed first with deployer as initial admin
2. **UserRegistry** - User management system
3. **PropertyNFTFactory** - Property NFT creation
4. **ReviewRegistry** - Review and validation system
5. **PropertyEscrow** - Secure transaction handling
6. **SoulboundNFT** - Achievement badge system

## 🔍 Post-Deployment Verification

### 1. Check Contract Addresses
After deployment, you'll see output like:
```
AdminContract deployed to: 0x...
UserRegistry deployed to: 0x...
PropertyNFTFactory deployed to: 0x...
ReviewRegistry deployed to: 0x...
PropertyEscrow deployed to: 0x...
SoulboundNFT deployed to: 0x...
```

### 2. Verify on BaseScan
- Visit: https://sepolia.basescan.org
- Search for your contract addresses
- Verify they're deployed correctly

### 3. Test Basic Functions
```bash
# Run tests to ensure everything works
npm run test
```

## 💰 Gas Cost Estimates

Based on contract sizes and Base Sepolia gas prices:

| Contract | Estimated Gas Cost |
|----------|-------------------|
| AdminContract | ~15,000,000 gas |
| UserRegistry | ~5,000,000 gas |
| PropertyNFTFactory | ~10,000,000 gas |
| ReviewRegistry | ~8,000,000 gas |
| PropertyEscrow | ~9,000,000 gas |
| SoulboundNFT | ~11,000,000 gas |
| **Total** | ~58,000,000 gas |

**Estimated Cost**: ~0.0058 ETH (at current Base Sepolia gas prices)

## 🔧 Configuration After Deployment

### 1. Set Contract Relationships
The AdminContract needs to know about all other contracts:

```javascript
// This is handled automatically by the Ignition deployment
await adminContract.setContracts(
    userRegistry.address,
    propertyFactory.address,
    reviewRegistry.address,
    propertyEscrow.address,
    soulboundNFT.address
);
```

### 2. Add Additional Admins
```javascript
await adminContract.addAdmin(newAdminAddress);
```

### 3. Configure Platform Settings
```javascript
// Update platform fee
await adminContract.updatePlatformFee(2); // 2%

// Update limits
await adminContract.updatePlatformLimits(50, 100, 100);
```

## 🛠️ Troubleshooting

### Common Issues:

1. **Insufficient Gas**
   - Ensure you have enough Base Sepolia ETH
   - Check gas price settings

2. **Contract Size Too Large**
   - All contracts are under 24KB limit
   - If issues occur, check for compilation errors

3. **Verification Failed**
   - Ensure BaseScan API key is correct
   - Check constructor arguments match deployment

4. **Network Connection Issues**
   - Verify RPC URL is accessible
   - Check network configuration

## 📞 Support

If you encounter issues:

1. Check the contract compilation output
2. Verify your environment variables
3. Ensure you have sufficient Base Sepolia ETH
4. Check Base Sepolia network status

## 🔗 Useful Links

- **Base Sepolia Faucet**: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
- **BaseScan Sepolia**: https://sepolia.basescan.org
- **Base Sepolia RPC**: https://sepolia.base.org
- **Hardhat Documentation**: https://hardhat.org/docs

## ✅ Deployment Checklist

- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Contracts compiled successfully
- [ ] Contract sizes checked (all under 24KB)
- [ ] Base Sepolia ETH available
- [ ] Private key configured
- [ ] BaseScan API key ready
- [ ] Deployment executed
- [ ] Contracts verified on BaseScan
- [ ] Basic functionality tested

---

**🎉 Congratulations!** Your ProptyChain smart contracts are now deployed on Base Sepolia!
