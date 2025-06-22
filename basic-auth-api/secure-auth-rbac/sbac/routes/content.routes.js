const express = require("express");
const auth = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/role.middleware");
const { createContent, getContent } = require("../controllers/content.controller");

const router = express.Router();
router.post("/", auth, isAdmin("admin"), createContent);
router.get("/", auth, getContent);

module.exports = router;
