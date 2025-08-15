import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ProptyChain", (m) => {
  // Deploy AdminContract first (needs initial admin address)
  const adminContract = m.contract("AdminContract", [m.getAccount(0)]);

  // Deploy UserRegistry
  const userRegistry = m.contract("UserRegistry");

  // Deploy PropertyNFTFactory with UserRegistry dependency
  const propertyFactory = m.contract("PropertyNFTFactory", [userRegistry]);

  // Deploy ReviewRegistry with UserRegistry dependency
  const reviewRegistry = m.contract("ReviewRegistry", [userRegistry]);

  // Deploy PropertyEscrow with UserRegistry and PropertyNFTFactory dependencies
  const propertyEscrow = m.contract("PropertyEscrow", [userRegistry, propertyFactory]);

  // Deploy SoulboundNFT with UserRegistry dependency
  const soulboundNFT = m.contract("SoulboundNFT", [userRegistry]);

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
