// Generate random alphanumeric CAPTCHA (uppercase letters only)
function generateCaptcha(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let captcha = '';
  for (let i = 0; i < length; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
}

module.exports = { generateCaptcha };
