const crypto = require('crypto');

const SALT_PREFIX = Buffer.from('Salted__');

// OpenSSL EVP_BytesToKey with MD5, as used by CryptoJS for passphrase-based AES.
function deriveKeyAndIv(passphrase, salt) {
  let derived = Buffer.alloc(0);
  let block = Buffer.alloc(0);

  while (derived.length < 48) {
    block = crypto
      .createHash('md5')
      .update(Buffer.concat([block, Buffer.from(passphrase, 'utf8'), salt]))
      .digest();
    derived = Buffer.concat([derived, block]);
  }

  return { key: derived.subarray(0, 32), iv: derived.subarray(32, 48) };
}

function assertPassphrase(passphrase) {
  if (!passphrase) {
    throw new Error(
      'VIEW_ENCRYPTION_KEY is not set. Use the same value as REACT_APP_ENCRYPTION_KEY of the web app.',
    );
  }
}

/**
 * Encrypts view content the same way the web app does with
 * CryptoJS.AES.encrypt(JSON.stringify(data), key), so the web app can decrypt it.
 */
function encrypt(data, passphrase) {
  assertPassphrase(passphrase);

  const salt = crypto.randomBytes(8);
  const { key, iv } = deriveKeyAndIv(passphrase, salt);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(data), 'utf8'), cipher.final()]);

  return Buffer.concat([SALT_PREFIX, salt, encrypted]).toString('base64');
}

function decrypt(text, passphrase) {
  assertPassphrase(passphrase);

  const raw = Buffer.from(text, 'base64');
  const salt = raw.subarray(8, 16);
  const { key, iv } = deriveKeyAndIv(passphrase, salt);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([decipher.update(raw.subarray(16)), decipher.final()]);

  return JSON.parse(decrypted.toString('utf8'));
}

module.exports = {
  decrypt,
  encrypt,
};
