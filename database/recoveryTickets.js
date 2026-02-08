/**
 * database/recoveryTickets.js
 * Recovery ticket helpers
 */

const { getRows, appendRow, updateRow } = require('../config/sheets');

const SHEET = 'RecoveryTickets';

function generateTicketId(orderId) {
  return `RT-${orderId}-${Date.now().toString().slice(-4)}`;
}

async function createTicket(orderId, userId) {
  const ticketId = generateTicketId(orderId);

  await appendRow(SHEET, [
    ticketId,
    orderId,
    userId.toString(),
    'Open',
    new Date().toISOString(),
    '',
    ''
  ]);

  return ticketId;
}

async function getTicket(ticketId) {
  const rows = await getRows(SHEET);
  return rows.find(t => t.TicketID === ticketId) || null;
}

async function closeTicket(ticketId, status, note = '') {
  return updateRow(SHEET, 'TicketID', ticketId, {
    Status: status,
    ClosedAt: new Date().toISOString(),
    AdminNote: note
  });
}

module.exports = {
  createTicket,
  getTicket,
  closeTicket
};
