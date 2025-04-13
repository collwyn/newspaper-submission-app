const Article = require('../models/Article');
const { validationResult } = require('express-validator');
const path = require('path');

// Get all articles (with pagination and filters)
exports.getArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    let query = {};

    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by user if not admin/editor
    if (req.user.role === 'user') {
      query.submittedBy = req.user._id;
    }

    const articles = await Article.find(query)
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('submittedBy', 'username email');

    const total = await Article.countDocuments(query);

    res.json({
      success: true,
      count: articles.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: articles
    });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching articles'
    });
  }
};

// Get single article
exports.getArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('submittedBy', 'username email');

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Check if user has permission to view
    if (req.user.role === 'user' && article.submittedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this article'
      });
    }

    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching article'
    });
  }
};

const { getFileUrl, deleteFile } = require('../services/fileUpload');

// Create new article
exports.createArticle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an article file'
      });
    }

    // Create article with file information
    const articleData = {
      ...req.body,
      submittedBy: req.user._id,
      fileUrl: getFileUrl(req, req.file.filename),
      fileType: req.file.mimetype.split('/')[1]
    };

    const article = await Article.create(articleData);

    res.status(201).json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating article'
    });
  }
};

// Update article status (editor/admin only)
exports.updateArticleStatus = async (req, res) => {
  try {
    const { status, feedback } = req.body;

    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    article.status = status;
    if (feedback) {
      article.feedback = feedback;
    }

    await article.save();

    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('Update article status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating article status'
    });
  }
};

// Delete article
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Check if user has permission to delete
    if (req.user.role === 'user' && article.submittedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this article'
      });
    }

    // Extract filename from fileUrl
    const filename = article.fileUrl.split('/').pop();
    const uploadDir = process.env.UPLOAD_DIR || 'uploads';
    const filePath = path.join(__dirname, '..', uploadDir, filename);

    // Delete the file
    await deleteFile(filePath);

    // Remove the article from database
    await article.deleteOne();

    res.json({
      success: true,
      message: 'Article and associated file deleted successfully'
    });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting article'
    });
  }
};
