// In services/fileUpload.js
const { put, del } = require('@vercel/blob');

const uploadToBlob = async (file) => {
  try {
    const blob = await put(
      `submissions/${Date.now()}-${file.originalname}`, 
      file.buffer, 
      {
        access: 'public',
        contentType: file.mimetype,
        token: process.env.BLOB_READ_WRITE_TOKEN
      }
    );
    return blob.url;
  } catch (error) {
    console.error('Blob Storage Upload Error:', error);
    throw error;
  }
};
