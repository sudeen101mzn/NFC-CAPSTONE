const express = require('express');

const router = express.Router();

const { protect } =
require('../middleware/auth.middleware');

const {
    getProfile,
    getMyTransactions,
    updateProfile,
    changePassword
} =
require('../controllers/user.controller');

router.get(
    '/profile',
    protect,
    getProfile
);

router.get(
    '/transactions',
    protect,
    getMyTransactions
);

router.put(
    '/profile',
    protect,
    updateProfile
);

router.put(
    '/change-password',
    protect,
    changePassword
);

module.exports = router;
