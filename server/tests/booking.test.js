const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');

let mongoServer;
let adminToken;
let userToken;
let adminId;
let eventId;

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

  const event = await Event.create({
    title: 'Test Event',
    description: 'Desc',
    date: new Date(),
    venue: 'Venue',
    price: 50,
    createdBy: adminId,
  });
  eventId = event._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Booking.deleteMany();
});

describe('Booking API Endpoints', () => {
  describe('POST /api/bookings', () => {
    it('should create a booking for logged in user', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ eventId });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.event.title).toBe('Test Event');
    });

    it('should reject booking if eventId is missing', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it('should reject duplicate booking for the same event', async () => {
      await Booking.create({ user: jwt.verify(userToken, 'test_secret').id, event: eventId });

      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ eventId });

      expect(res.status).toBe(400); // Because of unique index
    });
  });

  describe('GET /api/bookings/user', () => {
    it('should get bookings for logged in user', async () => {
      await Booking.create({ user: jwt.verify(userToken, 'test_secret').id, event: eventId });

      const res = await request(app)
        .get('/api/bookings/user')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });
  });
});
