// server.js
const express  = require("express");
const mongoose = require("mongoose");
const dotenv   = require("dotenv");
const cors     = require("cors");

// route files
const noteRoutes     = require("./routes/noteRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const statsRoutes    = require("./routes/statsRoutes");   // NEW

dotenv.config();

const app = express();

// ────── middleware ──────
app.use(cors());
app.use(express.json());

// ────── routes ──────────
app.use("/api/notes",     noteRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/stats",     statsRoutes);   // NEW  → GET /api/stats returns dashboard counts

// ────── connect DB & start server ──────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
