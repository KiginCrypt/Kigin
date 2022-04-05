module.exports = (length) => {
    const charSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let string = "";

    for (let i = 0; i < length; i++) {
        string += charSet.charAt(Math.floor(Math.random() * charSet.length));
    }

    return string;
}