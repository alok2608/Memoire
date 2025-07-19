const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return /^https?:\/\/.+\..+/.test(value);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    tags: [String],
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError if already defined
module.exports = mongoose.models.Bookmark || mongoose.model("Bookmark", bookmarkSchema);
