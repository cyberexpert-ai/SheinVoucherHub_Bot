/**
 * cron/tempUnblock.js
 * Automatically remove expired temporary blocks
 */

const cron = require('node-cron');
const { getRows, updateRow } = require('../config/sheets');

// Run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  try {
    const blocks = await getRows('Blocks');
    const now = Date.now();

    for (const b of blocks) {
      if (b.Status !== 'Active') continue;
      if (!b.ExpireAt) continue; // permanent block

      const expireTime = new Date(b.ExpireAt).getTime();
      if (now >= expireTime) {
        await updateRow('Blocks', 'UserID', b.UserID, {
          Status: 'Expired'
        });
      }
    }
  } catch (err) {
    console.error('Temp unblock cron error:', err.message);
  }
});
