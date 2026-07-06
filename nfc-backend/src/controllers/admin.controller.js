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

// REVENUE REPORT
exports.getRevenueReport = async (req, res) => {

    try {

        const today = new Date();

        const startToday = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        const startWeek = new Date(startToday);

        startWeek.setDate(
            startWeek.getDate() - 7
        );

        const startMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );

        const todayRevenue = await Transaction.aggregate([

            {
                $match: {
                    createdAt: {
                        $gte: startToday
                    }
                }
            },

            {
                $group: {
                    _id: null,
                    revenue: {
                        $sum: "$fare"
                    }
                }
            }

        ]);



        const weeklyRevenue = await Transaction.aggregate([

            {
                $match: {
                    createdAt: {
                        $gte: startWeek
                    }
                }
            },

            {
                $group: {
                    _id: null,
                    revenue: {
                        $sum: "$fare"
                    }
                }
            }

        ]);



        const monthlyRevenue = await Transaction.aggregate([

            {
                $match: {
                    createdAt: {
                        $gte: startMonth
                    }
                }
            },

            {
                $group: {
                    _id: null,
                    revenue: {
                        $sum: "$fare"
                    }
                }
            }

        ]);



        const totalRevenue = await Transaction.aggregate([

            {
                $group: {
                    _id: null,
                    revenue: {
                        $sum: "$fare"
                    }
                }
            }

        ]);


        res.json({

            todayRevenue:
                todayRevenue[0]?.revenue || 0,

            weeklyRevenue:
                weeklyRevenue[0]?.revenue || 0,

            monthlyRevenue:
                monthlyRevenue[0]?.revenue || 0,

            totalRevenue:
                totalRevenue[0]?.revenue || 0

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// PASSENGER REPORT
exports.getPassengerReport = async (req, res) => {

    try {

        const totalPassengers = await User.countDocuments({
            role: 'passenger'
        });

        const startMonth = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
        );

        const newPassengersThisMonth = await User.countDocuments({

            role: 'passenger',

            createdAt: {
                $gte: startMonth
            }

        });

        res.json({

            totalPassengers,

            newPassengersThisMonth

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// TRANSACTION REPORT
exports.getTransactionReport = async (req, res) => {

    try {

        const totalTransactions =
            await Transaction.countDocuments();

        const startToday = new Date();

        startToday.setHours(0, 0, 0, 0);

        const todayTransactions =
            await Transaction.countDocuments({

                createdAt: {
                    $gte: startToday
                }

            });

        const startMonth = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
        );

        const monthlyTransactions =
            await Transaction.countDocuments({

                createdAt: {
                    $gte: startMonth
                }

            });

        res.json({

            todayTransactions,

            monthlyTransactions,

            totalTransactions

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// BUS REPORT
exports.getBusReport = async (req, res) => {

    try {

        const totalBuses =
            await Bus.countDocuments();

        const assignedBuses =
            await Bus.countDocuments({

                route: {
                    $ne: null
                }

            });

        const unassignedBuses =
            totalBuses - assignedBuses;

        res.json({

            totalBuses,

            assignedBuses,

            unassignedBuses

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ROUTE REPORT
exports.getRouteReport = async (req, res) => {

    try {

        const routes =
            await Route.find();

        const totalRoutes =
            routes.length;

        const totalStops =
            routes.reduce(

                (sum, route) =>

                    sum + route.stops.length,

                0

            );

        const averageStopsPerRoute =
            totalRoutes > 0

                ? totalStops / totalRoutes

                : 0;

        res.json({

            totalRoutes,

            totalStops,

            averageStopsPerRoute

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// COMPLETE ANALYTICS
exports.getAnalytics = async (req, res) => {

    try {

        /* ===========================
           DASHBOARD
        =========================== */

        const totalPassengers = await User.countDocuments({
            role: 'passenger'
        });

        const totalTransactions =
            await Transaction.countDocuments();

        const totalBuses =
            await Bus.countDocuments();

        const totalRoutes =
            await Route.countDocuments();

        const startMonth = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
        );

        const dashboardRevenue =
            await Transaction.aggregate([

                {
                    $match: {
                        createdAt: {
                            $gte: startMonth
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
            dashboardRevenue.length > 0
                ? dashboardRevenue[0].totalRevenue
                : 0;

        /* ===========================
           REVENUE
        =========================== */

        const today = new Date();

        const startToday = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        const startWeek = new Date(startToday);
        startWeek.setDate(startWeek.getDate() - 7);

        const todayRevenue =
            await Transaction.aggregate([

                {
                    $match: {
                        createdAt: {
                            $gte: startToday
                        }
                    }
                },

                {
                    $group: {
                        _id: null,
                        revenue: {
                            $sum: "$fare"
                        }
                    }
                }

            ]);

        const weeklyRevenue =
            await Transaction.aggregate([

                {
                    $match: {
                        createdAt: {
                            $gte: startWeek
                        }
                    }
                },

                {
                    $group: {
                        _id: null,
                        revenue: {
                            $sum: "$fare"
                        }
                    }
                }

            ]);

        const totalRevenue =
            await Transaction.aggregate([

                {
                    $group: {
                        _id: null,
                        revenue: {
                            $sum: "$fare"
                        }
                    }
                }

            ]);

        /* ===========================
           PASSENGERS
        =========================== */

        const newPassengersThisMonth =
            await User.countDocuments({

                role: 'passenger',

                createdAt: {
                    $gte: startMonth
                }

            });

        /* ===========================
           TRANSACTIONS
        =========================== */

        const todayTransactions =
            await Transaction.countDocuments({

                createdAt: {
                    $gte: startToday
                }

            });

        const monthlyTransactions =
            await Transaction.countDocuments({

                createdAt: {
                    $gte: startMonth
                }

            });

        /* ===========================
           BUSES
        =========================== */

        const assignedBuses =
            await Bus.countDocuments({

                route: {
                    $ne: null
                }

            });

        const unassignedBuses =
            totalBuses - assignedBuses;

        /* ===========================
           ROUTES
        =========================== */

        const routes =
            await Route.find();

        const totalStops =
            routes.reduce(

                (sum, route) =>

                    sum + route.stops.length,

                0

            );

        const averageStopsPerRoute =
            totalRoutes > 0
                ? totalStops / totalRoutes
                : 0;

        /* ===========================
           RESPONSE
        =========================== */

        res.json({

            dashboard: {

                totalPassengers,

                totalTransactions,

                monthlyRevenue,

                totalBuses,

                totalRoutes

            },

            revenue: {

                todayRevenue:
                    todayRevenue[0]?.revenue || 0,

                weeklyRevenue:
                    weeklyRevenue[0]?.revenue || 0,

                monthlyRevenue,

                totalRevenue:
                    totalRevenue[0]?.revenue || 0

            },

            passengers: {

                totalPassengers,

                newPassengersThisMonth

            },

            transactions: {

                todayTransactions,

                monthlyTransactions,

                totalTransactions

            },

            buses: {

                totalBuses,

                assignedBuses,

                unassignedBuses

            },

            routes: {

                totalRoutes,

                totalStops,

                averageStopsPerRoute

            }

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};