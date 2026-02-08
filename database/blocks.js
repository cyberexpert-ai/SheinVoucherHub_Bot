/**
 * database/blocks.js
 * User block & temporary restriction helpers
 */

const { getRows, appendRow, updateRow } = require('../config/sheets');

const SHEET = 'Blocks';

// Check if user is blocked
async function isBlocked(userId) {
  const rows = await getRows(SHEET);
  const block = rows.find(b => b.UserID == userId && b.Status === 'Active');
  if (!block) return false;

  // Temporary block expiry check
  if (block.ExpireAt) {
    const now = Date.now();
    const expire = new Date(block.ExpireAt).getTime();
    if (now > expire) {
      // auto-unblock
      await updateRow(SHEET, 'UserID', userId.toString(), {
        Status: 'Expired'
      });
      return false;
    }
  }
  return true;
}

// Block user
async function blockUser({
  userId,
  reason = 'Violation',
  expireAt = '' // empty = permanent
}) {
  const row = [
    userId.toString(),
    reason,
    expireAt,
    'Active',
    new Date().toISOString()
  ];
  await appendRow(SHEET, row);
  return true;
}

// Unblock user
async function unblockUser(userId) {
  return updateRow(SHEET, 'UserID', userId.toString(), {
    Status: 'Expired'
  });
}

module.exports = {
  isBlocked,
  blockUser,
  unblockUser
};
