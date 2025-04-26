const mongoose = require('mongoose');

const jobInwardSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: [true, 'Authority name is required']
  },
  clientMobileNumber: {
    type: Number,
    required: [true, 'Authority mobile number is required']
  },
  clientAddress: {
    type: String,
    required: [true, 'Authority address is required']
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    enum: ['Surat', 'Ahmedabad', 'Vadodara', 'Rajkot']
  },
  clientPinCode: {
    type: Number,
    required: [true, 'Authority pin code is required']
  },
  clientEmailId: {
    type: String,
    required: [true, 'Authority email is required'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  clientGstNumber: {
    type: String,
    required: [true, 'Authority GST number is required']
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

const JobInward = mongoose.model('authority', jobInwardSchema);

module.exports = JobInward;