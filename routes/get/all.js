const path = require("path");
const db = require("better-sqlite3")(path.join(__dirname, "../../kigin.db"));

module.exports = (req, res) => {
    const key = req.header("authorization");

    // Check if key (syntax-wise) is valid
    if (!key) return res.send({ status: "NO_KEY" });
    if (key.length < 289 || key.charAt(32) !== ".") return res.send({ status: "KEY_INCORRECT" });

    // Get results
    const results = db.prepare("SELECT id FROM document WHERE ownedBy = ? ORDER BY createdAt DESC;").all([key.split(".")[0]]);

    // Put all the IDs in an ID array
    let ids = [];

    for (const item of results) ids.push(item.id);
    
    return res.send({ status: "SUCCESS", result: ids });
}