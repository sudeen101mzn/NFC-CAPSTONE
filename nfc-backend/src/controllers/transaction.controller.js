const Transaction = require('../models/transaction.model');
const { successResponse, errorResponse } = require('../utils/response');

const transactionController = {
  // Get all transactions for user
  getTransactions: async (req, res, next) => {
    try {
      const { type, status, startDate, endDate, limit = 20, page = 1 } = req.query;
      const skip = (page - 1) * limit;

      const filter = { userId: req.user.id };

      if (type) filter.type = type;
      if (status) filter.status = status;

      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
      }

      const transactions = await Transaction.find(filter)
        .populate('cardId', 'cardNumber cardType balance')
        .populate('routeId', 'routeName source destination')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Transaction.countDocuments(filter);

      return successResponse({
        res,
        message: 'Transactions fetched successfully',
        data: {
          transactions,
          pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Get recent transactions
  getRecentTransactions: async (req, res, next) => {
    try {
      const { limit = 10 } = req.query;

      const transactions = await Transaction.find({ userId: req.user.id })
        .populate('cardId', 'cardNumber cardType')
        .populate('routeId', 'routeName source destination')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));

      return successResponse({
        res,
        message: 'Recent transactions fetched successfully',
        data: transactions,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get transaction details
  getTransactionById: async (req, res, next) => {
    try {
      const { transactionId } = req.params;

      const transaction = await Transaction.findById(transactionId)
        .populate('userId', 'name email mobileNumber')
        .populate('cardId')
        .populate('routeId');

      if (!transaction || transaction.userId._id.toString() !== req.user.id) {
        return errorResponse({
          res,
          message: 'Transaction not found',
          statusCode: 404,
        });
      }

      return successResponse({
        res,
        message: 'Transaction fetched successfully',
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  },

  // Create transaction (for bus fare)
  createTransaction: async (req, res, next) => {
    try {
      const {
        cardId,
        routeId,
        amount,
        paymentMethod,
        source,
        destination,
        journeyDate,
        seatNumber,
      } = req.body;

      const transactionId = `TXN-${Date.now()}`;

      const transaction = await Transaction.create({
        userId: req.user.id,
        cardId,
        routeId,
        amount,
        type: 'bus_fare',
        paymentMethod,
        transactionId,
        source,
        destination,
        journeyDate,
        seatNumber,
        status: 'completed',
      });

      return successResponse({
        res,
        message: 'Transaction created successfully',
        data: transaction,
        statusCode: 201,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get monthly summary
  getMonthlyTransactionSummary: async (req, res, next) => {
    try {
      const { month, year } = req.query;

      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      const summary = await Transaction.aggregate([
        {
          $match: {
            userId: req.user.id,
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: '$type',
            total: { $sum: '$amount' },
            count: { $sum: 1 },
            avgAmount: { $avg: '$amount' },
          },
        },
      ]);

      const totalAmount = summary.reduce((sum, item) => sum + item.total, 0);

      return successResponse({
        res,
        message: 'Monthly summary fetched successfully',
        data: {
          month,
          year,
          totalAmount,
          byType: summary,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = transactionController;
