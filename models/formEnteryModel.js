const mongoose = require('mongoose');

const FormEnterySchema = new mongoose.Schema({
  fromDate: {
    type: Date,
    required: true
  },
  toDate: {
    type: Date,
    required: true
  },
  refraneName: {
    type: String,
    required: true,
    trim: true
  },
  authority: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'authority',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'agency',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FormEntry', FormEnterySchema);