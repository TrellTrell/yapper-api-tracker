const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const API_TOKEN = process.env.API_TOKEN;
const API_PASSWORD = process.env.API_PASSWORD;

if (!API_TOKEN) {
  console.error('API token is missing. Set it as a GitHub secret.');
  process.exit(1);
}

// List of APIs to fetch
const apis = [
    { name: 'collectibles-home', url: 'https://shop-archives-api.vercel.app/api/collectibles-shop?tab=home' },
    { name: 'collectibles-shop', url: 'https://shop-archives-api.vercel.app/api/collectibles-shop?tab=shop' },
    { name: 'collectibles-orbs', url: 'https://shop-archives-api.vercel.app/api/collectibles-shop?tab=orbs' },
    { name: 'collectibles-leaks', url: 'https://shop-archives-api.vercel.app/api/collectibles-shop?tab=leaks' },
    { name: 'collectibles-nameplates', url: 'https://shop-archives-api.vercel.app/api/collectibles-shop?tab=nameplates' },
    { name: 'collectibles-consumables', url: 'https://shop-archives-api.vercel.app/api/collectibles-shop?tab=consumables' },
    { name: 'collectibles-miscellaneous', url: 'https://shop-archives-api.vercel.app/api/collectibles-shop?tab=miscellaneous' },
    { name: 'pplus-home', url: 'https://shop-archives-api.vercel.app/api/collectibles-shop?tab=pplus-home' },
    { name: 'pplus', url: 'https://shop-archives-api.vercel.app/api/collectibles-shop?tab=pplus' },
    { name: 'profile-effects-discord', url: 'https://shop-archives-api.vercel.app/api/profile-effects?tab=discord' },
    { name: 'profile-effects-pplus', url: 'https://shop-archives-api.vercel.app/api/profile-effects?tab=pplus' },
];

async function fetchData() {
  try {
    const logsDir = path.join(__dirname, 'public');
    await fs.ensureDir(logsDir);  // Ensure directory exists

    for (const api of apis) {
      console.log(`Fetching from: ${api.url}`);

      const response = await axios.get(api.url, {
        headers: {
          token: API_TOKEN,
          password: API_PASSWORD,
          'Content-Type': 'application/json'
        }
      });

      console.log(`Response from ${api.name}:`, response.data);

      const filePath = path.join(logsDir, `${api.name}.json`);

      // ✅ Debugging: Check if writing works
      console.log(`Writing to: ${filePath}`);
      await fs.writeJson(filePath, response.data, { spaces: 2 });

      // ✅ Verify file existence
      if (fs.existsSync(filePath)) {
        console.log(`✅ File saved: ${filePath}`);
      } else {
        console.log(`❌ File was NOT saved!`);
      }
    }
  } catch (error) {
    console.error(`Error fetching ${error.config?.url}: ${error.message}`);
    process.exit(1);
  }
}

fetchData();
