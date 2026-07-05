const User = require('../models/user.model');
const Bus = require('../models/bus.model');

// ==============================
// GET ALL DRIVERS
// ==============================

exports.getDrivers = async (req, res) => {

    try {

        const drivers = await User.find({
            role: 'driver'
        }).select('-password');

        res.json(drivers);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// ==============================
// PROMOTE USER TO DRIVER
// ==============================

exports.makeDriver = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({
                message: 'User not found'
            });

        }

        user.role = 'driver';

        await user.save();

        res.json({
            message: 'User promoted to driver',
            user
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// ==============================
// DEMOTE DRIVER
// ==============================

exports.removeDriver = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({
                message: 'User not found'
            });

        }

        user.role = 'passenger';

        await user.save();

        res.json({
            message: 'Driver removed',
            user
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// ==============================
// ASSIGN DRIVER TO BUS
// ==============================

exports.assignBus = async (req, res) => {

    try {

        const { busId } = req.body;

        const driver = await User.findById(req.params.id);

        if (!driver) {

            return res.status(404).json({
                message: 'Driver not found'
            });

        }

        if (driver.role !== 'driver') {

            return res.status(400).json({
                message: 'User is not a driver'
            });

        }

        const bus = await Bus.findById(busId);

        if (!bus) {

            return res.status(404).json({
                message: 'Bus not found'
            });

        }

        bus.driver = driver._id;

        await bus.save();

        res.json({
            message: 'Driver assigned successfully',
            bus
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// ==============================
// GET DRIVER BUS
// ==============================

exports.getAssignedBus = async (req, res) => {

    try {

        const bus = await Bus.findOne({
            driver: req.params.id
        })
        .populate('route');

        if (!bus) {

            return res.status(404).json({
                message: 'No bus assigned'
            });

        }

        res.json(bus);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};