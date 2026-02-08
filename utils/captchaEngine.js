/**
 * utils/captchaEngine.js
 * Advanced captcha generator (multiple types)
 */

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function mathCaptcha() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  return {
    q: `🧮 ${a} + ${b} = ?`,
    a: (a + b).toString()
  };
}

function reverseCaptcha() {
  const word = random(['shein', 'voucher', 'telegram', 'secure']);
  return {
    q: `🔁 Reverse this word:\n${word}`,
    a: word.split('').reverse().join('')
  };
}

function emojiCaptcha() {
  return {
    q: `😀😀😎 = ? (count emojis)`,
    a: '3'
  };
}

function missingNumber() {
  return {
    q: `🔢 2, 4, __ , 8`,
    a: '6'
  };
}

const generators = [
  mathCaptcha,
  reverseCaptcha,
  emojiCaptcha,
  missingNumber
];

function generateCaptcha() {
  return random(generators)();
}

module.exports = {
  generateCaptcha
};
