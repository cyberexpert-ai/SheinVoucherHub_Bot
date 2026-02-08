/**
 * database/categories.js
 * Voucher categories & stock helpers
 */

const { getRows, appendRow, updateRow } = require('../config/sheets');

const SHEET = 'Categories';

// Get all categories
async function getCategories() {
  return getRows(SHEET);
}

// Get category by ID
async function getCategory(categoryId) {
  const rows = await getRows(SHEET);
  return rows.find(c => c.CategoryID === categoryId) || null;
}

// Add new category
async function addCategory({
  categoryId,
  title,
  faceValue,
  stock,
  price1,
  price2,
  price5,
  price10
}) {
  const row = [
    categoryId,        // CategoryID
    title,             // Title
    faceValue,         // FaceValue (e.g. 1000)
    stock.toString(),  // Stock
    price1.toString(), // Price_1
    price2.toString(), // Price_2
    price5.toString(), // Price_5
    price10.toString() // Price_10+
  ];

  await appendRow(SHEET, row);
  return getCategory(categoryId);
}

// Update category
async function updateCategory(categoryId, data) {
  return updateRow(SHEET, 'CategoryID', categoryId, data);
}

// Reduce stock
async function reduceStock(categoryId, qty) {
  const cat = await getCategory(categoryId);
  if (!cat) return false;

  const current = Number(cat.Stock || 0);
  if (current < qty) return false;

  const updated = current - qty;
  return updateCategory(categoryId, { Stock: updated.toString() });
}

// Increase stock
async function increaseStock(categoryId, qty) {
  const cat = await getCategory(categoryId);
  if (!cat) return false;

  const updated = Number(cat.Stock || 0) + Number(qty);
  return updateCategory(categoryId, { Stock: updated.toString() });
}

module.exports = {
  getCategories,
  getCategory,
  addCategory,
  updateCategory,
  reduceStock,
  increaseStock
};
