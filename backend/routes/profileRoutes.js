const express = require("express");
const router = express.Router();
const {
  getProfile,
  createProfile,
  updateProfile,
  getResume,
} = require("../controllers/profileController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Public routes
router.get("/", getProfile);
router.get("/resume", getResume);

const profileUpload = upload.fields([
  { name: "resume", maxCount: 1 },
  { name: "profileImage", maxCount: 1 },
]);

// Protected (admin only) routes
router.post("/", protect, profileUpload, createProfile);
router.put("/", protect, profileUpload, updateProfile);

module.exports = router;
