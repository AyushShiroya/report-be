const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: Number, required: true },
  type: { type: String, required: true },
  lastModified: { type: Number, required: true },
  path: { type: String }, // Path where file is stored on server
});

const jobInwardSchema = new mongoose.Schema({
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'authority', 
    required: true 
  },
  contractorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'agency', 
    required: true 
  },
  workName: { type: String, required: true },
  documents: [fileSchema],
  agreementNumber: { type: String, required: true },
  pmc: { type: String },
  witness: { type: String },
  thirdTitle: { type: String },
  fourthTitle: { type: String },
  letterNo: { type: String },
  letterDate: { type: Date },
  sampleReceivedDate: { type: Date },
  inwardNumber: { type: String },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
jobInwardSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('JobInward', jobInwardSchema);