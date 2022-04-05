const path = require("path");
const db = require("better-sqlite3")(path.join(__dirname, "../../kigin.db"));
const crypt = require("../../includes/crypt");

module.exports = (req, res) => {
    const key = req.header("authorization");
    const { id } = req.params;

    // Check if key (syntax-wise) is valid
    if (!key) return res.send({ status: "NO_KEY" });
    if (key.length < 289 || key.charAt(32) !== ".") return res.send({ status: "KEY_INCORRECT" });

    // Get note
    const result = db.prepare("SELECT * FROM document WHERE id = ?;").get([id]);

    if (!result) return res.status(404).send({ status: "NOT_FOUND" });

    // If it's not owned by this person, don't send it
    if (result.ownedBy !== key.split(".")[0]) return res.status(403).send({ status: "FORBIDDEN" });

    // Decrypt private
    const decryptedPrivate = crypt.decrypt(result.private, key);

    if (!decryptedPrivate) return res.send({ status: "KEY_INVALID" });

    return res.send({
        status: "SUCCESS",
        result: {
            public: result.public,
            private: decryptedPrivate
        }
    });
}