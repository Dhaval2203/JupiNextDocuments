import CryptoJS from 'crypto-js';

const SECRET_KEY = 'jupinext_secret';

/* Encrypt data */
export const encryptData = (data) => {
    return CryptoJS.AES.encrypt(
        JSON.stringify(data),
        SECRET_KEY
    ).toString();
};

/* Decrypt data */
export const decryptData = (cipherText) => {
    try {
        const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return decrypted ? JSON.parse(decrypted) : null;
    } catch {
        return null;
    }
};
