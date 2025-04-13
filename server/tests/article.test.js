const request = require('supertest');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Article = require('../models/Article');
const connectDB = require('../config/database');

let userToken;
let editorToken;
let testUser;
let testEditor;

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.disconnect();
});

beforeEach(async () => {
  // Clean up before each test
  await User.deleteMany({});
  await Article.deleteMany({});
  
  // Create test users
  testUser = await User.create({
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'password123'
  });

  testEditor = await User.create({
    username: 'testeditor',
    email: 'editor@example.com',
    password: 'password123',
    role: 'editor'
  });

  // Get tokens
  const userResponse = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'testuser@example.com',
      password: 'password123'
    });
  userToken = userResponse.body.token;

  const editorResponse = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'editor@example.com',
      password: 'password123'
    });
  editorToken = editorResponse.body.token;
});

describe('Article Endpoints', () => {
  describe('POST /api/articles', () => {
    it('should create a new article with file upload', async () => {
      // Create a test file
      const testFilePath = path.join(__dirname, 'test.pdf');
      fs.writeFileSync(testFilePath, 'Test PDF content');

      const res = await request(app)
        .post('/api/articles')
        .set('Authorization', `Bearer ${userToken}`)
        .field('title', 'Test Article')
        .field('author', 'Test Author')
        .field('description', 'This is a test article')
        .attach('file', testFilePath);

      expect(res.statusCode).toBe(201);
      expect(res.body.data).toHaveProperty('title', 'Test Article');
      expect(res.body.data).toHaveProperty('fileUrl');
      expect(res.body.data.status).toBe('pending');

      // Clean up test file
      fs.unlinkSync(testFilePath);
    });

    it('should not create article without file', async () => {
      const res = await request(app)
        .post('/api/articles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Test Article',
          description: 'This is a test article'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/articles', () => {
    beforeEach(async () => {
      // Create test articles
      await Article.create({
        title: 'Test Article 1',
        author: 'Test Author 1',
        description: 'Description 1',
        submittedBy: testUser._id,
        fileUrl: 'http://example.com/test1.pdf',
        fileType: 'pdf',
        status: 'pending'
      });

      await Article.create({
        title: 'Test Article 2',
        author: 'Test Author 2',
        description: 'Description 2',
        submittedBy: testUser._id,
        fileUrl: 'http://example.com/test2.pdf',
        fileType: 'pdf',
        status: 'approved'
      });
    });

    it('should get all articles for editor', async () => {
      const res = await request(app)
        .get('/api/articles')
        .set('Authorization', `Bearer ${editorToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(2);
    });

    it('should only get user\'s own articles', async () => {
      const res = await request(app)
        .get('/api/articles')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0].submittedBy._id).toBe(testUser._id.toString());
    });
  });

  describe('PUT /api/articles/:id', () => {
    let articleId;

    beforeEach(async () => {
      const article = await Article.create({
        title: 'Test Article',
        author: 'Test Author',
        description: 'Description',
        submittedBy: testUser._id,
        fileUrl: 'http://example.com/test.pdf',
        fileType: 'pdf',
        status: 'pending'
      });
      articleId = article._id;
    });

    it('should update article status (editor only)', async () => {
      const res = await request(app)
        .put(`/api/articles/${articleId}`)
        .set('Authorization', `Bearer ${editorToken}`)
        .send({
          status: 'approved',
          feedback: 'Good article'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('approved');
      expect(res.body.data.feedback).toBe('Good article');
    });

    it('should not allow status update by regular user', async () => {
      const res = await request(app)
        .put(`/api/articles/${articleId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          status: 'approved'
        });

      expect(res.statusCode).toBe(403);
    });
  });
});
