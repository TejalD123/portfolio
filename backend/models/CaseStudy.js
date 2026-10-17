const mongoose = require("mongoose");

const caseStudySchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    category: { type: String, default: "", trim: true },
    summary: { type: String, default: "" },
    techStack: { type: [String], default: [] },
    githubLink: { type: String, default: "" },
    liveDemoLink: { type: String, default: "" },
    problemStatement: { type: String, default: "" },
    approach: { type: String, default: "" },
    dataset: { type: String, default: "" },
    results: { type: String, default: "" },
    learnings: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CaseStudy", caseStudySchema);