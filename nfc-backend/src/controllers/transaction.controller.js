const Transaction = require('../models/transaction.model');

exports.getTransactions = async (req, res) => {

    try {

        const transactions = await Transaction
            .find({ user: req.user._id })
            .sort({ createdAt: -1 });

        res.json(transactions);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

exports.getRecentTransactions = async (req, res) => {

    try {

        const limit = parseInt(req.query.limit) || 10;

        const transactions = await Transaction
            .find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(limit);

        res.json(transactions);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

exports.getAllTransactions = async (req, res) => {

    try {

        const transactions = await Transaction
            .find()
            .populate('user', 'name email mobileNumber')
            .sort({ createdAt: -1 });

        res.json(transactions);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};