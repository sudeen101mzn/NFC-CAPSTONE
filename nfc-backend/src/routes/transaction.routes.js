const express = require('express');

const router = express.Router();

const {
    getTransactions,
    getRecentTransactions,
    getAllTransactions
} = require('../controllers/transaction.controller');

const {
    protect
} = require('../middleware/auth.middleware');

const {
    authorize
} = require('../middleware/role.middleware');

router.get(
    '/',
    protect,
    getTransactions
);

router.get(
    '/recent',
    protect,
    getRecentTransactions
);

router.get(
    '/all',
    protect,
    authorize('admin'),
    getAllTransactions
);

module.exports = router;