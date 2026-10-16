const express = require("express");
const router = express.Router();
const {
  getProjects,
  getProjectById,
  getProjectFields,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const projectUpload = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

// Public routes
router.get("/", getProjects);
router.get("/fields/all", getProjectFields);
router.get("/:id", getProjectById);

// Protected (admin only) routes
router.post("/", protect, projectUpload, createProject);
router.put("/:id", protect, projectUpload, updateProject);
router.delete("/:id", protect, deleteProject);

module.exports = router;
