/**
 * database/orders.js
 * Orders table helpers
 */

const { getRows, appendRow, updateRow } = require('../config/sheets');

const SHEET = 'Orders';

// Get order by OrderID
async function getOrder(orderId) {
  const rows = await getRows(SHEET);
  return rows.find(o => o.OrderID === orderId) || null;
}

// Get orders by UserID
async function getOrdersByUser(userId) {
  const rows = await getRows(SHEET);
  return rows.filter(o => o.UserID == userId);
}

// Create new order
async function createOrder({
  orderId,
  userId,
  username,
  category,
  quantity,
  amount,
  utr,
  status = 'Pending'
}) {
  const row = [
    orderId,                       // OrderID
    userId.toString(),             // UserID
    username || '',                // Username
    category || '',                // Category
    quantity.toString(),           // Quantity
    amount.toString(),             // Amount
    utr || '',                     // UTR
    status,                        // Status
    '',                            // VoucherCodes
    new Date().toISOString()       // CreatedAt
  ];

  await appendRow(SHEET, row);
  return getOrder(orderId);
}

// Update order
async function updateOrder(orderId, data) {
  return updateRow(SHEET, 'OrderID', orderId, data);
}

// Approve order
async function approveOrder(orderId, voucherCodes) {
  return updateOrder(orderId, {
    Status: 'Successful',
    VoucherCodes: voucherCodes
  });
}

// Reject order
async function rejectOrder(orderId, reason = '') {
  return updateOrder(orderId, {
    Status: 'Rejected',
    VoucherCodes: reason
  });
}

module.exports = {
  getOrder,
  getOrdersByUser,
  createOrder,
  updateOrder,
  approveOrder,
  rejectOrder
};
