const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const API_TOKEN = process.env.API_TOKEN;

if (!API_TOKEN) {
  console.error('API token is missing. Set it as a GitHub secret.');
  process.exit(1);
}

// List of APIs to fetch
const apis = [
    { name: 'collectibles-categories', url: 'https://shop-archives-api.vercel.app/api/collectibles-categories' },
    { name: 'consumables', url: 'https://shop-archives-api.vercel.app/api/consumables' },
    { name: 'downloads', url: 'https://shop-archives-api.vercel.app/api/downloads' },
    { name: 'miscellaneous-categories', url: 'https://shop-archives-api.vercel.app/api/miscellaneous-categories' },
    { name: 'orbs-shop-default', url: 'https://shop-archives-api.vercel.app/api/orbs-shop-default' },
    { name: 'preview-1', url: 'https://shop-archives-api.vercel.app/api/preview-1' },
    { name: 'preview-3', url: 'https://shop-archives-api.vercel.app/api/preview-3' },
    { name: 'profiles-plus-categories', url: 'https://shop-archives-api.vercel.app/api/profiles-plus-categories' },
    { name: 'profiles-plus-profile-effects', url: 'https://shop-archives-api.vercel.app/api/profiles-plus-profile-effects' },
    { name: 'quick-info', url: 'https://shop-archives-api.vercel.app/api/quick-info' },
    { name: 'user-profile-effects', url: 'https://shop-archives-api.vercel.app/api/user-profile-effects' },
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
