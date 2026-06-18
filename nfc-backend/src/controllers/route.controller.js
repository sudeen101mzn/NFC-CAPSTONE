const Route = require('../models/route.model');
const { successResponse, errorResponse } = require('../utils/response');

const routeController = {
  // Get all routes
  getAllRoutes: async (req, res, next) => {
    try {
      const { source, destination, isActive = true, page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;

      const filter = {};
      if (isActive) filter.isActive = isActive === 'true';
      if (source) filter.source = { $regex: source, $options: 'i' };
      if (destination) filter.destination = { $regex: destination, $options: 'i' };

      const routes = await Route.find(filter)
        .sort({ routeName: 1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Route.countDocuments(filter);

      return successResponse({
        res,
        message: 'Routes fetched successfully',
        data: {
          routes,
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

  // Get route details
  getRouteById: async (req, res, next) => {
    try {
      const { routeId } = req.params;

      const route = await Route.findById(routeId);

      if (!route) {
        return errorResponse({
          res,
          message: 'Route not found',
          statusCode: 404,
        });
      }

      return successResponse({
        res,
        message: 'Route fetched successfully',
        data: route,
      });
    } catch (error) {
      next(error);
    }
  },

  // Search routes
  searchRoutes: async (req, res, next) => {
    try {
      const { source, destination, date } = req.query;

      if (!source || !destination) {
        return errorResponse({
          res,
          message: 'Source and destination are required',
          statusCode: 400,
        });
      }

      const routes = await Route.find({
        source: { $regex: source, $options: 'i' },
        destination: { $regex: destination, $options: 'i' },
        isActive: true,
      });

      return successResponse({
        res,
        message: 'Routes found',
        data: routes,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get fare info
  getRouteFare: async (req, res, next) => {
    try {
      const { routeId } = req.params;

      const route = await Route.findById(routeId).select('baseFare peakHourFare offPeakFare stops distance');

      if (!route) {
        return errorResponse({
          res,
          message: 'Route not found',
          statusCode: 404,
        });
      }

      return successResponse({
        res,
        message: 'Fare info fetched successfully',
        data: {
          baseFare: route.baseFare,
          peakHourFare: route.peakHourFare,
          offPeakFare: route.offPeakFare,
          distance: route.distance,
          stops: route.stops,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Get route schedule
  getRouteSchedule: async (req, res, next) => {
    try {
      const { routeId } = req.params;

      const route = await Route.findById(routeId).select('schedule routeName');

      if (!route) {
        return errorResponse({
          res,
          message: 'Route not found',
          statusCode: 404,
        });
      }

      return successResponse({
        res,
        message: 'Schedule fetched successfully',
        data: {
          routeName: route.routeName,
          schedule: route.schedule,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Get available seats
  getAvailableSeats: async (req, res, next) => {
    try {
      const { routeId } = req.params;
      const { date } = req.query;

      const route = await Route.findById(routeId).select('totalSeats');

      if (!route) {
        return errorResponse({
          res,
          message: 'Route not found',
          statusCode: 404,
        });
      }

      // TODO: Implement seat availability logic based on bookings
      const bookedSeats = 0; // Placeholder

      return successResponse({
        res,
        message: 'Available seats fetched',
        data: {
          totalSeats: route.totalSeats,
          bookedSeats,
          availableSeats: route.totalSeats - bookedSeats,
          date: date || new Date().toISOString().split('T')[0],
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Create route (admin only)
  createRoute: async (req, res, next) => {
    try {
      const route = await Route.create(req.body);

      return successResponse({
        res,
        message: 'Route created successfully',
        data: route,
        statusCode: 201,
      });
    } catch (error) {
      next(error);
    }
  },

  // Update route (admin only)
  updateRoute: async (req, res, next) => {
    try {
      const { routeId } = req.params;

      const route = await Route.findByIdAndUpdate(routeId, req.body, {
        new: true,
        runValidators: true,
      });

      if (!route) {
        return errorResponse({
          res,
          message: 'Route not found',
          statusCode: 404,
        });
      }

      return successResponse({
        res,
        message: 'Route updated successfully',
        data: route,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = routeController;
