const User = require('../models/user.model');
const { successResponse, errorResponse } = require('../utils/response');

const userController = {
  // Get user profile
  getProfile: async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return errorResponse({
          res,
          message: 'User not found',
          statusCode: 404,
        });
      }

      return successResponse({
        res,
        message: 'Profile fetched successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  // Update profile
  updateProfile: async (req, res, next) => {
    try {
      const { name, email, mobileNumber } = req.body;

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { name, email, mobileNumber },
        { new: true, runValidators: true }
      );

      if (!user) {
        return errorResponse({
          res,
          message: 'User not found',
          statusCode: 404,
        });
      }

      return successResponse({
        res,
        message: 'Profile updated successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  // Change password
  changePassword: async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;

      const user = await User.findById(req.user.id).select('+password');

      if (!user) {
        return errorResponse({
          res,
          message: 'User not found',
          statusCode: 404,
        });
      }

      const isMatch = await user.matchPassword(oldPassword);
      if (!isMatch) {
        return errorResponse({
          res,
          message: 'Old password is incorrect',
          statusCode: 401,
        });
      }

      user.password = newPassword;
      await user.save();

      return successResponse({
        res,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  // Get wallet balance (placeholder)
  getWalletBalance: async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select('_id name');

      // TODO: Implement wallet logic based on Card model
      const walletBalance = 0;

      return successResponse({
        res,
        message: 'Wallet balance fetched successfully',
        data: {
          userId: user._id,
          userName: user.name,
          walletBalance,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Update notification preferences (placeholder)
  getNotificationPreferences: async (req, res, next) => {
    try {
      return successResponse({
        res,
        message: 'Notification preferences fetched',
        data: {
          emailNotifications: true,
          smsNotifications: true,
          pushNotifications: true,
          promotionalEmails: false,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Update notification preferences
  updateNotificationPreferences: async (req, res, next) => {
    try {
      // TODO: Store preferences in User model or separate collection
      return successResponse({
        res,
        message: 'Notification preferences updated successfully',
        data: req.body,
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete account
  deleteAccount: async (req, res, next) => {
    try {
      const { password } = req.body;

      const user = await User.findById(req.user.id).select('+password');

      if (!user) {
        return errorResponse({
          res,
          message: 'User not found',
          statusCode: 404,
        });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return errorResponse({
          res,
          message: 'Password is incorrect',
          statusCode: 401,
        });
      }

      // Soft delete - mark as inactive instead of removing
      // user.isActive = false;
      // await user.save();

      // Or hard delete:
      await User.findByIdAndDelete(req.user.id);

      return successResponse({
        res,
        message: 'Account deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
