const path = require("path");
const db = require("better-sqlite3")(path.join(__dirname, "../../../kigin.db"));
const crypt = require("../../../includes/crypt");

module.exports = (req, res) => {
    const key = req.header("authorization");
    const { id } = req.params;

    if (!key) return res.send({ status: "NO_KEY" });
    if (key.length !== 289 || key.charAt(32) !== ".") return res.send({ status: "KEY_INCORRECT" });

    const result = db.prepare("SELECT * FROM notes WHERE id = ?;").get([id]);

    if (!result) return res.status(404).send({ status: "NOT_FOUND" });

    if (result.ownedBy !== key.split(".")[0]) return res.status(403).send({ status: "FORBIDDEN" });

    return res.send({
        status: "SUCCESS",
        result: {
            title: crypt.decrypt(result.title, key),
            body: crypt.decrypt(result.body, key)
        }
    });
}