const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Lab Report', 'Prescription', 'Imaging', 'Other'],
    default: 'Other',
  },
  doctorName: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  fileUrl: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
  },
  encryptionStatus: {
    type: String,
    default: 'AES-256 Secured',
  },
}, { timestamps: true });

module.exports = mongoose.model('Record', recordSchema);
