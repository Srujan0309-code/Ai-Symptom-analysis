const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'dummy_key';

const supabase = createClient(supabaseUrl, supabaseKey);

// Mock data for clinics if DB is not setup or empty
const MOCK_CLINICS = [
  {
    id: '1',
    name: 'Apollo Hospital',
    address: 'Greams Road, Chennai',
    lat: 13.0658,
    lng: 80.2524,
    specialty: 'Cardiology',
    rating: 4.8,
    phone: '+91 44 2829 3333',
    wait_time_minutes: 15
  },
  {
    id: '2',
    name: 'Fortis Memorial Research Institute',
    address: 'Gurugram, Delhi NCR',
    lat: 28.4595,
    lng: 77.0266,
    specialty: 'General Physician',
    rating: 4.5,
    phone: '+91 124 4921 021',
    wait_time_minutes: 30
  },
  {
    id: '3',
    name: 'Max Super Speciality Hospital',
    address: 'Saket, New Delhi',
    lat: 28.5273,
    lng: 77.2111,
    specialty: 'Dermatology',
    rating: 4.7,
    phone: '+91 11 2651 5050',
    wait_time_minutes: 5
  },
  {
    id: '4',
    name: 'Manipal Hospital',
    address: 'HAL Old Airport Road, Bengaluru',
    lat: 12.9592,
    lng: 77.6444,
    specialty: 'Pediatrics',
    rating: 4.6,
    phone: '+91 80 2502 4444',
    wait_time_minutes: 45
  },
  {
    id: '5',
    name: 'City Care Clinic',
    address: 'Local Care Center',
    lat: 12.9716,
    lng: 77.5946,
    specialty: 'General Physician',
    rating: 4.2,
    phone: '+91 80 1234 5678',
    wait_time_minutes: 10
  }
];

const getClinicsBySpecialty = async (specialty) => {
  try {
    if (!process.env.SUPABASE_URL) {
      if (specialty) {
        return MOCK_CLINICS.filter(c => c.specialty.toLowerCase().includes(specialty.toLowerCase()));
      }
      return MOCK_CLINICS;
    }

    let query = supabase.from('clinics').select('*');
    if (specialty) {
      query = query.ilike('specialty', `%${specialty}%`);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    // Fallback to mock if data is empty
    return data.length > 0 ? data : MOCK_CLINICS;
  } catch (error) {
    console.error('Supabase getClinics error:', error);
    return MOCK_CLINICS;
  }
};

const saveSymptomLog = async (logData) => {
  try {
    if (!process.env.SUPABASE_URL) return { success: true, mock: true };
    
    const { data, error } = await supabase
      .from('symptom_logs')
      .insert([logData]);
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Supabase saveLog error:', error);
    return { success: false, error: error.message };
  }
};

const getSymptomHistory = async (userId) => {
  try {
    if (!process.env.SUPABASE_URL) return [];
    
    const { data, error } = await supabase
      .from('symptom_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Supabase getHistory error:', error);
    return [];
  }
};

module.exports = { getClinicsBySpecialty, saveSymptomLog, getSymptomHistory };
