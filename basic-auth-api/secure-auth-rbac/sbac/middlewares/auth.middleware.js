const jwt = require("jsonwebtoken");
const Blacklisted = require("../models/token.model");

module.exports = async (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: "Authorization header missing" });

    const token = auth.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing" });

    // Check if blacklisted
    const isBlacklisted = await Blacklisted.findOne({ token });
    if (isBlacklisted) return res.status(401).json({ message: "Token is blacklisted" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
