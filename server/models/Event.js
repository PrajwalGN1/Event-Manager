const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add an event title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Please add an event date'],
    },
    venue: {
      type: String,
      required: [true, 'Please add a venue location'],
    },
    image: {
      type: String,
      default: 'no-photo.jpg',
    },
    price: {
      type: Number,
      required: [true, 'Please add a price for the event (0 for free)'],
      min: [0, 'Price cannot be negative'],
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', eventSchema);
