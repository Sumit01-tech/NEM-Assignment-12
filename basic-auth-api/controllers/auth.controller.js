const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "User already exists" });

        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashed });
        await user.save();
        return res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        return res.status(500).json({ error: "Something went wrong" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Invalid credentials" });

        const payload = { userId: user._id, email: user.email };

        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_EXPIRES_IN });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: process.env.REFRESH_EXPIRES_IN });

        return res.status(200).json({ accessToken, refreshToken });
    } catch (err) {
        return res.status(500).json({ error: "Something went wrong" });
    }
};

const refreshToken = (req, res) => {
    const token = req.body.token;
    if (!token) return res.status(401).json({ message: "Refresh token missing" });

    try {
        const payload = jwt.verify(token, process.env.REFRESH_SECRET);
        const newAccessToken = jwt.sign(
            { userId: payload.userId, email: payload.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.ACCESS_EXPIRES_IN }
        );
        return res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }
};

module.exports = { signup, login, refreshToken };
