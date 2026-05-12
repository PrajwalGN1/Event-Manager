const express = require('express');
const {
  createBooking,
  getUserBookings,
  getAllBookings,
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// All booking routes require the user to be logged in
router.use(protect);

router
  .route('/')
  .post(createBooking)                 // Normal user creates a booking
  .get(admin, getAllBookings);         // Admin views all bookings system-wide

router.route('/user').get(getUserBookings); // Normal user views their own bookings

module.exports = router;
