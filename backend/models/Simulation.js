const mongoose = require('mongoose');

const simulationSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    selectedColors: [{
        type: String,
        match: [/^#[0-9A-F]{6}$/i, 'Please provide valid hex color codes']
    }],
    customerEmail: {
        type: String,
        trim: true,
        lowercase: true
    },
    roomType: {
        type: String,
        enum: ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Office', 'Other'],
        default: 'Living Room'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Simulation', simulationSchema);
