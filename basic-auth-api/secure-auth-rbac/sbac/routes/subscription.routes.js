const express = require("express");
const auth = require("../middlewares/auth.middleware");
const { addSubscription } = require("../controllers/subscription.controller");

const router = express.Router();
router.post("/", auth, addSubscription);

module.exports = router;
