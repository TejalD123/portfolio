const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const { clearHomeCache } = require("./controllers/homeController");

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/+$/, "") : "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Any admin write (POST / PUT / PATCH / DELETE) clears the cached home-page data,
// so changes made in the admin panel show up on the public site right away.
app.use("/api", (req, res, next) => {
  if (req.method !== "GET" && req.method !== "OPTIONS") {
    res.on("finish", clearHomeCache);
  }
  next();
});

// Serve uploaded files (resume PDFs, project images) statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/home", require("./routes/homeRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/experience", require("./routes/experienceRoutes"));
app.use("/api/case-studies", require("./routes/caseStudyRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));

// Health check (also handy for an uptime pinger, see below)
app.get("/", (req, res) => {
  res.json({ success: true, message: "Portfolio API is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler (catches multer errors etc.)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong on the server",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
