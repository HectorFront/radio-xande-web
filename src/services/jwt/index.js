import CryptoJS from 'crypto-js';

const SECRET = import.meta.env.VITE_JWT_SECRET;
const IV = CryptoJS.enc.Hex.parse(SECRET);

/**
 *
 * @param {*} value
 * @returns {string|null}
 */
export const JWTEncode = (value) => {
  if (!value) return null;
  const plaintext = encodeURIComponent(typeof value === 'string' ? value : JSON.stringify(value));
  const encrypted = CryptoJS.AES.encrypt(plaintext, CryptoJS.enc.Utf8.parse(SECRET), {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
};

/**
 * Decripta
 * @param {string} encryptedBase64
 * @returns {*}
 */
export const JWTDecode = (encryptedBase64) => {
  if (!encryptedBase64) return null;

  const encrypted = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(encryptedBase64),
    key: CryptoJS.enc.Utf8.parse(SECRET),
    iv: IV,
  });

  const decrypted = CryptoJS.AES.decrypt(encrypted, CryptoJS.enc.Utf8.parse(SECRET), {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const result = decrypted.toString(CryptoJS.enc.Utf8);
  try {
    return JSON.parse(decodeURIComponent(result));
  } catch {
    if (result && result !== "undefined") {
      return decodeURIComponent(result);
    }
    return null;
  }
};