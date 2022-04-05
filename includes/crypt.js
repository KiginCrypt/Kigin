const Cryptr = require("cryptr");
const config = require("../kigin.config");
const randomString = require("./randomString");

const verifyKey = (key) => {
    const keygen = new Cryptr(config.keygen);

    let success = true;

    let decryptedSalt = "";

    try { decryptedSalt = keygen.decrypt(key.split(".")[1]); }
    catch { success = false; }

    if (decryptedSalt !== key.split(".")[0]) success = false;

    return success;
}

module.exports = {
    genKey: () => {
        const keygen = new Cryptr(config.keygen);
        const salt = randomString(32);

        return salt + "." + keygen.encrypt(salt);
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