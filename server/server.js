const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/database');
const fs = require('fs');
const os = require('os');

// Load environment variables
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ['https://newspaper-submission-app.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(morgan('dev')); // logging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Determine upload directory
const uploadDir = path.join(os.tmpdir(), 'uploads');

// Ensure uploads directory exists
try {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Upload directory created:', uploadDir);
} catch (err) {
  console.error('Error creating uploads directory:', err);
}

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadDir));

// Root route for health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Newspaper Submission Backend is running',
    environment: process.env.NODE_ENV
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    environment: process.env.NODE_ENV
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle multer errors
  if (err instanceof require('multer').MulterError) {
    return res.status(400).json({
      error: 'File upload error',
      message: err.message
    });
  }

  res.status(err.status || 500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Export app for testing
module.exports = app;

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    // Close server & exit process gracefully
    server.close(() => {
      console.log('Server closed due to unhandled promise rejection');
      process.exit(1);
    });
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Close server & exit process gracefully
    server.close(() => {
      console.log('Server closed due to uncaught exception');
      process.exit(1);
    });
  });
}
