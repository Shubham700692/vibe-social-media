require("dotenv").config();
console.log("Cloudinary name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("Cloudinary key:", process.env.CLOUDINARY_API_KEY);
const express = require("express");
const cors    = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

const app = express();


connectDB();

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );
  next();
});


const allowedOrigins = [
  "http://localhost:3000",
  "https://vibe-social-media-nrv9.vercel.app/", 
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth",  authRoutes);
app.use("/api/posts", postRoutes);


app.get("/health", (req, res) => res.json({ status: "ok" }));


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Internal server error" });
});

app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));