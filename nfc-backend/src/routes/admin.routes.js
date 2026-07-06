const express = require('express');

const router = express.Router();

const { protect } =
require('../middleware/auth.middleware');

const { authorize } =
require('../middleware/role.middleware');

const {
    getAllUsers,
    getAllTransactions,
    getDashboard,
    getRevenueReport,
    getPassengerReport,
    getTransactionReport,
    getBusReport,
    getRouteReport,
    getAnalytics
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

// REVENUE REPORT
router.get(

    '/reports/revenue',

    protect,

    authorize('admin'),

    getRevenueReport

);

// PASSENGER REPORT
router.get(

    '/reports/passengers',

    protect,

    authorize('admin'),

    getPassengerReport

);

//TRANSACTION REPORT

router.get(

    '/reports/transactions',

    protect,

    authorize('admin'),

    getTransactionReport

);

// BUS REPORT
router.get(

    '/reports/buses',

    protect,

    authorize('admin'),

    getBusReport

);

// ROUTE REPORT
router.get(

    '/reports/routes',

    protect,

    authorize('admin'),

    getRouteReport

);

// COMPLETE ANALYTICS
router.get(

    '/analytics',

    protect,

    authorize('admin'),

    getAnalytics

);