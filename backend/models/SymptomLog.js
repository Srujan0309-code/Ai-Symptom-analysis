const mongoose = require('mongoose');

const symptomLogSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true, index: true },
    symptoms: { type: String, required: true },
    urgency: { type: String, default: 'Low' },
    language: { type: String, default: 'en' },
    result: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.models.SymptomLog ||
  mongoose.model('SymptomLog', symptomLogSchema);
