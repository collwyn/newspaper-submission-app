const multer = require('multer');
const { put, del } = require('@vercel/blob');
const memory = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, JPEG, and PNG files are allowed.'), false);
  }
};

// Create multer instance with configuration
const upload = multer({
  storage: memory,
  fileFilter: fileFilter,
  limits: {
    fileSize: process.env.MAX_FILE_SIZE || 10 * 1024 * 1024 // Default 10MB
  }
});

// Helper function to upload file to local storage (temporary solution)
const uploadToBlob = async (file) => {
  try {
    // Create a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${uniqueSuffix}-${file.originalname}`;
    
    // Save to local directory
    const fs = require('fs');
    const path = require('path');
    const uploadDir = process.env.UPLOAD_DIR || 'uploads';
    const uploadPath = path.join(__dirname, '..', uploadDir);
    
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    // Write file
    const filePath = path.join(uploadPath, filename);
    fs.writeFileSync(filePath, file.buffer);
    
    // Return path that can be accessed via URL
    return `/uploads/${filename}`;
  } catch (error) {
    console.error('Error uploading to local storage:', error);
    throw error;
  }
};

// Helper function to upload file to Vercel Blob Storage
//const uploadToBlob = async (file) => {
 // try {
//    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
 //   const filename = `${uniqueSuffix}-${file.originalname}`;
    
 //   const blob = await put(filename, file.buffer, {
 //     access: 'public',
 //     contentType: file.mimetype
//    });
    
//    return blob.url;
//  } catch (error) {
 //   console.error('Error uploading to Blob Storage:', error);
 //   throw error;
//  }
//};

// Helper function to delete file from Vercel Blob Storage
//const deleteFile = async (url) => {
//  try {
//    await del(url);
//    return true;
//  } catch (error) {
//    console.error('Error deleting from Blob Storage:', error);
//    return false;
//  }
//};

// Helper function to delete file from local storage
const deleteFile = async (url) => {
  try {
    if (!url || !url.startsWith('/uploads/')) {
      return false;
    }
    
    const fs = require('fs');
    const path = require('path');
    const uploadDir = process.env.UPLOAD_DIR || 'uploads';
    const filename = url.split('/').pop();
    const filePath = path.join(__dirname, '..', uploadDir, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting from local storage:', error);
    return false;
  }
};

module.exports = {
  upload,
  deleteFile,
  uploadToBlob
};
