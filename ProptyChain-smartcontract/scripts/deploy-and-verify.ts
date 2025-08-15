import { ethers, run } from "hardhat";

async function verify(contractAddress: string, args: any[] = []) {
  console.log(`🔍 Verifying contract at ${contractAddress}...`);
  
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
    console.log("✅ Contract verified successfully");
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Contract already verified");
    } else {
      console.error("❌ Verification failed:", error.message);
      throw error;
    }
  }
}

async function main() {
  console.log("🚀 Starting ProptyChain deployment and verification...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`📋 Deploying contracts with account: ${deployer.address}`);
  console.log(`💰 Account balance: ${ethers.formatEther(await deployer.provider?.getBalance(deployer.address) || 0)} ETH\n`);

  // Deploy AdminContract first
  console.log("📦 Deploying AdminContract...");
  const AdminContract = await ethers.getContractFactory("AdminContract");
  const adminContract = await AdminContract.deploy(deployer.address);
  await adminContract.waitForDeployment();
  const adminContractAddress = await adminContract.getAddress();
  console.log(`✅ AdminContract deployed to: ${adminContractAddress}`);

  // Deploy UserRegistry
  console.log("\n📦 Deploying UserRegistry...");
  const UserRegistry = await ethers.getContractFactory("UserRegistry");
  const userRegistry = await UserRegistry.deploy();
  await userRegistry.waitForDeployment();
  const userRegistryAddress = await userRegistry.getAddress();
  console.log(`✅ UserRegistry deployed to: ${userRegistryAddress}`);

  // Deploy PropertyNFTFactory
  console.log("\n📦 Deploying PropertyNFTFactory...");
  const PropertyNFTFactory = await ethers.getContractFactory("PropertyNFTFactory");
  const propertyFactory = await PropertyNFTFactory.deploy(userRegistryAddress);
  await propertyFactory.waitForDeployment();
  const propertyFactoryAddress = await propertyFactory.getAddress();
  console.log(`✅ PropertyNFTFactory deployed to: ${propertyFactoryAddress}`);

  // Deploy ReviewRegistry
  console.log("\n📦 Deploying ReviewRegistry...");
  const ReviewRegistry = await ethers.getContractFactory("ReviewRegistry");
  const reviewRegistry = await ReviewRegistry.deploy(userRegistryAddress);
  await reviewRegistry.waitForDeployment();
  const reviewRegistryAddress = await reviewRegistry.getAddress();
  console.log(`✅ ReviewRegistry deployed to: ${reviewRegistryAddress}`);

  // Deploy PropertyEscrow
  console.log("\n📦 Deploying PropertyEscrow...");
  const PropertyEscrow = await ethers.getContractFactory("PropertyEscrow");
  const propertyEscrow = await PropertyEscrow.deploy(userRegistryAddress, propertyFactoryAddress);
  await propertyEscrow.waitForDeployment();
  const propertyEscrowAddress = await propertyEscrow.getAddress();
  console.log(`✅ PropertyEscrow deployed to: ${propertyEscrowAddress}`);

  // Deploy SoulboundNFT
  console.log("\n📦 Deploying SoulboundNFT...");
  const SoulboundNFT = await ethers.getContractFactory("SoulboundNFT");
  const soulboundNFT = await SoulboundNFT.deploy(userRegistryAddress);
  await soulboundNFT.waitForDeployment();
  const soulboundNFTAddress = await soulboundNFT.getAddress();
  console.log(`✅ SoulboundNFT deployed to: ${soulboundNFTAddress}`);

  // Set up contract relationships in AdminContract
  console.log("\n🔗 Setting up contract relationships...");
  const setContractsTx = await adminContract.setContracts(
    userRegistryAddress,
    propertyFactoryAddress,
    reviewRegistryAddress,
    propertyEscrowAddress,
    soulboundNFTAddress
  );
  await setContractsTx.wait();
  console.log("✅ Contract relationships configured");

  // Wait a bit for the network to process transactions
  console.log("\n⏳ Waiting for network confirmation...");
  await new Promise(resolve => setTimeout(resolve, 10000));

  // Verify all contracts
  console.log("\n🔍 Starting contract verification...\n");

  try {
    // Verify AdminContract
    console.log("🔍 Verifying AdminContract...");
    await verify(adminContractAddress, [deployer.address]);
    console.log("✅ AdminContract verified");

    // Verify UserRegistry
    console.log("\n🔍 Verifying UserRegistry...");
    await verify(userRegistryAddress, []);
    console.log("✅ UserRegistry verified");

    // Verify PropertyNFTFactory
    console.log("\n🔍 Verifying PropertyNFTFactory...");
    await verify(propertyFactoryAddress, [userRegistryAddress]);
    console.log("✅ PropertyNFTFactory verified");

    // Verify ReviewRegistry
    console.log("\n🔍 Verifying ReviewRegistry...");
    await verify(reviewRegistryAddress, [userRegistryAddress]);
    console.log("✅ ReviewRegistry verified");

    // Verify PropertyEscrow
    console.log("\n🔍 Verifying PropertyEscrow...");
    await verify(propertyEscrowAddress, [userRegistryAddress, propertyFactoryAddress]);
    console.log("✅ PropertyEscrow verified");

    // Verify SoulboundNFT
    console.log("\n🔍 Verifying SoulboundNFT...");
    await verify(soulboundNFTAddress, [userRegistryAddress]);
    console.log("✅ SoulboundNFT verified");

  } catch (error) {
    console.error("❌ Verification failed:", error);
  }

  // Print deployment summary
  console.log("\n" + "=".repeat(80));
  console.log("🎉 DEPLOYMENT SUMMARY");
  console.log("=".repeat(80));
  console.log(`Network: ${network.name}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log("\n📋 Contract Addresses:");
  console.log(`AdminContract: ${adminContractAddress}`);
  console.log(`UserRegistry: ${userRegistryAddress}`);
  console.log(`PropertyNFTFactory: ${propertyFactoryAddress}`);
  console.log(`ReviewRegistry: ${reviewRegistryAddress}`);
  console.log(`PropertyEscrow: ${propertyEscrowAddress}`);
  console.log(`SoulboundNFT: ${soulboundNFTAddress}`);
  console.log("\n🔗 BaseScan Links:");
  console.log(`https://sepolia.basescan.org/address/${adminContractAddress}`);
  console.log(`https://sepolia.basescan.org/address/${userRegistryAddress}`);
  console.log(`https://sepolia.basescan.org/address/${propertyFactoryAddress}`);
  console.log(`https://sepolia.basescan.org/address/${reviewRegistryAddress}`);
  console.log(`https://sepolia.basescan.org/address/${propertyEscrowAddress}`);
  console.log(`https://sepolia.basescan.org/address/${soulboundNFTAddress}`);
  console.log("=".repeat(80));

  // Save deployment info to file
  const deploymentInfo = {
    network: network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      adminContract: adminContractAddress,
      userRegistry: userRegistryAddress,
      propertyFactory: propertyFactoryAddress,
      reviewRegistry: reviewRegistryAddress,
      propertyEscrow: propertyEscrowAddress,
      soulboundNFT: soulboundNFTAddress,
    },
    basescan: {
      adminContract: `https://sepolia.basescan.org/address/${adminContractAddress}`,
      userRegistry: `https://sepolia.basescan.org/address/${userRegistryAddress}`,
      propertyFactory: `https://sepolia.basescan.org/address/${propertyFactoryAddress}`,
      reviewRegistry: `https://sepolia.basescan.org/address/${reviewRegistryAddress}`,
      propertyEscrow: `https://sepolia.basescan.org/address/${propertyEscrowAddress}`,
      soulboundNFT: `https://sepolia.basescan.org/address/${soulboundNFTAddress}`,
    }
  };

  const fs = require('fs');
  fs.writeFileSync(
    `deployment-${network.name}-${Date.now()}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\n💾 Deployment info saved to JSON file");

  console.log("\n🎉 Deployment and verification completed successfully!");
}

// Helper function to get network info
async function getNetwork() {
  const network = await ethers.provider.getNetwork();
  const networkName = network.name === "unknown" ? "hardhat" : network.name;
  return { name: networkName, chainId: network.chainId };
}

// Get network info
const network = await getNetwork();

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
