const crypt = require("../includes/crypt");

module.exports = (req, res) => {
    return res.send({ status: "SUCCESS", key: crypt.genKey() });
}