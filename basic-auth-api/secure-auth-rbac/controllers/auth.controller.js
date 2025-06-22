const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "User already exists" });

        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashed, role });
        await user.save();
        res.status(201).json({ message: "User registered" });
    } catch {
        res.status(500).json({ error: "Signup failed" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password)))
            return res.status(400).json({ message: "Invalid credentials" });

        const payload = { userId: user._id, email: user.email, role: user.role };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_EXPIRES_IN });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: process.env.REFRESH_EXPIRES_IN });

        res.status(200).json({ accessToken, refreshToken });
    } catch {
        res.status(500).json({ error: "Login failed" });
    }
};

exports.refresh = (req, res) => {
    const token = req.body.token;
    if (!token) return res.status(401).json({ message: "Missing refresh token" });

    try {
        const payload = jwt.verify(token, process.env.REFRESH_SECRET);
        const newToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_EXPIRES_IN });
        res.status(200).json({ accessToken: newToken });
    } catch {
        res.status(403).json({ message: "Invalid refresh token" });
    }
};
