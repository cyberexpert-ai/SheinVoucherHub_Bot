/**
 * database/admins.js
 * Multi-admin helpers
 */

const { getRows } = require('../config/sheets');

const SHEET = 'Admins';

// Get admin by ID
async function getAdmin(adminId) {
  const rows = await getRows(SHEET);
  return rows.find(
    a => a.AdminID == adminId && a.Status === 'Active'
  ) || null;
}

// Get role of admin
async function getAdminRole(adminId) {
  const admin = await getAdmin(adminId);
  return admin ? admin.Role : null;
}

// Check if admin
async function isAdmin(adminId) {
  const admin = await getAdmin(adminId);
  return !!admin;
}

module.exports = {
  getAdmin,
  getAdminRole,
  isAdmin
};
