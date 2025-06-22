const Blacklisted = require("../models/token.model");

module.exports = async (token) => {
    const decoded = jwt.decode(token);
    const expiresAt = new Date(decoded.exp * 1000);
    await Blacklisted.create({ token, expiresAt });
};
