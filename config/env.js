/**
 * config/env.js
 * Centralized environment loader & validator
 */

require('dotenv').config();

const REQUIRED_ENVS = [
  'BOT_TOKEN',
  'ADMIN_ID',
  'GOOGLE_SHEET_ID',
  'GOOGLE_CREDENTIALS'
];

for (const key of REQUIRED_ENVS) {
  if (!process.env[key]) {
    console.error(`❌ Missing environment variable: ${key}`);
    process.exit(1);
  }
}

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  ADMIN_ID: Number(process.env.ADMIN_ID),
  GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID,
  GOOGLE_CREDENTIALS: process.env.GOOGLE_CREDENTIALS
};
