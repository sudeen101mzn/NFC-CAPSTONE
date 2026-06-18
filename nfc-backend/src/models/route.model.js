const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema(
  {
    routeName: {
      type: String,
      required: true,
      trim: true,
    },
    routeNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
    },
    baseFare: {
      type: Number,
      required: true,
    },
    peakHourFare: {
      type: Number,
    },
    offPeakFare: {
      type: Number,
    },
    stops: [
      {
        stopName: String,
        stopOrder: Number,
        fare: Number,
      },
    ],
    schedule: [
      {
        departure: String,
        arrival: String,
        daysOfWeek: [String],
      },
    ],
    totalSeats: {
      type: Number,
      default: 50,
    },
    bus: {
      registrationNumber: String,
      model: String,
      capacity: Number,
      amenities: [String],
    },
    operator: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    contactNumber: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Route', routeSchema);
