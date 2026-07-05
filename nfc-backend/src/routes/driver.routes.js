const express = require('express');

const router = express.Router();

const {

    getDrivers,
    makeDriver,
    removeDriver,
    assignBus,
    getAssignedBus

} = require('../controllers/driver.controller');

const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

// Admin only

router.get(
    '/',
    protect,
    authorize('admin'),
    getDrivers
);

router.put(
    '/promote/:id',
    protect,
    authorize('admin'),
    makeDriver
);

router.put(
    '/demote/:id',
    protect,
    authorize('admin'),
    removeDriver
);

router.put(
    '/assign-bus/:id',
    protect,
    authorize('admin'),
    assignBus
);

// Driver/Admin

router.get(
    '/bus/:id',
    protect,
    getAssignedBus
);

module.exports = router;