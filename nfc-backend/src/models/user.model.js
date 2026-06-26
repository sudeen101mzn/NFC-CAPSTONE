const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    mobileNumber: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    balance: {
        type: Number,
        default: 0
    },

    isTappedIn: {
        type: Boolean,
        default: false
    },

    tapInStop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stop',
        default: null
    },

    currentRoute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
        default: null
    },

    nfcUid: {
        type: String,
        default: null
    },

    role: {
        type: String,
        enum: ['admin', 'driver', 'passenger'],
        default: 'passenger'
    }

}, { timestamps: true });

userSchema.index(
    { nfcUid: 1 },
    {
        unique: true,
        partialFilterExpression: {
            nfcUid: { $type: 'string', $ne: '' }
        }
    }
);

module.exports = mongoose.model('User', userSchema);
