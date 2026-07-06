const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^[0-9]{10}$/;
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const buildUserPayload = (user) => ({
    _id: user._id,
    accountCode: user._id.toString().slice(-8).toUpperCase(),
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

        if (!EMAIL_REGEX.test(normalizedEmail)) {
            return res.status(400).json({
                message: 'Please enter a valid email address'
            });
        }

        if (!MOBILE_REGEX.test(String(mobileNumber))) {
            return res.status(400).json({
                message: 'Please enter a valid 10-digit mobile number'
            });
        }

        if (!STRONG_PASSWORD_REGEX.test(password)) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character'
            });
        }

        const userExists = await User.findOne({ email: normalizedEmail });

        if (userExists) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        const mobileExists = await User.findOne({ mobileNumber: String(mobileNumber) });

        if (mobileExists) {
            return res.status(400).json({
                message: 'Mobile number is already registered'
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user = await User.create({
            name: resolvedName,
            mobileNumber: String(mobileNumber),
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
