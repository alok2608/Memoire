const Note     = require("../models/Note");
const Bookmark = require("../models/Bookmark");

exports.getStats = async (_req, res) => {
  try {
    const totalNotes      = await Note.countDocuments();
    const totalBookmarks  = await Bookmark.countDocuments();
    const favoriteNotes   = await Note.countDocuments({ favorite: true });
    const favoriteBmks    = await Bookmark.countDocuments({ favorite: true });

    const noteTags       = await Note.distinct("tags");
    const bookmarkTags   = await Bookmark.distinct("tags");
    const totalTags      = new Set([...noteTags, ...bookmarkTags]).size;

    res.json({
      totalNotes,
      totalBookmarks,
      favorites: favoriteNotes + favoriteBmks,
      totalTags,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
