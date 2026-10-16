const express = require("express");
const router = express.Router();
const {
  createContact,
  getContacts,
  markAsRead,
  deleteContact,
} = require("../controllers/contactController");
const { protect } = require("../middleware/auth");

// Public route - visitors submit the contact form
router.post("/", createContact);

// Protected (admin only) routes
router.get("/", protect, getContacts);
router.patch("/:id/read", protect, markAsRead);
router.delete("/:id", protect, deleteContact);

module.exports = router;
