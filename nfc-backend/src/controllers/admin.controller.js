const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');
const Bus = require('../models/bus.model');
const Route = require('../models/route.model');


// GET ALL USERS
exports.getAllUsers = async (req, res) => {

    try {

        const users = await User
            .find()
            .select('-password');

        res.json(users);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// GET ALL TRANSACTIONS
exports.getAllTransactions = async (req, res) => {

    try {

        const transactions =
            await Transaction
                .find()
                .populate(
                    'user',
                    'name email'
                );

        res.json(
            transactions
        );

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// GET DASHBOARD DATA
exports.getDashboard = async (req, res) => {

    try {

        // Total Passengers
        const totalPassengers = await User.countDocuments({
            role: 'passenger'
        });

        // Total Transactions
        const totalTransactions = await Transaction.countDocuments();

        // Total Buses
        const totalBuses = await Bus.countDocuments();

        // Total Routes
        const totalRoutes = await Route.countDocuments();

        // Revenue for Current Month
        const startOfMonth = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
        );

        const revenue = await Transaction.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfMonth
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$fare"
                    }
                }
            }
        ]);

        const monthlyRevenue =
            revenue.length > 0
                ? revenue[0].totalRevenue
                : 0;

        res.json({

            totalPassengers,

            totalTransactions,

            monthlyRevenue,

            totalBuses,

            totalRoutes

        });

    }

    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};