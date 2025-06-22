const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
    title: String,
    description: String,
    accessLevel: { type: String, enum: ["free", "premium"], default: "free" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Content", contentSchema);
