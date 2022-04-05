const path = require("path");
const db = require("better-sqlite3")(path.join(__dirname, "../../kigin.db"));

module.exports = (req, res) => {
    const key = req.header("authorization");

    if (!key) return res.send({ status: "NO_KEY" });
    if (key.length !== 289 || key.charAt(32) !== ".") return res.send({ status: "KEY_INCORRECT" });

    const results = db.prepare("SELECT id FROM notes WHERE ownedBy = ? ORDER BY createdAt DESC;").all([key.split(".")[0]]);

    let ids = [];

    for (const item of results) ids.push(item.id);

    return res.send({ status: "SUCCESS", result: ids });
}