const express = require('express');
const router = express.Router();
const {
  getArticles,
  getArticle,
  createArticle,
  updateArticleStatus,
  deleteArticle
} = require('../controllers/articleController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../services/fileUpload');

// Routes
router.route('/')
  .get(protect, getArticles)
  .post(
    protect,
    upload.single('file'),
    createArticle
  );

// Admin/Editor routes
router.route('/pending')
  .get(
    protect,
    authorize('editor', 'admin'),
    async (req, res, next) => {
      req.query.status = 'pending';
      next();
    },
    getArticles
  );

router.route('/:id')
  .get(protect, getArticle)
  .put(
    protect,
    authorize('editor', 'admin'),
    updateArticleStatus
  )
  .delete(protect, deleteArticle);

module.exports = router;
