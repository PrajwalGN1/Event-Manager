const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');
const Event = require('../models/Event');
const jwt = require('jsonwebtoken');

let mongoServer;
let adminToken;
let userToken;
let adminId;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_secret';

  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  const admin = await User.create({
    name: 'Admin',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin',
  });
  adminId = admin._id;
  adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);

  const user = await User.create({
    name: 'User',
    email: 'user@test.com',
    password: 'password123',
    role: 'user',
  });
  userToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Event.deleteMany();
});

describe('Event API Endpoints', () => {
  describe('GET /api/events', () => {
    it('should get all events', async () => {
      await Event.create({
        title: 'Test Event',
        description: 'Test description',
        date: new Date(),
        venue: 'Test Venue',
        price: 100,
        createdBy: adminId,
      });

      const res = await request(app).get('/api/events');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].title).toBe('Test Event');
    });
  });

  describe('POST /api/events', () => {
    it('should create an event if admin', async () => {
      const res = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'New Event',
          description: 'New desc',
          date: new Date(),
          venue: 'New Venue',
          price: 50,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('New Event');
    });

    it('should reject creation if normal user', async () => {
      const res = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'New Event',
          description: 'New desc',
          date: new Date(),
          venue: 'New Venue',
          price: 50,
        });

      expect(res.status).toBe(403);
    });
  });

  describe('PUT /api/events/:id', () => {
    it('should update event if admin', async () => {
      const event = await Event.create({
        title: 'Old Title',
        description: 'Old desc',
        date: new Date(),
        venue: 'Old Venue',
        price: 10,
        createdBy: adminId,
      });

      const res = await request(app)
        .put(`/api/events/${event._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Updated Title' });

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Updated Title');
    });
  });

  describe('DELETE /api/events/:id', () => {
    it('should delete event if admin', async () => {
      const event = await Event.create({
        title: 'To Delete',
        description: 'desc',
        date: new Date(),
        venue: 'venue',
        price: 10,
        createdBy: adminId,
      });

      const res = await request(app)
        .delete(`/api/events/${event._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);

      const check = await Event.findById(event._id);
      expect(check).toBeNull();
    });
  });
});
