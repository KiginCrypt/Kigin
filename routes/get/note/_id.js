const path = require("path");
const db = require("better-sqlite3")(path.join(__dirname, "../../../kigin.db"));
const crypt = require("../../../includes/crypt");

module.exports = (req, res) => {
    const key = req.header("authorization");
    const { id } = req.params;

    // Check if key (syntax-wise) is valid
    if (!key) return res.send({ status: "NO_KEY" });
    if (key.length !== 289 || key.charAt(32) !== ".") return res.send({ status: "KEY_INCORRECT" });

    // Get note
    const result = db.prepare("SELECT * FROM notes WHERE id = ?;").get([id]);

    if (!result) return res.status(404).send({ status: "NOT_FOUND" });

    // If it's not owned by this person, don't send it
    if (result.ownedBy !== key.split(".")[0]) return res.status(403).send({ status: "FORBIDDEN" });

    // Encrypt title/body
    const decryptedTitle = crypt.decrypt(result.title, key);
    const decryptedBody = crypt.decrypt(result.body, key);

    if (!decryptedTitle || !decryptedBody) return res.send({ status: "KEY_INCORRECT" });

    return res.send({
        status: "SUCCESS",
        result: {
            title: decryptedTitle,
            body: decryptedBody
        }
    });
}