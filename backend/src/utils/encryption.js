import CryptoJS from "crypto-js";

export const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, process.env.AES_SECRET).toString();
};

export const decrypt = (cipher) => {
  const bytes = CryptoJS.AES.decrypt(cipher, process.env.AES_SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};