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
const { getTransactionSummary } = require('./controllers/user.controller');

const app = express();

// ============================================================
// MIDDLEWARE FIRST — must be before any route definitions
// ============================================================
app.use(cors({
  origin: '*',                         // Allow all origins (React Native / emulator)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());               // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ============================================================
// ROUTES
// ============================================================
app.use('/api/auth', authRoutes);
app.use('/api/tap', tapRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/nfc', nfcRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/route', routeRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/user', userRoutes);
app.get('/api/transactions', protect, getTransactionSummary);

// Root health-check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'NFC Backend Running 🚀' });
});

// Protected test route
app.get('/protected', protect, (req, res) => {
  res.json({ message: 'Access granted', user: req.user });
});

// Seed stops (dev only)
const Stop = require('./models/stop.model');
app.get('/seed-stops', async (req, res) => {
  await Stop.deleteMany();
  const stops = await Stop.insertMany([
    { name: 'Koteshwor',    order: 1 },
    { name: 'Baneshwor',    order: 2 },
    { name: 'Putalisadak',  order: 3 },
    { name: 'Ratnapark',    order: 4 },
  ]);
  res.json(stops);
});

// Test offline storage (dev only)
const saveOfflineTransaction = require('./utils/offlineStorage');
app.get('/test-offline', (req, res) => {
  saveOfflineTransaction({
    nfcUid: 'A1B2C3D4',
    sourceStop: 'Koteshwor',
    destinationStop: 'Ratnapark',
    fare: 30,
  });
  res.json({ message: 'Offline transaction stored' });
});

// ============================================================
// GLOBAL ERROR HANDLER — catches any unhandled errors in routes
// ============================================================
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

module.exports = app;
