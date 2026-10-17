const Experience = require("../models/Experience");

const splitComma = (v) =>
  typeof v === "string" ? v.split(",").map((t) => t.trim()).filter(Boolean) : v;

const splitLines = (v) =>
  typeof v === "string"
    ? v.split(/\r?\n/).map((t) => t.replace(/^\s*[-•*]\s*/, "").trim()).filter(Boolean)
    : v;

// Turn multipart form-data strings into the shapes the schema expects
const prepareBody = (req) => {
  const body = { ...req.body };

  ["technologies", "integrations", "deployment"].forEach((k) => {
    if (k in body) body[k] = splitComma(body[k]);
  });
  ["responsibilities", "projects"].forEach((k) => {
    if (k in body) body[k] = splitLines(body[k]);
  });

  if (body.isCurrent === true || body.isCurrent === "true") body.endDate = "";
  if (body.type && body.type !== "Job") body.yearsOfExperience = "";

  if (req.file) body.logo = req.file.cloudUrl;
  return body;
};

// @route GET /api/experience  (public)
const getExperiences = async (req, res) => {
  try {
    const items = await Experience.find().sort({ order: 1, startDate: -1, createdAt: -1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/experience/:id  (public)
const getExperienceById = async (req, res) => {
  try {
    const item = await Experience.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Experience not found" });
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/experience  (admin)
const createExperience = async (req, res) => {
  try {
    const item = await Experience.create(prepareBody(req));
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @route PUT /api/experience/:id  (admin)
const updateExperience = async (req, res) => {
  try {
    const item = await Experience.findByIdAndUpdate(req.params.id, prepareBody(req), {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ success: false, message: "Experience not found" });
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @route DELETE /api/experience/:id  (admin)
const deleteExperience = async (req, res) => {
  try {
    const item = await Experience.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Experience not found" });
    res.status(200).json({ success: true, message: "Experience deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
};