const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const tapRoutes = require('./routes/tap.routes');
const { protect } = require('./middleware/auth.middleware');
const walletRoutes = require('./routes/wallet.routes');
const nfcRoutes = require('./routes/nfc.routes');
const syncRoutes = require('./routes/sync.routes');
const adminRoutes = require('./routes/admin.routes');
const routeRoutes = require('./routes/route.routes');
const userRoutes = require('./routes/user.routes');
const transactionRoutes = require('./routes/transaction.routes');
const stopRoutes = require('./routes/stop.routes');
const busRoutes = require('./routes/bus.routes');
const driverRoutes = require('./routes/driver.routes');

const app = express();

const Stop = require('./models/stop.model');

app.get('/seed-stops', async (req, res) => {

    await Stop.deleteMany();

    const stops = await Stop.insertMany([
        { name: 'Koteshwor', order: 1 },
        { name: 'Baneshwor', order: 2 },
        { name: 'Putalisadak', order: 3 },
        { name: 'Ratnapark', order: 4 }
    ]);

    res.json(stops);
});

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tap', tapRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/nfc', nfcRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/stops', stopRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/drivers', driverRoutes);


// Protected test route
app.get('/protected', protect, (req, res) => {
    res.json({
        message: 'Access granted',
        user: req.user
    });
});

// Root route
app.get('/', (req, res) => {
    res.send('NFC Backend Running');
});



const saveOfflineTransaction = require('./utils/offlineStorage');

app.get('/test-offline', (req, res) => {

    saveOfflineTransaction({
        nfcUid: 'A1B2C3D4',
        sourceStop: 'Koteshwor',
        destinationStop: 'Ratnapark',
        fare: 30
    });

    res.json({
        message: 'Offline transaction stored'
    });

});

module.exports = app;