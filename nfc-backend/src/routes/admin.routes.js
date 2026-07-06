const express = require('express');

const router = express.Router();

const { protect } =
require('../middleware/auth.middleware');

const { authorize } =
require('../middleware/role.middleware');

const {
    getAllUsers,
    getAllTransactions,
    getDashboard
} =
require('../controllers/admin.controller');


// ADMIN DASHBOARD
router.get(
    '/dashboard',

    protect,

    authorize('admin'),

    getDashboard

);


// GET ALL USERS
router.get(
    '/users',

    protect,

    authorize('admin'),

    getAllUsers
);


// GET ALL TRANSACTIONS
router.get(
    '/transactions',

    protect,

    authorize('admin'),

    getAllTransactions
);


module.exports = router;