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

// Helper function to upload file to Vercel Blob Storage
const uploadToBlob = async (file) => {
  try {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${uniqueSuffix}-${file.originalname}`;
    
    const blob = await put(filename, file.buffer, {
      access: 'public',
      contentType: file.mimetype
    });
    
    return blob.url;
  } catch (error) {
    console.error('Error uploading to Blob Storage:', error);
    throw error;
  }
};

// Helper function to delete file from Vercel Blob Storage
const deleteFile = async (url) => {
  try {
    await del(url);
    return true;
  } catch (error) {
    console.error('Error deleting from Blob Storage:', error);
    return false;
  }
};

module.exports = {
  upload,
  deleteFile,
  uploadToBlob
};
