const Cryptr = require("cryptr");
const config = require("../kigin.config");
const randomString = require("./randomString");

const verifyKey = (key) => {
    const keygen = new Cryptr(config.keygen);

    let success = true;

    let verifier = "";

    // Try to decrypt
    try { verifier = keygen.decrypt(key.split(".")[1]); }
    catch { success = false; }

    // Check if verifier contains identifier
    if (verifier.split(".")[0] !== key.split(".")[0]) success = false;
    
    // Check if verifier contains pincode
    if (verifier.split(".")[1] !== key.split(".")[2]) success = false;

    return success;
}

module.exports = {
    genKey: (pincode) => {
        const keygen = new Cryptr(config.keygen);
        const identifier = randomString(32);
        const verifier = identifier + "." + pincode;

        return identifier + "." + keygen.encrypt(verifier);
    },

    verifyKey,

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