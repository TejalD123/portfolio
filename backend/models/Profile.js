const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, default: "Data Scientist" }, // e.g. "Aspiring Data Scientist | ML Enthusiast"

    // Legacy single bio. No longer edited from the admin; kept so old data is not lost.
    bio: { type: String, default: "" },

    // Hero banner: short 1-2 line intro shown next to the name
    heroBio: { type: String, default: "" },

    // About section: headline + longer text (new line = new paragraph) + up to 3 stats
    aboutHeadline: { type: String, default: "" },
    aboutBio: { type: String, default: "" },
    aboutStats: {
      type: [
        {
          value: { type: String, default: "" }, // e.g. "10+"
          label: { type: String, default: "" }, // e.g. "Projects built"
          _id: false,
        },
      ],
      default: [],
    },

    email: { type: String, required: true },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },

    resumeUrl: { type: String, default: "" }, // path/url to uploaded resume PDF
    profileImage: { type: String, default: "" },

    // Legacy flat skills list. Tech stack now uses skillGroups below.
    skills: { type: [String], default: [] },

    // Tech stack categories, e.g. { title: "Frontend", items: ["React", "Tailwind"] }
    skillGroups: {
      type: [
        {
          title: { type: String, default: "" },
          items: { type: [String], default: [] },
          _id: false,
        },
      ],
      default: [],
    },

    education: [
      {
        degree: String,
        institution: String,
        year: String,
      },
    ],

    experience: [
      {
        role: String,
        company: String,
        duration: String,
        description: String,
      },
    ],

    socialLinks: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      kaggle: { type: String, default: "" },
      twitter: { type: String, default: "" },
      portfolio: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);