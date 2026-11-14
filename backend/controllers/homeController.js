const Profile = require("../models/Profile");
const Project = require("../models/Project");
const Experience = require("../models/Experience");
const CaseStudy = require("../models/CaseStudy");

// One request that returns everything the home page needs.
// - 4 DB queries run in parallel (.lean() = plain objects, much faster than mongoose documents)
// - result is kept in memory for a short time, so repeat visits don't hit MongoDB at all
// - cache is cleared automatically after any admin write (see server.js)
const TTL_MS = 60 * 1000;

let cache = null; // { at, data }
let inflight = null; // shared promise if many visitors arrive together

// Display order: 1 shows first, then 2, 3 ... projects without a number (0) come last, newest first
const rank = (p) => (p.order > 0 ? p.order : Number.MAX_SAFE_INTEGER);

const loadHome = async () => {
  const [profileRes, projectsRes, expRes, caseRes] = await Promise.allSettled([
    Profile.findOne().lean(),
    Project.find().sort({ createdAt: -1 }).lean(),
    Experience.find().sort({ order: 1, startDate: -1, createdAt: -1 }).lean(),
    CaseStudy.find().sort({ order: 1, createdAt: -1 }).lean(),
  ]);

  // Profile and projects are required. Experience / case studies just stay empty if they fail.
  if (profileRes.status === "rejected") throw profileRes.reason;
  if (projectsRes.status === "rejected") throw projectsRes.reason;

  const projects = projectsRes.value.sort((a, b) => rank(a) - rank(b));

  return {
    profile: profileRes.value || null,
    projects,
    experiences: expRes.status === "fulfilled" ? expRes.value : [],
    caseStudies: caseRes.status === "fulfilled" ? caseRes.value : [],
  };
};

const clearHomeCache = () => {
  cache = null;
};

// @desc    Profile + projects + experience + case studies in one call
// @route   GET /api/home
// @access  Public
const getHome = async (req, res) => {
  try {
    if (cache && Date.now() - cache.at < TTL_MS) {
      return res.status(200).json({ success: true, data: cache.data });
    }

    if (!inflight) {
      inflight = loadHome().finally(() => {
        inflight = null;
      });
    }
    const data = await inflight;
    cache = { at: Date.now(), data };

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getHome, clearHomeCache };
