const express = require("express");
const router = express.Router();
const {
  getCaseStudies,
  getCaseStudyById,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
} = require("../controllers/caseStudyController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const coverUpload = upload.single("cover");

// Public routes
router.get("/", getCaseStudies);
router.get("/:id", getCaseStudyById);

// Protected (admin only) routes
router.post("/", protect, coverUpload, createCaseStudy);
router.put("/:id", protect, coverUpload, updateCaseStudy);
router.delete("/:id", protect, deleteCaseStudy);

module.exports = router;