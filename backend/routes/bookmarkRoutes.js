const express = require('express');
const router = express.Router();
const {
  createBookmark,
  getBookmarks,
  getBookmarkById,
  updateBookmark,
  deleteBookmark,
} = require('../controllers/bookmarkcontroller');

router.post('/', createBookmark);
router.get('/', getBookmarks);
router.get('/:id', getBookmarkById);
router.put('/:id', updateBookmark);
router.delete('/:id', deleteBookmark);

module.exports = router;
