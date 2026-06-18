const express = require('express');
const notificationController = require('../controllers/notification.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/', notificationController.getNotifications);
router.post('/', notificationController.createNotification);
router.get('/unread', notificationController.getUnreadNotifications);
router.get('/:notificationId', notificationController.getNotificationById);
router.patch('/:notificationId/read', notificationController.markAsRead);
router.patch('/read-all', notificationController.markAllAsRead);
router.delete('/:notificationId', notificationController.deleteNotification);
router.delete('/delete-all', notificationController.deleteAllNotifications);

module.exports = router;
