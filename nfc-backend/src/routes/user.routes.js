const express = require('express');
const userController = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.post('/change-password', userController.changePassword);
router.get('/wallet', userController.getWalletBalance);
router.get('/notification-preferences', userController.getNotificationPreferences);
router.patch('/notification-preferences', userController.updateNotificationPreferences);
router.post('/delete-account', userController.deleteAccount);

module.exports = router;
