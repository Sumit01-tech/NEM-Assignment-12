const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./configs/db");
const authRoutes = require("./routes/auth.routes");
const subscriptionRoutes = require("./routes/subscription.routes");
const contentRoutes = require("./routes/content.routes");

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/content", contentRoutes);

app.get("/", (req, res) => res.send("Subscription Auth API Running"));

connectDB();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server Started"));
