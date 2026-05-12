const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res, next) => {
  try {
    const events = await Event.find().populate('createdBy', 'name email');
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email');

    if (!event) {
      res.status(404);
      return next(new Error(`Event not found with id of ${req.params.id}`));
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin
exports.createEvent = async (req, res, next) => {
  try {
    // Add user to req.body so the event is tied to the logged-in admin
    req.body.createdBy = req.user.id;

    const event = await Event.create(req.body);

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404);
      return next(new Error(`Event not found with id of ${req.params.id}`));
    }

    // Prevent changing the creator of the event
    if (req.body.createdBy) {
      delete req.body.createdBy;
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after', // Fix Mongoose deprecation warning
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404);
      return next(new Error(`Event not found with id of ${req.params.id}`));
    }

    // Use deleteOne instead of remove() to comply with modern Mongoose versions
    await event.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
