const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Files are kept in memory and sent straight to Cloudinary (Render's disk is temporary).
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "resume") {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Resume must be a PDF file"), false);
    }
  } else {
    const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (jpg, jpeg, png, webp) are allowed"), false);
    }
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

const sendToCloudinary = (file) =>
  new Promise((resolve, reject) => {
    const isResume = file.fieldname === "resume";
    const safeName = file.originalname.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]+/g, "_");
    const options = isResume
      ? { folder: "portfolio/resume", resource_type: "raw", public_id: `${Date.now()}-${safeName}.pdf` }
      : { folder: "portfolio/images", resource_type: "image", public_id: `${Date.now()}-${safeName}` };

    cloudinary.uploader
      .upload_stream(options, (err, result) => (err ? reject(err) : resolve(result)))
      .end(file.buffer);
  });

// Runs after multer: uploads every received file and stores its URL on file.cloudUrl
const toCloudinary = async (req, res, next) => {
  try {
    const files = req.file
      ? [req.file]
      : Array.isArray(req.files)
      ? req.files
      : Object.values(req.files || {}).flat();

    await Promise.all(
      files.map(async (f) => {
        const result = await sendToCloudinary(f);
        f.cloudUrl = result.secure_url;
      })
    );
    next();
  } catch (err) {
    // Cloudinary errors are plain objects (no stack), so wrap them to get a clear message in the logs
    console.error("Cloudinary upload failed:", err?.message || err);
    next(new Error(`Cloudinary: ${err?.message || "upload failed"}`));
  }
};

// Same API as before (upload.fields / upload.single), so the route files stay unchanged.
module.exports = {
  fields: (...args) => [upload.fields(...args), toCloudinary],
  single: (...args) => [upload.single(...args), toCloudinary],
};