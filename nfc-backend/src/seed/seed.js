require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const Stop = require('../models/stop.model');
const Route = require('../models/route.model');

const seedDatabase = async () => {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log('MongoDB Connected');

        // ===========================
        // Clear Existing Data
        // ===========================

        await User.deleteMany();
        await Stop.deleteMany();
        await Route.deleteMany();

        console.log('Old data removed');

        // ===========================
        // Create Stops
        // ===========================

        const stops = await Stop.insertMany([

            {
                name: 'Koteshwor',
                order: 1
            },
            {
                name: 'Baneshwor',
                order: 2
            },
            {
                name: 'Putalisadak',
                order: 3
            },
            {
                name: 'Ratnapark',
                order: 4
            },
            {
                name: 'New Bus Park',
                order: 5
            }

        ]);

        console.log('Stops created');

        // ===========================
        // Create Route
        // ===========================

        const route = await Route.create({

            name: 'Koteshwor - New Bus Park',

            stops: stops.map(stop => stop._id)

        });

        console.log('Route created');

        // ===========================
        // Password
        // ===========================

        const hashedPassword = await bcrypt.hash(
            'password123',
            10
        );

        // ===========================
        // Admin
        // ===========================

        await User.create({

            name: 'System Admin',

            mobileNumber: '9800000000',

            email: 'admin@nfc.com',

            password: hashedPassword,

            role: 'admin',

            balance: 0

        });

        // ===========================
        // Driver
        // ===========================

        await User.create({

            name: 'Driver One',

            mobileNumber: '9811111111',

            email: 'driver@nfc.com',

            password: hashedPassword,

            role: 'driver',

            balance: 0

        });

        // ===========================
        // Passenger
        // ===========================

        await User.create({

            name: 'Test Passenger',

            mobileNumber: '9822222222',

            email: 'passenger@nfc.com',

            password: hashedPassword,

            role: 'passenger',

            balance: 500

        });

        console.log('Users created');

        console.log('==========================');
        console.log('Database Seed Successful');
        console.log('==========================');

        process.exit();

    }

    catch (error) {

        console.log(error);

        process.exit(1);

    }

};

seedDatabase();