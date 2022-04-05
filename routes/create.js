const path = require("path");
const db = require("better-sqlite3")(path.join(__dirname, "../kigin.db"));
const crypt = require("../includes/crypt");
const randomString = require("../includes/randomString");

module.exports = (req, res) => {
    const { public, private } = req.body;
    const key = req.header("authorization");

    // Checks
    if (!public || typeof public !== "string") return res.send({ status: "NO_PUBLIC" });
    if (!private || typeof private !== "string") return res.send({ status: "NO_PRIVATE" });
    if (!key) return res.send({ status: "NO_KEY" });

    if (public.length > 2048) return res.send({ status: "PUBLIC_TOO_LONG" });
    if (private.length > 2048) return res.send({ status: "PRIVATE_TOO_LONG" });

    if (key.length < 289 || key.charAt(32) !== ".") return res.send({ status: "KEY_INCORRECT" });

    // Encrypt private
    const encryptedPrivate = crypt.encrypt(private, key);

    if (encryptedPrivate === false) return res.send({ status: "KEY_INVALID" });

    // Generate ID
    const id = randomString(16);

    db.prepare(`INSERT INTO document (id, public, "private", ownedBy, createdAt) VALUES (?, ?, ?, ?, ?);`).run([
        id,
        public,
        encryptedPrivate,
        key.split(".")[0],
        Math.floor(Date.now() / 1000)
    ]);

    return res.send({ status: "SUCCESS", id });
}