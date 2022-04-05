const path = require("path");
const db = require("better-sqlite3")(path.join(__dirname, "../../kigin.db"));
const crypt = require("../../includes/crypt");
const randomString = require("../../includes/randomString");

module.exports = (req, res) => {
    const { title, body } = req.body;
    const key = req.header("authorization");

    // Checks
    if (!title || typeof title !== "string") return res.send({ status: "NO_TITLE" });
    if (!body || typeof body !== "string") return res.send({ status: "NO_BODY" });
    if (!key) return res.send({ status: "NO_KEY" });

    if (title.length > 128) return res.send({ status: "TITLE_TOO_LONG" });
    if (body.length > 2048) return res.send({ status: "BODY_TOO_LONG" });

    if (key.length !== 289 || key.charAt(32) !== ".") return res.send({ status: "KEY_INCORRECT" });

    // Encrypt title/body
    const encryptedTitle = crypt.encrypt(title, key);
    const encryptedBody = crypt.encrypt(body, key);

    if (encryptedTitle === false || encryptedBody === false) return res.send({ status: "KEY_INCORRECT" });

    // Generate ID
    const id = randomString(16);

    db.prepare("INSERT INTO notes (id, title, body, ownedBy, createdAt) VALUES (?, ?, ?, ?, ?);").run([
        id,
        encryptedTitle,
        encryptedBody,
        key.split(".")[0],
        Math.floor(Date.now() / 1000)
    ]);

    return res.send({ status: "SUCCESS", id });
}