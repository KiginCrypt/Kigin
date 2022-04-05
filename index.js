const path = require("path");
const fs = require("fs");
const db = require("better-sqlite3")(path.join(__dirname, "./kigin.db"));
const express = require("express");
const crypt = require("./includes/crypt");
const randomString = require("./includes/randomString");

const config = require("./kigin.config");

db.exec(fs.readFileSync(path.join(__dirname, "./database.sql"), "utf-8"));

const app = express();

app.use(require("cors")());
app.use(express.json());

app.get("/kigin/generateKey", require("./routes/generateKey"));

app.post("/kigin/create/note", require("./routes/create/note"));
app.get("/kigin/get/note/:id", require("./routes/get/note/_id"));
app.get("/kigin/get/notes", require("./routes/get/notes"));

app.use("*", (req, res) => {
    return res.status(404).send({ status: "NOT_FOUND" });
});

app.listen(config.port, () => {
    console.log(`[Kigin] Listening on http://localhost:${config.port}`);
});