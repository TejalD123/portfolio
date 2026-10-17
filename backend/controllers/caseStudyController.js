const CaseStudy = require("../models/CaseStudy");

const prepareBody = (req) => {
  const body = { ...req.body };
  if (typeof body.techStack === "string") {
    body.techStack = body.techStack.split(",").map((t) => t.trim()).filter(Boolean);
  }
  if (req.file) body.coverImage = req.file.cloudUrl;
  return body;
};

// @route GET /api/case-studies  (public)
const getCaseStudies = async (req, res) => {
  try {
    const items = await CaseStudy.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/case-studies/:id  (public)
const getCaseStudyById = async (req, res) => {
  try {
    const item = await CaseStudy.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Case study not found" });
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/case-studies  (admin)
const createCaseStudy = async (req, res) => {
  try {
    const item = await CaseStudy.create(prepareBody(req));
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @route PUT /api/case-studies/:id  (admin)
const updateCaseStudy = async (req, res) => {
  try {
    const item = await CaseStudy.findByIdAndUpdate(req.params.id, prepareBody(req), {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ success: false, message: "Case study not found" });
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @route DELETE /api/case-studies/:id  (admin)
const deleteCaseStudy = async (req, res) => {
  try {
    const item = await CaseStudy.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Case study not found" });
    res.status(200).json({ success: true, message: "Case study deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCaseStudies,
  getCaseStudyById,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
};