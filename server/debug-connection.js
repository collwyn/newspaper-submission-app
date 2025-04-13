const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    const uri = process.env.MONGODB_URI;
    console.log('Attempting to connect with URI:', uri);
    console.log('URI length:', uri.length);
    console.log('URI components:');
    console.log('- Protocol:', uri.split('://')[0]);
    console.log('- Username:', uri.split('://')[1].split(':')[0]);
    console.log('- Host:', uri.split('@')[1].split('/?')[0]);
    
    await mongoose.connect(uri);
    console.log('MongoDB Connected Successfully!');
    
    const TestModel = mongoose.model('Test', new mongoose.Schema({
      message: String,
      timestamp: { type: Date, default: Date.now }
    }));

    const testDoc = await TestModel.create({
      message: 'Test connection successful'
    });
    console.log('Test document created:', testDoc);

  } catch (error) {
    console.error('MongoDB Connection Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
    process.exit(0);
  }
}

testConnection();
