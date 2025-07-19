const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title:    { type: String, required: true },
    content:  { type: String },
    tags:     [String],
    favorite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ prevent OverwriteModelError on hot-reload / nodemon
module.exports = mongoose.models.Note || mongoose.model("Note", noteSchema);
