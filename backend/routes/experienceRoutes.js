const express = require("express");
const router = express.Router();
const {
  getExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
} = require("../controllers/experienceController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const logoUpload = upload.single("logo");

// Public routes
router.get("/", getExperiences);
router.get("/:id", getExperienceById);

// Protected (admin only) routes
router.post("/", protect, logoUpload, createExperience);
router.put("/:id", protect, logoUpload, updateExperience);
router.delete("/:id", protect, deleteExperience);

module.exports = router;