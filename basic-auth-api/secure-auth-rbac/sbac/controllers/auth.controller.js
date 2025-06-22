const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const BlacklistedToken = require("../models/token.model");

exports.signup = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: "Email already in use" });

        const hashed = await bcrypt.hash(password, 10);
        await User.create({ username, email, password: hashed, role });
        res.status(201).json({ message: "Signup successful" });
    } catch {
        res.status(500).json({ error: "Failed to signup" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ message: "Invalid credentials" });

        const payload = { userId: user._id, role: user.role };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_EXPIRES_IN });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: process.env.REFRESH_EXPIRES_IN });

        res.status(200).json({ accessToken, refreshToken });
    } catch {
        res.status(500).json({ error: "Login failed" });
    }
};

exports.refresh = (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: "Refresh token missing" });

    jwt.verify(token, process.env.REFRESH_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid refresh token" });
        const payload = { userId: decoded.userId, role: decoded.role };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_EXPIRES_IN });
        res.json({ accessToken });
    });
};

exports.logout = async (req, res) => {
    const auth = req.headers.authorization;
    const { refreshToken } = req.body;
    if (!auth || !refreshToken) return res.status(400).json({ message: "Both tokens required" });

    const access = auth.split(" ")[1];
    await BlacklistedToken.create({ token: access, expiresAt: new Date(Date.now() + 900000) });
    await BlacklistedToken.create({ token: refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });

    res.json({ message: "Logged out" });
};
