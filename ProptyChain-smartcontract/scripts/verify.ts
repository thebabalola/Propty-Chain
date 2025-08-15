import { run } from "hardhat";

export async function verify(contractAddress: string, args: any[] = []) {
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
