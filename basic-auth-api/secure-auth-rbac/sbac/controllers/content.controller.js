const Content = require("../models/content.model");
const Subscription = require("../models/subscription.model");

exports.createContent = async (req, res) => {
    const { title, description, accessLevel } = req.body;
    try {
        const content = await Content.create({ title, description, accessLevel, createdBy: req.user.userId });
        res.status(201).json(content);
    } catch {
        res.status(500).json({ error: "Failed to create content" });
    }
};

exports.getContent = async (req, res) => {
    try {
        const sub = await Subscription.findOne({ userId: req.user.userId });
        const plan = sub ? sub.plan : "free";
        const content = await Content.find({ accessLevel: { $in: ["free", ...(plan === "premium" ? ["premium"] : [])] } });
        res.json(content);
    } catch {
        res.status(500).json({ error: "Failed to fetch content" });
    }
};
