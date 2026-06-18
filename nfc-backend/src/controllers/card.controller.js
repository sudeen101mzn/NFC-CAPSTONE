const Card = require('../models/card.model');
const { successResponse, errorResponse } = require('../utils/response');

const cardController = {
  // Get all cards for user
  getUserCards: async (req, res, next) => {
    try {
      const cards = await Card.find({ userId: req.user.id, isActive: true });
      return successResponse({
        res,
        message: 'Cards fetched successfully',
        data: cards,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get single card
  getCardById: async (req, res, next) => {
    try {
      const { cardId } = req.params;
      const card = await Card.findById(cardId);

      if (!card || card.userId.toString() !== req.user.id) {
        return errorResponse({
          res,
          message: 'Card not found',
          statusCode: 404,
        });
      }

      return successResponse({
        res,
        message: 'Card fetched successfully',
        data: card,
      });
    } catch (error) {
      next(error);
    }
  },

  // Add new card
  addCard: async (req, res, next) => {
    try {
      const { cardNumber, cardHolderName, expiryMonth, expiryYear, cvv, cardType } = req.body;

      const card = await Card.create({
        userId: req.user.id,
        cardNumber,
        cardHolderName,
        expiryMonth,
        expiryYear,
        cvv,
        cardType,
      });

      return successResponse({
        res,
        message: 'Card added successfully',
        data: card,
        statusCode: 201,
      });
    } catch (error) {
      next(error);
    }
  },

  // Update card
  updateCard: async (req, res, next) => {
    try {
      const { cardId } = req.params;
      const card = await Card.findById(cardId);

      if (!card || card.userId.toString() !== req.user.id) {
        return errorResponse({
          res,
          message: 'Card not found',
          statusCode: 404,
        });
      }

      Object.assign(card, req.body);
      await card.save();

      return successResponse({
        res,
        message: 'Card updated successfully',
        data: card,
      });
    } catch (error) {
      next(error);
    }
  },

  // Block card
  blockCard: async (req, res, next) => {
    try {
      const { cardId } = req.params;
      const card = await Card.findByIdAndUpdate(
        cardId,
        { isBlocked: true },
        { new: true }
      );

      if (!card) {
        return errorResponse({
          res,
          message: 'Card not found',
          statusCode: 404,
        });
      }

      return successResponse({
        res,
        message: 'Card blocked successfully',
        data: card,
      });
    } catch (error) {
      next(error);
    }
  },

  // Unblock card
  unblockCard: async (req, res, next) => {
    try {
      const { cardId } = req.params;
      const card = await Card.findByIdAndUpdate(
        cardId,
        { isBlocked: false },
        { new: true }
      );

      if (!card) {
        return errorResponse({
          res,
          message: 'Card not found',
          statusCode: 404,
        });
      }

      return successResponse({
        res,
        message: 'Card unblocked successfully',
        data: card,
      });
    } catch (error) {
      next(error);
    }
  },

  // Set default card
  setDefaultCard: async (req, res, next) => {
    try {
      const { cardId } = req.params;

      // Remove default from all other cards
      await Card.updateMany({ userId: req.user.id }, { isDefault: false });

      // Set this card as default
      const card = await Card.findByIdAndUpdate(
        cardId,
        { isDefault: true },
        { new: true }
      );

      if (!card) {
        return errorResponse({
          res,
          message: 'Card not found',
          statusCode: 404,
        });
      }

      return successResponse({
        res,
        message: 'Default card set successfully',
        data: card,
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete card
  deleteCard: async (req, res, next) => {
    try {
      const { cardId } = req.params;
      const card = await Card.findByIdAndUpdate(
        cardId,
        { isActive: false },
        { new: true }
      );

      if (!card) {
        return errorResponse({
          res,
          message: 'Card not found',
          statusCode: 404,
        });
      }

      return successResponse({
        res,
        message: 'Card deleted successfully',
        data: card,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = cardController;
