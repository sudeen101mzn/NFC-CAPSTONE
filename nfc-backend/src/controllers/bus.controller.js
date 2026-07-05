const Bus = require('../models/bus.model');
const Route = require('../models/route.model');
const User = require('../models/user.model');

// ==========================
// CREATE BUS
// ==========================

exports.createBus = async (req, res) => {

    try {

        const {
            busNumber,
            route,
            driver,
            capacity
        } = req.body;

        const busExists = await Bus.findOne({ busNumber });

        if (busExists) {
            return res.status(400).json({
                message: 'Bus already exists'
            });
        }

        const routeExists = await Route.findById(route);

        if (!routeExists) {
            return res.status(404).json({
                message: 'Route not found'
            });
        }

        if (driver) {

            const driverUser = await User.findById(driver);

            if (!driverUser || driverUser.role !== 'driver') {

                return res.status(400).json({
                    message: 'Invalid driver'
                });

            }

        }

        const bus = await Bus.create({

            busNumber,
            route,
            driver: driver || null,
            capacity

        });

        res.status(201).json(bus);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ==========================
// GET ALL BUSES
// ==========================

exports.getBuses = async (req, res) => {

    try {

        const buses = await Bus.find()
            .populate('route')
            .populate('driver', 'name mobileNumber email');

        res.json(buses);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ==========================
// GET BUS BY ID
// ==========================

exports.getBusById = async (req, res) => {

    try {

        const bus = await Bus.findById(req.params.id)
            .populate('route')
            .populate('driver', 'name mobileNumber email');

        if (!bus) {

            return res.status(404).json({
                message: 'Bus not found'
            });

        }

        res.json(bus);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ==========================
// UPDATE BUS
// ==========================

exports.updateBus = async (req, res) => {

    try {

        const bus = await Bus.findById(req.params.id);

        if (!bus) {

            return res.status(404).json({
                message: 'Bus not found'
            });

        }

        if (req.body.route) {

            const routeExists = await Route.findById(req.body.route);

            if (!routeExists) {

                return res.status(404).json({
                    message: 'Route not found'
                });

            }

        }

        if (req.body.driver) {

            const driverUser = await User.findById(req.body.driver);

            if (!driverUser || driverUser.role !== 'driver') {

                return res.status(400).json({
                    message: 'Invalid driver'
                });

            }

        }

        bus.busNumber = req.body.busNumber || bus.busNumber;
        bus.route = req.body.route || bus.route;
        bus.driver = req.body.driver || bus.driver;
        bus.capacity = req.body.capacity || bus.capacity;
        bus.status = req.body.status || bus.status;

        await bus.save();

        res.json(bus);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ==========================
// DELETE BUS
// ==========================

exports.deleteBus = async (req, res) => {

    try {

        const bus = await Bus.findById(req.params.id);

        if (!bus) {

            return res.status(404).json({
                message: 'Bus not found'
            });

        }

        await bus.deleteOne();

        res.json({
            message: 'Bus deleted successfully'
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};