const express = require('express');
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public route to view events, Protected+Admin route to create events
router.route('/').get(getEvents).post(protect, admin, createEvent);

// Public route to view single event, Protected+Admin routes to edit/delete
router
  .route('/:id')
  .get(getEventById)
  .put(protect, admin, updateEvent)
  .delete(protect, admin, deleteEvent);

module.exports = router;
