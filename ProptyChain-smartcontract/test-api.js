const https = require('https');

async function testBaseScanAPI() {
  console.log("🔍 Testing BaseScan API v2...\n");
  
  const apiKey = "JIVPWHZP2R873G8JVGAEIRR3MD9TY661DJ";
  const testAddress = "0xA77887A7fFb3B5A2fE1eb8583cB30bE87757375A";
  
  // Test the new v2 API endpoint
  const url = `https://api-sepolia.basescan.org/v2/api?module=contract&action=getsourcecode&address=${testAddress}&apikey=${apiKey}`;
  
  console.log(`Testing URL: ${url}\n`);
  
  https.get(url, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log("📡 API Response:");
        console.log(JSON.stringify(response, null, 2));
        
        if (response.status === '1') {
          console.log("\n✅ API Key is working!");
        } else {
          console.log(`\n❌ API Error: ${response.message}`);
          console.log("\n🔑 You need to get a new BaseScan API key from:");
          console.log("   https://basescan.org/apis");
        }
      } catch (error) {
        console.log("❌ Error parsing response:", error.message);
      }
    });
  }).on('error', (err) => {
    console.log("❌ Error making request:", err.message);
  });
}

testBaseScanAPI();

