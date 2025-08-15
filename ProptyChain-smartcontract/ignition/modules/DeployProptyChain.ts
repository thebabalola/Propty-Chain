import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ProptyChain", (m) => {
  // Deploy AdminContract first (needs initial admin address)
  const adminContract = m.contract("AdminContract", [m.getAccount(0)]);

  // Deploy UserRegistry with AdminContract
  const userRegistry = m.contract("UserRegistry", [adminContract]);

  // Deploy PropertyNFTFactory with UserRegistry and AdminContract
  // Note: Chainlink feed addresses will be set dynamically after deployment
  const propertyFactory = m.contract("PropertyNFTFactory", [userRegistry, adminContract]);

  // Deploy ReviewRegistry with UserRegistry and AdminContract
  const reviewRegistry = m.contract("ReviewRegistry", [userRegistry, adminContract]);

  // Deploy PropertyEscrow with UserRegistry, PropertyNFTFactory, and AdminContract
  const propertyEscrow = m.contract("PropertyEscrow", [userRegistry, propertyFactory, adminContract]);

  // Deploy SoulboundNFT with UserRegistry and AdminContract
  const soulboundNFT = m.contract("SoulboundNFT", [userRegistry, adminContract]);

  // Set up contract relationships in AdminContract
  m.call(adminContract, "setContracts", [
    userRegistry,
    propertyFactory,
    reviewRegistry,
    propertyEscrow,
    soulboundNFT,
  ]);

  return {
    adminContract,
    userRegistry,
    propertyFactory,
    reviewRegistry,
    propertyEscrow,
    soulboundNFT,
  };
});
