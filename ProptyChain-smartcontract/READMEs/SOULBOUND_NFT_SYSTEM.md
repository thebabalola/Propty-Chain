# SoulboundNFT System - ProptyChain

## Overview

ProptyChain's **SoulboundNFT system** rewards users with non-transferable achievement badges based on their platform activity. Users can now **mint badges themselves** when they meet the requirements, and admins can **dynamically update requirements**.

## 🎯 **How It Works**

### **User-Initiated Minting Flow**
```
1. User performs actions (creates properties, writes reviews, etc.)
2. User stats are tracked in UserRegistry
3. User checks eligibility for badges
4. User calls mintBadge() when eligible
5. Badge is minted as Soulbound NFT to user
```

### **Dynamic Requirements System**
```
Admin can update badge requirements anytime:
- Update all requirements at once
- Update individual requirement fields
- Requirements affect future badge minting
- Existing badges remain unchanged
```

## 🏆 **Available Badge Types**

### **1. TRUSTED_OWNER** 🏠
- **Purpose**: Recognizes reliable property owners
- **Default Requirements**: 5+ properties, 100+ reputation, 30+ days active
- **Level**: 1-5 (admin can level up)

### **2. TOP_REVIEWER** ⭐
- **Purpose**: Recognizes active community contributors
- **Default Requirements**: 20+ reviews, 200+ reputation, 60+ days active
- **Level**: 1-5 (admin can level up)

### **3. VERIFIED_PROFESSIONAL** 👔
- **Purpose**: Recognizes professional real estate participants
- **Default Requirements**: 10+ properties, 10+ reviews, 500+ reputation, 90+ days active
- **Level**: 1-5 (admin can level up)

### **4. FIRST_PROPERTY** 🎉
- **Purpose**: Welcome badge for new property owners
- **Default Requirements**: 1+ property
- **Level**: 1 (fixed)

### **5. SUCCESSFUL_TRANSACTION** ✅
- **Purpose**: Recognizes successful property transactions
- **Default Requirements**: 1+ transaction
- **Level**: 1 (fixed)

### **6. COMMUNITY_CONTRIBUTOR** 🤝
- **Purpose**: Recognizes community engagement
- **Default Requirements**: 5+ reviews, 50+ reputation, 15+ days active
- **Level**: 1-5 (admin can level up)

### **7. EARLY_ADOPTER** 🚀
- **Purpose**: Recognizes early platform users
- **Default Requirements**: Admin-awarded only
- **Level**: 1-5 (admin can level up)

### **8. PREMIUM_MEMBER** 💎
- **Purpose**: Recognizes premium users
- **Default Requirements**: Admin-awarded only
- **Level**: 1-5 (admin can level up)

## 🔧 **User Functions**

### **Mint Badge**
```solidity
function mintBadge(BadgeType badgeType, string memory metadata) external
```
**Requirements:**
- User must be registered and active
- User must meet badge requirements
- User must not already have this badge type
- Metadata cannot be empty

**Example:**
```javascript
// User mints a badge when they meet requirements
await soulboundNFT.mintBadge(
    BadgeType.TRUSTED_OWNER,
    "ipfs://QmBadgeMetadata"
);
```

### **Check Eligibility**
```solidity
function checkBadgeEligibility(address userAddress, BadgeType badgeType) 
    public view returns (bool)
```
**Example:**
```javascript
// Check if user is eligible for a badge
const isEligible = await soulboundNFT.checkBadgeEligibility(
    userAddress,
    BadgeType.TRUSTED_OWNER
);
```

### **Get Badge Progress**
```solidity
function getUserBadgeProgress(address userAddress, BadgeType badgeType) 
    external view returns (
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
```
**Example:**
```javascript
// Get user's progress towards a badge
const progress = await soulboundNFT.getUserBadgeProgress(
    userAddress,
    BadgeType.TRUSTED_OWNER
);

console.log(`Properties: ${progress.currentProperties}/${progress.requiredProperties}`);
console.log(`Reviews: ${progress.currentReviews}/${progress.requiredReviews}`);
console.log(`Reputation: ${progress.currentReputation}/${progress.requiredReputation}`);
console.log(`Days Active: ${progress.currentDaysActive}/${progress.requiredDaysActive}`);
console.log(`Eligible: ${progress.isEligible}`);
```

### **Get Eligible Badges**
```solidity
function getEligibleBadges(address userAddress) external view returns (BadgeType[] memory)
```
**Example:**
```javascript
// Get all badges user is eligible for
const eligibleBadges = await soulboundNFT.getEligibleBadges(userAddress);
console.log("Eligible badges:", eligibleBadges);
```

## 🔧 **Admin Functions**

### **Award Special Badges**
```solidity
function awardBadge(
    address recipient,
    BadgeType badgeType,
    string memory metadata,
    uint256 level
) external onlyAdmin
```
**Use Cases:**
- Award special badges (EARLY_ADOPTER, PREMIUM_MEMBER)
- Award badges with custom levels
- Award badges for special achievements

**Example:**
```javascript
// Admin awards special badge
await soulboundNFT.awardBadge(
    userAddress,
    BadgeType.EARLY_ADOPTER,
    "ipfs://QmSpecialBadge",
    3 // Level 3
);
```

### **Update Badge Requirements**

#### **Update All Requirements**
```solidity
function updateBadgeRequirements(
    BadgeType badgeType,
    uint256 minProperties,
    uint256 minReviews,
    uint256 minReputation,
    uint256 minTransactions,
    uint256 minDaysActive
) external onlyAdmin
```

#### **Update Individual Requirements**
```solidity
function updateBadgeMinProperties(BadgeType badgeType, uint256 minProperties) external onlyAdmin
function updateBadgeMinReviews(BadgeType badgeType, uint256 minReviews) external onlyAdmin
function updateBadgeMinReputation(BadgeType badgeType, uint256 minReputation) external onlyAdmin
function updateBadgeMinTransactions(BadgeType badgeType, uint256 minTransactions) external onlyAdmin
function updateBadgeMinDaysActive(BadgeType badgeType, uint256 minDaysActive) external onlyAdmin
```

**Example:**
```javascript
// Make TRUSTED_OWNER badge easier to get
await soulboundNFT.updateBadgeRequirements(
    BadgeType.TRUSTED_OWNER,
    3,  // minProperties (was 5)
    0,  // minReviews
    50, // minReputation (was 100)
    2,  // minTransactions (was 3)
    15  // minDaysActive (was 30)
);

// Or update individual requirement
await soulboundNFT.updateBadgeMinProperties(
    BadgeType.TRUSTED_OWNER,
    3 // Reduce from 5 to 3 properties
);
```

### **Badge Management**
```solidity
function revokeBadge(uint256 badgeId, string memory reason) external onlyAdmin
function levelUpBadge(uint256 badgeId, uint256 newLevel) external onlyAdmin
```

## 📊 **View Functions**

### **Get Badge Information**
```solidity
function getBadge(uint256 badgeId) external view returns (Badge memory)
function getUserBadges(address userAddress) external view returns (uint256[] memory)
function getUserBadgeCount(address userAddress, BadgeType badgeType) external view returns (uint256)
function getBadgeRequirements(BadgeType badgeType) external view returns (BadgeRequirements memory)
function hasBadge(address userAddress, BadgeType badgeType) external view returns (bool)
function getUserTotalBadgeCount(address userAddress) external view returns (uint256)
function getTotalBadges() external view returns (uint256)
```

## 🚀 **Usage Examples**

### **Scenario 1: User Mints First Property Badge**
```javascript
// User creates their first property
await propertyFactory.createProperty(
    PropertyType.RESIDENTIAL,
    "123 Main St",
    500000000000000000000000,
    "ipfs://QmPropertyMetadata"
);

// User checks if they're eligible for FIRST_PROPERTY badge
const isEligible = await soulboundNFT.checkBadgeEligibility(
    userAddress,
    BadgeType.FIRST_PROPERTY
);

if (isEligible) {
    // User mints the badge
    await soulboundNFT.mintBadge(
        BadgeType.FIRST_PROPERTY,
        "ipfs://QmFirstPropertyBadge"
    );
}
```

### **Scenario 2: User Progress Tracking**
```javascript
// User wants to see their progress towards TRUSTED_OWNER badge
const progress = await soulboundNFT.getUserBadgeProgress(
    userAddress,
    BadgeType.TRUSTED_OWNER
);

console.log("Progress towards TRUSTED_OWNER badge:");
console.log(`Properties: ${progress.currentProperties}/${progress.requiredProperties}`);
console.log(`Reputation: ${progress.currentReputation}/${progress.requiredReputation}`);
console.log(`Days Active: ${progress.currentDaysActive}/${progress.requiredDaysActive}`);
console.log(`Eligible: ${progress.isEligible}`);
```

### **Scenario 3: Admin Updates Requirements**
```javascript
// Admin makes TOP_REVIEWER badge easier to get
await soulboundNFT.updateBadgeRequirements(
    BadgeType.TOP_REVIEWER,
    0,   // minProperties
    10,  // minReviews (was 20)
    100, // minReputation (was 200)
    0,   // minTransactions
    30   // minDaysActive (was 60)
);
```

### **Scenario 4: Admin Awards Special Badge**
```javascript
// Admin awards EARLY_ADOPTER badge to early users
await soulboundNFT.awardBadge(
    earlyUserAddress,
    BadgeType.EARLY_ADOPTER,
    "ipfs://QmEarlyAdopterBadge",
    2 // Level 2
);
```

## 🎯 **Key Features**

### **1. User-Initiated Minting**
- ✅ **Users mint their own badges** when eligible
- ✅ **No admin intervention required** for standard badges
- ✅ **Automatic eligibility checking**
- ✅ **Prevents duplicate badges**

### **2. Dynamic Requirements**
- ✅ **Admin can update requirements** anytime
- ✅ **Individual requirement updates**
- ✅ **Bulk requirement updates**
- ✅ **Requirements affect future minting only**

### **3. Progress Tracking**
- ✅ **Detailed progress information**
- ✅ **Current vs required stats**
- ✅ **Eligibility status**
- ✅ **All eligible badges list**

### **4. Badge Management**
- ✅ **Level system (1-5)**
- ✅ **Badge revocation**
- ✅ **Level upgrades**
- ✅ **Metadata support**

### **5. Soulbound (Non-Transferable)**
- ✅ **Cannot be transferred**
- ✅ **Cannot be sold**
- ✅ **Permanent achievement record**
- ✅ **Maintains badge integrity**

## 🎉 **Benefits**

### **For Users:**
- **Immediate gratification** - mint badges when eligible
- **Progress tracking** - see how close they are to badges
- **Achievement recognition** - permanent record of accomplishments
- **Gamification** - motivates continued platform engagement

### **For Admins:**
- **Flexible requirements** - adjust based on platform needs
- **Special recognition** - award badges for special cases
- **Quality control** - revoke badges if needed
- **Dynamic system** - evolve with platform growth

### **For Platform:**
- **User engagement** - motivates continued participation
- **Community building** - recognizes contributions
- **Reputation system** - badges show user credibility
- **Scalable rewards** - easy to add new badge types

## 🚀 **Future Enhancements**

### **Potential Additions:**
1. **Automatic Badge Minting** - mint badges automatically when requirements met
2. **Badge Tiers** - bronze, silver, gold versions of badges
3. **Badge Collections** - sets of related badges
4. **Badge Marketplace** - trade badges (if transferable versions added)
5. **Badge Challenges** - time-limited badge opportunities

Your SoulboundNFT system is now **user-friendly, dynamic, and engaging**! 🏠📈
