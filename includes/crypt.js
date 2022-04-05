const Cryptr = require("cryptr");
const config = require("../kigin.config");
const randomString = require("./randomString");

const verifyKey = (key) => {
    const keygen = new Cryptr(config.keygen);

    try { keygen.decrypt(key); }
    catch { return false; }

    return true;
}

module.exports = {
    genKey: () => {
        const keygen = new Cryptr(config.keygen);
        const salt = randomString(16);

        return keygen.encrypt(salt);
    },

    encrypt: (string, key) => {
        if (!verifyKey(key)) return false;

        const encryptor = new Cryptr(key);
        return encryptor.encrypt(string);
    },

    decrypt: (encrypted, key) => {
        if (!verifyKey(key)) return false;

        const decryptor = new Cryptr(key);

        let decrypted;

        try { decrypted = decryptor.decrypt(encrypted); }
        catch { return false; }

        return decrypted;
    }
}