const SymptomLog = require('../models/SymptomLog');

// ── Static mock clinics (no DB needed for clinics) ──────────────────────────
const MOCK_CLINICS = [
  { id: '1', name: 'Apollo Hospital', address: 'Greams Road, Chennai', lat: 13.0658, lng: 80.2524, specialty: 'Cardiology', rating: 4.8, phone: '+91 44 2829 3333', wait_time_minutes: 15 },
  { id: '2', name: 'Fortis Memorial Research Institute', address: 'Gurugram, Delhi NCR', lat: 28.4595, lng: 77.0266, specialty: 'General Physician', rating: 4.5, phone: '+91 124 4921 021', wait_time_minutes: 30 },
  { id: '3', name: 'Max Super Speciality Hospital', address: 'Saket, New Delhi', lat: 28.5273, lng: 77.2111, specialty: 'Dermatology', rating: 4.7, phone: '+91 11 2651 5050', wait_time_minutes: 5 },
  { id: '4', name: 'Manipal Hospital', address: 'HAL Old Airport Road, Bengaluru', lat: 12.9592, lng: 77.6444, specialty: 'Pediatrics', rating: 4.6, phone: '+91 80 2502 4444', wait_time_minutes: 45 },
  { id: '5', name: 'City Care Clinic', address: 'Local Care Center', lat: 12.9716, lng: 77.5946, specialty: 'General Physician', rating: 4.2, phone: '+91 80 1234 5678', wait_time_minutes: 10 },
];

// ── Clinics (static for now, Google Maps handles real-time nearby) ───────────
const getClinicsBySpecialty = async (specialty) => {
  if (specialty) {
    const filtered = MOCK_CLINICS.filter(c =>
      c.specialty.toLowerCase().includes(specialty.toLowerCase())
    );
    return filtered.length > 0 ? filtered : MOCK_CLINICS;
  }
  return MOCK_CLINICS;
};

// ── Save symptom log to MongoDB ──────────────────────────────────────────────
const saveSymptomLog = async (logData) => {
  try {
    const log = new SymptomLog(logData);
    await log.save();
    return { success: true, id: log._id };
  } catch (err) {
    console.error('[MongoDB] saveSymptomLog error:', err.message);
    return { success: false, error: err.message };
  }
};

// ── Get symptom history for a user from MongoDB ──────────────────────────────
const getSymptomHistory = async (userId) => {
  try {
    const logs = await SymptomLog.find({ user_id: userId })
      .sort({ created_at: -1 })
      .limit(50)
      .lean();

    // Normalise _id → id for frontend compatibility
    return logs.map(l => ({ ...l, id: l._id.toString() }));
  } catch (err) {
    console.error('[MongoDB] getSymptomHistory error:', err.message);
    return [];
  }
};

module.exports = { getClinicsBySpecialty, saveSymptomLog, getSymptomHistory };
