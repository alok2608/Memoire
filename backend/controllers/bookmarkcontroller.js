const Bookmark = require('../models/Bookmark');
const fetchTitle = require('../utils/fetchTitle');
const validator = require('validator');

exports.createBookmark = async (req, res) => {
  try {
    const { url, title, description, tags } = req.body;

    if (!url || !validator.isURL(url)) {
      return res.status(400).json({ error: 'Valid URL is required' });
    }

    const bookmarkTitle = title || await fetchTitle(url);

    const bookmark = await Bookmark.create({
      url,
      title: bookmarkTitle,
      description,
      tags,
    });

    res.status(201).json(bookmark);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookmarks = async (req, res) => {
  try {
    const { q, tags } = req.query;
    let filter = {};

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { url: { $regex: q, $options: 'i' } },
      ];
    }

    if (tags) {
      filter.tags = { $in: tags.split(',') };
    }

    const bookmarks = await Bookmark.find(filter).sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookmarkById = async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });
    res.json(bookmark);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });
    res.json(bookmark);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findByIdAndDelete(req.params.id);
    if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });
    res.json({ message: 'Bookmark deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
