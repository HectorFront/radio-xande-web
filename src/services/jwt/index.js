import CryptoJS from "crypto-js";

const KEY = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_AES_KEY);
const IV = CryptoJS.enc.Hex.parse(import.meta.env.VITE_AES_IV);

export const JWTEncode = (value) => {
  if (!value) return null;

  const plaintext = encodeURIComponent(
    typeof value === "string" ? value : JSON.stringify(value)
  );

  const encrypted = CryptoJS.AES.encrypt(plaintext, KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
};

export const JWTDecode = (ciphertext) => {
  if (!ciphertext) return null;

  const decrypted = CryptoJS.AES.decrypt(ciphertext, KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const result = decrypted.toString(CryptoJS.enc.Utf8);

  try {
    return JSON.parse(decodeURIComponent(result));
  } catch {
    return decodeURIComponent(result || "");
  }
};
