const express = require("express");
const { signup, login, refresh, logout } = require("../controllers/auth.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", auth, logout);

module.exports = router;
