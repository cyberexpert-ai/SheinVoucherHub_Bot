/**
 * database/users.js
 * Users table helpers
 */

const { getRows, appendRow, updateRow } = require('../config/sheets');

const SHEET = 'Users';

// Get user by Telegram ID
async function getUser(userId) {
  const rows = await getRows(SHEET);
  return rows.find(u => u.UserID == userId) || null;
}

// Create user if not exists
async function ensureUser({ userId, username, firstName }) {
  const existing = await getUser(userId);
  if (existing) return existing;

  const row = [
    userId.toString(),            // UserID
    username || '',               // Username
    firstName || '',              // FirstName
    new Date().toISOString(),     // JoinedAt
    'Active',                     // Status (Active/Blocked)
    '0',                          // OrdersCount
    '0',                          // TotalSpent
    '0',                          // RiskScore
    ''                            // Notes
  ];

  await appendRow(SHEET, row);
  return getUser(userId);
}

// Update user fields
async function updateUser(userId, data) {
  return updateRow(SHEET, 'UserID', userId.toString(), data);
}

// Increment orders & spent
async function addOrderStats(userId, amount) {
  const user = await getUser(userId);
  if (!user) return false;

  const orders = Number(user.OrdersCount || 0) + 1;
  const spent = Number(user.TotalSpent || 0) + Number(amount || 0);

  return updateUser(userId, {
    OrdersCount: orders.toString(),
    TotalSpent: spent.toString()
  });
}

// Risk score handling
async function addRisk(userId, score = 1) {
  const user = await getUser(userId);
  if (!user) return false;

  const risk = Number(user.RiskScore || 0) + Number(score);
  return updateUser(userId, { RiskScore: risk.toString() });
}

module.exports = {
  getUser,
  ensureUser,
  updateUser,
  addOrderStats,
  addRisk
};
