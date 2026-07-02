const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');
const bcrypt = require('bcryptjs');

exports.getProfile = async (req, res) => {

    try {

        const user = await User
            .findById(req.user._id)
            .select('-password');

        res.json(user);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

exports.getMyTransactions = async (req, res) => {

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

exports.updateProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user._id);

        if (!user) {

            return res.status(404).json({
                message: 'User not found'
            });

        }

        user.name =
            req.body.name ||
            user.name;

        user.mobileNumber =
            req.body.mobileNumber ||
            user.mobileNumber;

        user.email =
            req.body.email ||
            user.email;

        await user.save();

        res.json({
            message: 'Profile updated successfully',
            user
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

exports.changePassword = async (req, res) => {

    try {

        const {
            currentPassword,
            newPassword
        } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {

            return res.status(404).json({
                message: 'User not found'
            });

        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {

            return res.status(400).json({
                message: 'Current password is incorrect'
            });

        }

        user.password = await bcrypt.hash(
            newPassword,
            10
        );

        await user.save();

        res.json({
            message: 'Password changed successfully'
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};