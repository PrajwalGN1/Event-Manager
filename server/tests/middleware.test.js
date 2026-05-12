const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

const app = express();
app.use(express.json());

// Global Error Handler for the test app
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ message: err.message });
});

app.get('/api/protected', protect, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

app.get('/api/admin', protect, admin, (req, res) => {
  res.status(200).json({ success: true, adminAccess: true });
});

let mongoServer;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test_secret';
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Auth Middleware', () => {
  let token;
  let adminToken;
  let userId;

  beforeAll(async () => {
    const user = await User.create({
      name: 'Normal User',
      email: 'user@test.com',
      password: 'password',
      role: 'user',
    });
    userId = user._id;
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'password',
      role: 'admin',
    });
    adminToken = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    await User.deleteMany();
  });

  describe('protect middleware', () => {
    it('should reject without token', async () => {
      const res = await request(app).get('/api/protected');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Not authorized, no token provided');
    });

    it('should reject with invalid token', async () => {
      const res = await request(app)
        .get('/api/protected')
        .set('Authorization', 'Bearer invalidtoken');
      expect(res.status).toBe(401);
      expect(res.body.message).toContain('Not authorized, token failed');
    });

    it('should allow access with valid token', async () => {
      const res = await request(app)
        .get('/api/protected')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe('user@test.com');
    });
  });

  describe('admin middleware', () => {
    it('should reject normal user from admin route', async () => {
      const res = await request(app)
        .get('/api/admin')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Not authorized as an admin');
    });

    it('should allow admin user to admin route', async () => {
      const res = await request(app)
        .get('/api/admin')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
