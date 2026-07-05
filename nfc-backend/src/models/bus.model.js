const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({

    busNumber: {
        type: String,
        required: true,
        unique: true
    },

    route: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
        required: true
    },

    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },

    capacity: {
        type: Number,
        default: 40
    },

    status: {
        type: String,
        enum: ['active', 'inactive', 'maintenance'],
        default: 'active'
    }

}, { timestamps: true });

module.exports = mongoose.model('Bus', busSchema);