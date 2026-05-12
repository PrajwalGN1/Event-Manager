const Booking = require('../models/Booking');
const Event = require('../models/Event');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Logged in users)
exports.createBooking = async (req, res, next) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      res.status(400);
      return next(new Error('Please provide an eventId'));
    }

    // Check if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404);
      return next(new Error('Event not found'));
    }

    // Create the booking (unique compound index in Booking model prevents duplicates)
    const booking = await Booking.create({
      user: req.user.id,
      event: eventId,
    });

    // Populate the event details before sending response
    await booking.populate('event', 'title date venue price');

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/user
// @access  Private
exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate(
      'event',
      'title date venue image price'
    );

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('event', 'title date venue');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};
