const fs = require("fs");
const path = require("path");
const Profile = require("../models/Profile");

const uploadsDir = path.join(__dirname, "..", "uploads");

// Deletes an uploaded file (e.g. "/uploads/projects/123-me.jpg") from disk. Never throws.
const removeUploadedFile = (publicPath) => {
  if (!publicPath || !publicPath.startsWith("/uploads/")) return;
  const file = path.join(uploadsDir, publicPath.replace(/^\/uploads\//, ""));
  // only ever delete files inside the uploads folder
  if (!file.startsWith(uploadsDir + path.sep)) return;
  fs.unlink(file, () => {});
};

// Multipart form fields always arrive as strings. This turns JSON strings back
// into real values and leaves everything else as it was.
const parseJSON = (value, fallback) => {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch (e) {
    return fallback;
  }
};

// Accepts a real array, a JSON array string ('["a","b"]') or a comma separated string ("a, b").
// Fixes the old bug where a JSON string was split on commas and kept the [ and " characters.
const toStringList = (value) => {
  let list = value;
  if (typeof list === "string") {
    const parsed = parseJSON(list, null);
    list = Array.isArray(parsed) ? parsed : list.split(",");
  }
  if (!Array.isArray(list)) return [];
  return list.map((s) => String(s).trim()).filter(Boolean);
};

const cleanSkillGroups = (value) => {
  const groups = parseJSON(value, []);
  if (!Array.isArray(groups)) return [];
  return groups
    .map((g) => ({
      title: String(g?.title || "").trim(),
      items: toStringList(g?.items),
    }))
    .filter((g) => g.title && g.items.length > 0);
};

const cleanAboutStats = (value) => {
  const stats = parseJSON(value, []);
  if (!Array.isArray(stats)) return [];
  return stats
    .map((s) => ({
      value: String(s?.value || "").trim(),
      label: String(s?.label || "").trim(),
    }))
    .filter((s) => s.value && s.label)
    .slice(0, 3);
};

// Builds the object that is saved, from req.body + uploaded files
const buildBody = (req) => {
  const body = { ...req.body };

  if (body.skills !== undefined) body.skills = toStringList(body.skills);
  if (body.skillGroups !== undefined) body.skillGroups = cleanSkillGroups(body.skillGroups);
  if (body.aboutStats !== undefined) body.aboutStats = cleanAboutStats(body.aboutStats);

  if (typeof body.socialLinks === "string") {
    body.socialLinks = parseJSON(body.socialLinks, undefined);
    if (body.socialLinks === undefined) delete body.socialLinks;
  }
  if (typeof body.education === "string") {
    body.education = parseJSON(body.education, undefined);
    if (body.education === undefined) delete body.education;
  }
  if (typeof body.experience === "string") {
    body.experience = parseJSON(body.experience, undefined);
    if (body.experience === undefined) delete body.experience;
  }

  if (req.files?.resume?.[0]) {
    body.resumeUrl = req.files.resume[0].cloudUrl;
  }
  if (req.files?.profileImage?.[0]) {
    body.profileImage = req.files.profileImage[0].cloudUrl;
  } else if (body.removeProfileImage === "true" || body.removeProfileImage === true) {
    // "Remove photo" was clicked and no new photo was chosen
    body.profileImage = "";
  }
  delete body.removeProfileImage;

  return body;
};

// @desc    Get profile info (there will typically be only ONE profile document)
// @route   GET /api/profile
// @access  Public
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not set up yet" });
    }
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create profile (only if none exists)
// @route   POST /api/profile
// @access  Private (admin)
const createProfile = async (req, res) => {
  try {
    const existing = await Profile.findOne();
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists. Use update instead.",
      });
    }

    const profile = await Profile.create(buildBody(req));
    res.status(201).json({ success: true, data: profile });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update profile (creates one if none exists - upsert)
// @route   PUT /api/profile
// @access  Private (admin)
const updateProfile = async (req, res) => {
  try {
    const body = buildBody(req);

    let profile = await Profile.findOne();

    if (!profile) {
      profile = await Profile.create(body);
      return res.status(201).json({ success: true, data: profile });
    }

    const oldImage = profile.profileImage;

    profile = await Profile.findByIdAndUpdate(profile._id, body, {
      new: true,
      runValidators: true,
    });

    // Photo removed -> also delete the old file from the server
    if (body.profileImage === "" && oldImage) removeUploadedFile(oldImage);

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Download / get resume file path
// @route   GET /api/profile/resume
// @access  Public
const getResume = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile || !profile.resumeUrl) {
      return res.status(404).json({ success: false, message: "Resume not uploaded yet" });
    }
    res.status(200).json({ success: true, resumeUrl: profile.resumeUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, createProfile, updateProfile, getResume };