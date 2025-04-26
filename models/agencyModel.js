const mongoose = require('mongoose');

const agencySchema = new mongoose.Schema({
    ContractorName: {
        type: String,
        required: [true, 'Contractor name is required']
    },
    ContractorMobileNumber: {
        type: Number,
        required: [true, 'Contractor mobile number is required']
    },
    ContractorAddress: {
        type: String,
        required: [true, 'Contractor address is required']
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        enum: ['Surat', 'Ahmedabad', 'Vadodara', 'Rajkot']
    },
    ContractorPinCode: {
        type: Number,
        required: [true, 'Contractor pin code is required']
    },
    ContractorEmailId: {
        type: String,
        required: [true, 'Contractor email is required'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    ContractorGstNumber: {
        type: String,
        required: [true, 'Contractor GST number is required']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Agency = mongoose.model('agency', agencySchema);

module.exports = Agency;