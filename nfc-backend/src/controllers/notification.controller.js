const Notification = require('../models/notification.model');
const { successResponse, errorResponse } = require('../utils/response');

const notificationController = {
  // Get all notifications
  getNotifications: async (req, res, next) => {
    try {
      const { type, isRead, priority, page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;

      const filter = { userId: req.user.id };

      if (type) filter.type = type;
      if (isRead !== undefined) filter.isRead = isRead === 'true';
      if (priority) filter.priority = priority;

      const notifications = await Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Notification.countDocuments(filter);

      return successResponse({
        res,
        message: 'Notifications fetched successfully',
        data: {
          notifications,
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

  // Get unread notifications
  getUnreadNotifications: async (req, res, next) => {
    try {
      const notifications = await Notification.find({
        userId: req.user.id,
        isRead: false,
      }).sort({ createdAt: -1 });

      return successResponse({
        res,
        message: 'Unread notifications fetched successfully',
        data: notifications,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get notification by ID
  getNotificationById: async (req, res, next) => {
    try {
      const { notificationId } = req.params;

      const notification = await Notification.findById(notificationId);

      if (!notification || notification.userId.toString() !== req.user.id) {
        return errorResponse({
          res,
          message: 'Notification not found',
          statusCode: 404,
        });
      }

      return successResponse({
        res,
        message: 'Notification fetched successfully',
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  },

  // Mark notification as read
  markAsRead: async (req, res, next) => {
    try {
      const { notificationId } = req.params;

      const notification = await Notification.findByIdAndUpdate(
        notificationId,
        { isRead: true },
        { new: true }
      );

      if (!notification) {
        return errorResponse({
          res,
          message: 'Notification not found',
          statusCode: 404,
        });
      }

      return successResponse({
        res,
        message: 'Notification marked as read',
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (req, res, next) => {
    try {
      const result = await Notification.updateMany(
        { userId: req.user.id, isRead: false },
        { isRead: true }
      );

      return successResponse({
        res,
        message: 'All notifications marked as read',
        data: {
          modifiedCount: result.modifiedCount,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete notification
  deleteNotification: async (req, res, next) => {
    try {
      const { notificationId } = req.params;

      const notification = await Notification.findByIdAndDelete(notificationId);

      if (!notification) {
        return errorResponse({
          res,
          message: 'Notification not found',
          statusCode: 404,
        });
      }

      return successResponse({
        res,
        message: 'Notification deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete all notifications
  deleteAllNotifications: async (req, res, next) => {
    try {
      const result = await Notification.deleteMany({ userId: req.user.id });

      return successResponse({
        res,
        message: 'All notifications deleted successfully',
        data: {
          deletedCount: result.deletedCount,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Create notification (internal use)
  createNotification: async (req, res, next) => {
    try {
      const notification = await Notification.create(req.body);

      return successResponse({
        res,
        message: 'Notification created successfully',
        data: notification,
        statusCode: 201,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = notificationController;
