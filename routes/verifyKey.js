const crypt = require("../includes/crypt");

module.exports = (req, res) => {
  const key = req.header("authorization");

  // Check if key (syntax-wise) is valid
  if (!key) return res.send({ status: "NO_KEY" });
  if (key.length < 289 || key.charAt(32) !== ".") return res.send({ status: "KEY_INCORRECT" });

  const valid = crypt.verifyKey(key);

  return res.send({ status: "SUCCESS", valid });
}