const crypt = require("../includes/crypt");

module.exports = (req, res) => {
    const { pincode } = req.query;
    
    if (isNaN(Number(pincode))) return res.send({ status: "PINCODE_INCORRECT" });
    if (pincode.length !== 6) return res.send({ status: "PINCODE_INCORRECT" });
    for (let i = 0; i < pincode.length; i++) {
        if (!"0123456789".includes(pincode.charAt(i))) return res.send({ status: "PINCODE_INCORRECT" });
    }

    const key = crypt.genKey(pincode);

    return res.send({ status: "SUCCESS", key });
}