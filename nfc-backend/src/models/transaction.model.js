const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Card',
      required: true,
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ['bus_fare', 'card_recharge', 'refund'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'khalti', 'esewa', 'bank'],
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
    },
    source: {
      type: String,
    },
    destination: {
      type: String,
    },
    journeyDate: {
      type: Date,
    },
    seatNumber: {
      type: String,
    },
    failureReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
