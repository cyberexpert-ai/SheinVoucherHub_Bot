/**
 * config/roles.js
 * Admin roles & permissions
 */

const ROLES = {
  OWNER: 'owner',
  SUPER_ADMIN: 'super_admin',
  ORDER_MANAGER: 'order_manager',
  STOCK_MANAGER: 'stock_manager',
  SUPPORT_MANAGER: 'support_manager',
  FINANCE_MANAGER: 'finance_manager'
};

// What each role can do
const PERMISSIONS = {
  owner: [
    'ALL'
  ],

  super_admin: [
    'VIEW_DASHBOARD',
    'MANAGE_ORDERS',
    'MANAGE_USERS',
    'MANAGE_STOCK',
    'MANAGE_COUPONS',
    'MANAGE_DISCOUNTS',
    'BROADCAST',
    'VIEW_REPORTS'
  ],

  order_manager: [
    'MANAGE_ORDERS',
    'VIEW_ORDERS'
  ],

  stock_manager: [
    'MANAGE_STOCK',
    'VIEW_STOCK'
  ],

  support_manager: [
    'VIEW_SUPPORT',
    'REPLY_SUPPORT',
    'BLOCK_USER'
  ],

  finance_manager: [
    'VIEW_FINANCE',
    'VIEW_REPORTS'
  ]
};

// Permission checker
function hasPermission(role, permission) {
  if (!role) return false;
  if (role === ROLES.OWNER) return true;

  const perms = PERMISSIONS[role] || [];
  return perms.includes('ALL') || perms.includes(permission);
}

module.exports = {
  ROLES,
  PERMISSIONS,
  hasPermission
};
