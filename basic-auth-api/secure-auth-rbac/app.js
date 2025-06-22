const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./configs/db");
const authRoutes = require("./routes/auth.routes");
const bookingRoutes = require("./routes/booking.routes");

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/bookings", bookingRoutes);

app.get("/", (req, res) => res.send("Service Booking API Running"));

connectDB();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server Started"));
