const CryptoJS = require("crypto-js");
const key = "REACT-LARAVEL-CELIYA-2021";

export function encrypt(string) {
    let ciphertext = CryptoJS.AES.encrypt(string, key).toString();
    return ciphertext;
}

export function decrypt(string) {
    let bytes = CryptoJS.AES.decrypt(string, key);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
}