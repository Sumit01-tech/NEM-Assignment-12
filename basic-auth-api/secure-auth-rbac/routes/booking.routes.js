const express = require("express");
const auth = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/role.middleware");
const {
    createBooking,
    getBookings,
    updateBooking,
    cancelBooking,
    approveBooking,
    rejectBooking,
    deleteBooking
} = require("../controllers/booking.controller");

const router = express.Router();

router.use(auth);

router.post("/", createBooking);
router.get("/", getBookings);
router.put("/:id", updateBooking);
router.delete("/:id", cancelBooking);

router.patch("/:id/approve", isAdmin("admin"), approveBooking);
router.patch("/:id/reject", isAdmin("admin"), rejectBooking);
router.delete("/:id", isAdmin("admin"), deleteBooking);

module.exports = router;
