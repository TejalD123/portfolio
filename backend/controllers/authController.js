const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc    Register admin (run once to create your own login, then disable/protect this route)
// @route   POST /api/auth/register
// @access  Public (should be restricted/removed after first use in production)
const registerAdmin = async (req, res) => {
  try {
    const { email, password, secretKey } = req.body;

    // Extra protection: registration only works if the correct secret key is sent.
    // Set ADMIN_REGISTER_SECRET in your .env to something long and random.
    if (!process.env.ADMIN_REGISTER_SECRET || secretKey !== process.env.ADMIN_REGISTER_SECRET) {
      return res.status(403).json({ success: false, message: "Invalid or missing secret key" });
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Admin already exists" });
    }

    const admin = await Admin.create({ email, password });

    res.status(201).json({
      success: true,
      data: { id: admin._id, email: admin.email },
      token: generateToken(admin._id),
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    res.status(200).json({
      success: true,
      data: { id: admin._id, email: admin.email },
      token: generateToken(admin._id),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerAdmin, loginAdmin };
