const express = require('express');
const routeController = require('../controllers/route.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', routeController.getAllRoutes);
router.get('/search', routeController.searchRoutes);
router.get('/:routeId', routeController.getRouteById);
router.get('/:routeId/fare', routeController.getRouteFare);
router.get('/:routeId/schedule', routeController.getRouteSchedule);
router.get('/:routeId/seats', routeController.getAvailableSeats);

router.post('/', protect, routeController.createRoute);
router.patch('/:routeId', protect, routeController.updateRoute);

module.exports = router;
