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
app.get("/kigin/verifyKey", require("./routes/verifyKey"));

app.post("/kigin/create", require("./routes/create"));
app.get("/kigin/get/all", require("./routes/get/all"));
app.get("/kigin/get/:id", require("./routes/get/_id"));

app.use("*", (req, res) => {
    return res.status(404).send({ status: "NOT_FOUND" });
});

app.listen(config.port, () => {
    console.log(`[Kigin] Listening on http://localhost:${config.port}`);
});