const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./configs/db");
const authRoutes = require("./routes/auth.routes");

const app = express();
app.use(express.json());

app.use("/", authRoutes);

app.get("/protected", require("./middlewares/auth.middleware"), (req, res) => {
    res.status(200).json({ message: `Welcome ${req.user.email}` });
});

connectDB();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server Started"));
