const express = require('express');

const router = express.Router();

const {

    createBus,
    getBuses,
    getBusById,
    updateBus,
    deleteBus

} = require('../controllers/bus.controller');

const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

// Passenger/Admin
router.get('/', protect, getBuses);
router.get('/:id', protect, getBusById);

// Admin only
router.post('/', protect, authorize('admin'), createBus);
router.put('/:id', protect, authorize('admin'), updateBus);
router.delete('/:id', protect, authorize('admin'), deleteBus);

module.exports = router;