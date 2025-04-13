const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const users = [
  {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    username: 'editor',
    email: 'editor@example.com',
    password: 'password123',
    role: 'editor'
  },
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users...');

    // Hash passwords and create users
    const hashedUsers = await Promise.all(users.map(async (user) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      return {
        ...user,
        password: hashedPassword
      };
    }));

    // Insert users
    await User.insertMany(hashedUsers);
    console.log('Test users created successfully!');
    console.log('\nTest Accounts:');
    users.forEach(user => {
      console.log(`\nRole: ${user.role}`);
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
    });

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
  }
}

seedDatabase();
