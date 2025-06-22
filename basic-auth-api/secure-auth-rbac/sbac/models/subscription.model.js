const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    plan: { type: String, enum: ["free", "premium"], default: "free" },
    startedAt: Date
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
