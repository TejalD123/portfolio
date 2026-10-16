const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: [true, "Company name is required"], trim: true },
    role: { type: String, required: [true, "Role is required"], trim: true },
    // Internship or Job
    type: {
      type: String,
      enum: ["Internship", "Job"],
      required: [true, "Type (Internship / Job) is required"],
    },
    location: { type: String, default: "", trim: true },

    // Duration — stored as "YYYY-MM" (from <input type="month">)
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    isCurrent: { type: Boolean, default: false },
    // Only used when type is "Job", e.g. "2 years"
    yearsOfExperience: { type: String, default: "" },

    // Short line shown on the portfolio card
    summary: { type: String, default: "", trim: true },
    // Longer overview shown on the detail page
    description: { type: String, default: "" },

    responsibilities: { type: [String], default: [] },
    // One entry per project worked on
    projects: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    integrations: { type: [String], default: [] },
    deployment: { type: [String], default: [] },
    outcome: { type: String, default: "" },

    companyLink: { type: String, default: "" },
    logo: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Experience", experienceSchema);