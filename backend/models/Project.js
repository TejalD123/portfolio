const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    // e.g. Machine Learning, Deep Learning, NLP, Computer Vision, Data Analysis, MLOps
    field: {
      type: String,
      required: [true, "Project field/category is required"],
      trim: true,
    },
    // Short description shown on project cards
    info: {
      type: String,
      required: [true, "Project info/description is required"],
      trim: true,
    },
    // Detailed info shown on the project page. One point per line;
    // the page shows the first 4 and the rest open with "Show more".
    details: {
      type: String,
      default: "",
    },
    // Detailed write-up: problem statement, approach, results, learnings
    caseStudy: {
      problemStatement: { type: String, default: "" },
      approach: { type: String, default: "" },
      dataset: { type: String, default: "" },
      results: { type: String, default: "" },
      learnings: { type: String, default: "" },
    },
    // Quick-glance project details, separate from the long case study below.
    // All optional.
    role: { type: String, default: "" }, // e.g. "Solo developer", "Backend lead"
    keyLearning: { type: String, default: "" }, // short: main thing learned
    projectDate: { type: String, default: "" }, // free text, e.g. "March 2025"

    // Tech stack tags e.g. ["Python", "TensorFlow", "Pandas", "Scikit-learn"]
    techStack: {
      type: [String],
      default: [],
    },
    // Extra tools / services used e.g. ["Firebase", "Authentication", "Vercel"]
    additionalTech: {
      type: [String],
      default: [],
    },
    thumbnail: {
      type: String, // URL / uploaded file path
      default: "",
    },
    images: {
      type: [String],
      default: [],
    },
    githubLink: {
      type: String,
      default: "",
    },
    liveDemoLink: {
      type: String,
      default: "",
    },
    datasetLink: {
      type: String,
      default: "",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);