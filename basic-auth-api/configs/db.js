const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected");
    } catch (err) {
        console.error("DB connection error:", err.message);
    }
};

module.exports = connectDB;
