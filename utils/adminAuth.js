/**
 * utils/adminAuth.js
 * Role + permission checker
 */

const { getAdminRole } = require('../database/admins');
const { hasPermission } = require('../config/roles');

async function requirePermission(adminId, permission) {
  const role = await getAdminRole(adminId);
  if (!role) return false;
  return hasPermission(role, permission);
}

module.exports = {
  requirePermission
};
