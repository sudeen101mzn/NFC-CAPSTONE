const express = require('express');
const transactionController = require('../controllers/transaction.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/', transactionController.getTransactions);
router.post('/', transactionController.createTransaction);
router.get('/recent', transactionController.getRecentTransactions);
router.get('/summary', transactionController.getMonthlyTransactionSummary);
router.get('/:transactionId', transactionController.getTransactionById);

module.exports = router;
