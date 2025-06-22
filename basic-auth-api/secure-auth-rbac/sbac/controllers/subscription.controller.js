const Subscription = require("../models/subscription.model");

exports.addSubscription = async (req, res) => {
    const { plan } = req.body;
    try {
        const existing = await Subscription.findOne({ userId: req.user.userId });
        if (existing) existing.plan = plan, await existing.save();
        else await Subscription.create({ userId: req.user.userId, plan, startedAt: new Date() });

        res.json({ message: "Subscription updated", plan });
    } catch {
        res.status(500).json({ error: "Failed to subscribe" });
    }
};
