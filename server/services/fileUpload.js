const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { put, del } = require('@vercel/blob');

// Ensure upload directory exists
const ensureUploadDirectoryExists = () => {
  const uploadDir = path.join(os.tmpdir(), 'uploads');
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Upload directory created:', uploadDir);
  } catch (err) {
    if (err.code !== 'EEXIST') {
      console.error('Error creating upload directory:', err);
    }
  }
  return uploadDir;
};

// Memory storage for multer
const storage = multer.memoryStorage();

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
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: process.env.MAX_FILE_SIZE ? parseInt(process.env.MAX_FILE_SIZE) : 10 * 1024 * 1024 // Default 10MB
  }
});

// Helper function to upload file to Vercel Blob Storage
const uploadToBlob = async (file) => {
  try {
    // Ensure upload directory exists for local fallback
    const localUploadDir = ensureUploadDirectoryExists();

    // Create a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${uniqueSuffix}-${file.originalname}`;
    
    // Upload to Vercel Blob Storage
    const blob = await put(filename, file.buffer, {
      access: 'public',
      contentType: file.mimetype
    });
    
    return blob.url;
  } catch (error) {
    console.error('Error uploading to Blob Storage:', error);
    
    // Fallback to local storage if Blob upload fails
    try {
      const uploadDir = ensureUploadDirectoryExists();
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, file.buffer);
      return `/uploads/${filename}`;
    } catch (localError) {
      console.error('Error uploading to local storage:', localError);
      throw error;
    }
  }
};

// Helper function to delete file from storage
const deleteFile = async (url) => {
  try {
    // Try to delete from Vercel Blob Storage first
    await del(url);
    return true;
  } catch (blobError) {
    console.warn('Failed to delete from Blob Storage:', blobError);
    
    // Fallback to local file deletion
    try {
      if (!url.startsWith('/uploads/')) return false;
      
      const filename = path.basename(url);
      const uploadDir = path.join(os.tmpdir(), 'uploads');
      const filePath = path.join(uploadDir, filename);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (localError) {
      console.error('Error deleting local file:', localError);
      return false;
    }
  }
};

module.exports = {
  upload,
  deleteFile,
  uploadToBlob
};
