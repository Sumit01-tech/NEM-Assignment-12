const Booking = require("../models/booking.model");

exports.createBooking = async (req, res) => {
    try {
        const booking = new Booking({ ...req.body, userId: req.user.userId });
        await booking.save();
        res.status(201).json({ message: "Booking created", booking });
    } catch {
        res.status(500).json({ error: "Failed to create booking" });
    }
};

exports.getBookings = async (req, res) => {
    try {
        const query = req.user.role === "admin" ? {} : { userId: req.user.userId };
        const bookings = await Booking.find(query);
        if (!bookings.length) return res.status(404).json({ message: "No bookings found" });
        res.status(200).json(bookings);
    } catch {
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
};

exports.updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking || booking.userId.toString() !== req.user.userId || booking.status !== "pending")
            return res.status(403).json({ message: "Not allowed" });

        await Booking.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({ message: "Booking updated" });
    } catch {
        res.status(500).json({ error: "Update failed" });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking || booking.userId.toString() !== req.user.userId || booking.status !== "pending")
            return res.status(403).json({ message: "Cannot cancel" });

        booking.status = "cancelled";
        await booking.save();
        res.status(200).json({ message: "Booking cancelled" });
    } catch {
        res.status(500).json({ error: "Cancel failed" });
    }
};

exports.approveBooking = async (req, res) => {
    try {
        await Booking.findByIdAndUpdate(req.params.id, { status: "approved" });
        res.status(200).json({ message: "Booking approved" });
    } catch {
        res.status(500).json({ error: "Approval failed" });
    }
};

exports.rejectBooking = async (req, res) => {
    try {
        await Booking.findByIdAndUpdate(req.params.id, { status: "rejected" });
        res.status(200).json({ message: "Booking rejected" });
    } catch {
        res.status(500).json({ error: "Rejection failed" });
    }
};

exports.deleteBooking = async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Booking deleted" });
    } catch {
        res.status(500).json({ error: "Delete failed" });
    }
};
