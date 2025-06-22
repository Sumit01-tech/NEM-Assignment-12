const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    serviceName: String,
    requestedDate: Date,
    requestedTime: String,
    status: { type: String, enum: ["pending", "approved", "rejected", "cancelled"], default: "pending" }
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
