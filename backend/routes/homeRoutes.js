const express = require("express");
const router = express.Router();
const { getHome } = require("../controllers/homeController");

// Public
router.get("/", getHome);

module.exports = router;
