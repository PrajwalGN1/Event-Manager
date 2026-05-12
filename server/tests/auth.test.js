const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
  // Prevent config/db.js from running
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_secret';

  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany(); // Clear users after each test
});

describe('Authentication API Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should successfully register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.name).toBe('Test User');
    });

    it('should return 400 Bad Request for duplicate email', async () => {
      await User.create({
        name: 'Existing User',
        email: 'test@example.com',
        password: 'password123',
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User 2',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('User already exists');
    });

    it('should return 400 Bad Request for invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'password123',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Please add a valid email');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should successfully login an existing user', async () => {
      // First register
      await request(app).post('/api/auth/register').send({
        name: 'Login User',
        email: 'login@example.com',
        password: 'password123',
      });

      // Then login
      const response = await request(app).post('/api/auth/login').send({
        email: 'login@example.com',
        password: 'password123',
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
    });

    it('should return 401 Unauthorized for incorrect password', async () => {
      // First register
      await request(app).post('/api/auth/register').send({
        name: 'Login User',
        email: 'login2@example.com',
        password: 'password123',
      });

      // Then login with wrong password
      const response = await request(app).post('/api/auth/login').send({
        email: 'login2@example.com',
        password: 'wrongpassword',
      });

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });
});
