const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');

const buildWalletPayload = async (userId) => {
    const user = await User.findById(userId);
    const lastRecharge = await Transaction.findOne({
        user: userId,
        type: 'credit'
    }).sort({ createdAt: -1 });

    return {
        balance: user?.balance || 0,
        cardNumber: user?.nfcUid || '',
        lastRechargeDate: lastRecharge ? lastRecharge.createdAt : null
    };
};

exports.rechargeWallet = async (req, res) => {

    try {

        const { amount } = req.body;
        const rechargeAmount = Number(amount);

        if (!rechargeAmount || rechargeAmount <= 0) {
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

        user.balance += rechargeAmount;

        await user.save();

        const transaction = await Transaction.create({
            user: user._id,
            type: 'credit',
            sourceStop: null,
            destinationStop: null,
            fare: rechargeAmount
        });

        res.json({
            message: 'Wallet recharged successfully',
            addedAmount: rechargeAmount,
            currentBalance: user.balance,
            transaction,
            wallet: await buildWalletPayload(user._id)
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

        const wallet = await buildWalletPayload(req.user._id);

        res.json(wallet);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
