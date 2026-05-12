const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: mongoose.Schema.ObjectId,
      ref: 'Event',
      required: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed', // Assuming free or mock payment for this scope
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from booking the same event twice
bookingSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
