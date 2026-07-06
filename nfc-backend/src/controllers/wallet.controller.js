const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');

exports.rechargeWallet = async (req, res) => {

    try {

        const { amount } = req.body;
        const parsedAmount = Number(amount);

        if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({
                message: 'Invalid recharge amount'
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        user.balance += parsedAmount;
        await Transaction.create({
            user: req.user._id,
            type: 'credit',
            fare: parsedAmount
        });

        await user.save();

        res.json({
            message: 'Wallet recharged successfully',
            addedAmount: parsedAmount,
            currentBalance: user.balance,
            balance: user.balance
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

exports.getWalletBalance = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const lastRecharge = await Transaction.findOne({
            user: req.user._id,
            type: 'credit'
        }).sort({ createdAt: -1 });

        res.json({
            balance: user.balance,
            cardNumber: user.nfcUid || '',
            lastRechargeDate: lastRecharge ? lastRecharge.createdAt : null,
            user: {
                _id: user._id,
                name: user.name,
                mobileNumber: user.mobileNumber,
                email: user.email,
                role: user.role,
                balance: user.balance,
                nfcUid: user.nfcUid
            }
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
