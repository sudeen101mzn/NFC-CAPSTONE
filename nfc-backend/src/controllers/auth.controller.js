const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

const buildUserPayload = (user) => ({
    _id: user._id,
    name: user.name,
    fullName: user.name,
    mobileNumber: user.mobileNumber,
    email: user.email,
    role: user.role,
    balance: user.balance,
    isTappedIn: user.isTappedIn,
    tapInStop: user.tapInStop,
    currentRoute: user.currentRoute,
    nfcUid: user.nfcUid,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});

exports.register = async (req, res) => {

    try {

        const {
            name,
            fullName,
            mobileNumber,
            email,
            password
        } = req.body;

        const resolvedName = name || fullName;
        const normalizedEmail = email?.toLowerCase();

        if (!resolvedName || !mobileNumber || !normalizedEmail || !password) {
            return res.status(400).json({
                message: 'Name, mobile number, email, and password are required'
            });
        }

        const userExists = await User.findOne({ email: normalizedEmail });

        if (userExists) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user = await User.create({
            name: resolvedName,
            mobileNumber,
            email: normalizedEmail,
            password: hashedPassword
        });

        res.status(201).json({
            message: 'Registration successful',
            token: generateToken(user._id),
            user: buildUserPayload(user)
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

exports.login = async (req, res) => {
    try {
        const { email, identifier, mobileNumber, password } = req.body;

        const lookupValue = identifier || email || mobileNumber;
        const normalizedLookup = typeof lookupValue === 'string' && lookupValue.includes('@')
            ? lookupValue.toLowerCase()
            : lookupValue;

        if (!lookupValue || !password) {
            return res.status(400).json({
                message: 'Email/phone identifier and password are required'
            });
        }

        const user = await User.findOne({
            $or: [
                { email: normalizedLookup },
                { mobileNumber: lookupValue }
            ]
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        res.json({
            message: 'Login successful',
            token: generateToken(user._id),
            user: buildUserPayload(user)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.logout = async (req, res) => {
    res.json({
        message: 'Logged out successfully'
    });
};
