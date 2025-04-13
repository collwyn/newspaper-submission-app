const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected Successfully!');
    
    // Create a simple test document
    const TestModel = mongoose.model('Test', new mongoose.Schema({
      message: String,
      timestamp: { type: Date, default: Date.now }
    }));

    const testDoc = await TestModel.create({
      message: 'Test connection successful'
    });
    console.log('Test document created:', testDoc);

    // Clean up - delete the test document and collection
    await TestModel.deleteMany({});
    console.log('Test cleanup completed');

  } catch (error) {
    console.error('MongoDB Connection Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
    process.exit(0);
  }
}

testConnection();
