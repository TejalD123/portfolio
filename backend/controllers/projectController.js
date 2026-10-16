const Project = require("../models/Project");

// @desc    Get all projects (supports ?field=Machine Learning filter & search)
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
  try {
    const { field, search, featured } = req.query;
    const query = {};

    if (field) query.field = field;
    if (featured) query.featured = featured === "true";
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { info: { $regex: search, $options: "i" } },
        { techStack: { $regex: search, $options: "i" } },
      ];
    }

    const projects = await Project.find(query).sort({ createdAt: -1 });

    // Display order: 1 shows first, then 2, 3 ... Projects without a number (0) come last,
    // newest first. (Array sort is stable, so equal numbers keep the newest-first order.)
    const rank = (p) => (p.order > 0 ? p.order : Number.MAX_SAFE_INTEGER);
    projects.sort((a, b) => rank(a) - rank(b));

    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single project by id
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get list of distinct project fields/categories (for filter UI)
// @route   GET /api/projects/fields/all
// @access  Public
const getProjectFields = async (req, res) => {
  try {
    const fields = await Project.distinct("field");
    res.status(200).json({ success: true, data: fields });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (admin)
const createProject = async (req, res) => {
  try {
    const body = { ...req.body };

    // techStack may come as comma separated string from form-data
    if (typeof body.techStack === "string") {
      body.techStack = body.techStack.split(",").map((t) => t.trim()).filter(Boolean);
    }

    if (typeof body.additionalTech === "string") {
      body.additionalTech = body.additionalTech.split(",").map((t) => t.trim()).filter(Boolean);
    }

    // caseStudy may come as JSON string from form-data
    if (typeof body.caseStudy === "string") {
      try {
        body.caseStudy = JSON.parse(body.caseStudy);
      } catch (e) {
        // leave as is if not valid JSON
      }
    }

    if (req.files) {
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        body.thumbnail = `/uploads/projects/${req.files.thumbnail[0].filename}`;
      }
      if (req.files.images) {
        body.images = req.files.images.map((f) => `/uploads/projects/${f.filename}`);
      }
    }

    const project = await Project.create(body);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (admin)
const updateProject = async (req, res) => {
  try {
    const body = { ...req.body };

    if (typeof body.techStack === "string") {
      body.techStack = body.techStack.split(",").map((t) => t.trim()).filter(Boolean);
    }

    if (typeof body.additionalTech === "string") {
      body.additionalTech = body.additionalTech.split(",").map((t) => t.trim()).filter(Boolean);
    }

    if (typeof body.caseStudy === "string") {
      try {
        body.caseStudy = JSON.parse(body.caseStudy);
      } catch (e) {}
    }

    if (req.files) {
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        body.thumbnail = `/uploads/projects/${req.files.thumbnail[0].filename}`;
      }
      if (req.files.images) {
        body.images = req.files.images.map((f) => `/uploads/projects/${f.filename}`);
      }
    }

    const project = await Project.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (admin)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  getProjectFields,
  createProject,
  updateProject,
  deleteProject,
};