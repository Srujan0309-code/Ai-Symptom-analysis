const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.warn('[MongoDB] MONGODB_URI not set — skipping connection.');
      return;
    }

    await mongoose.connect(uri, {
      dbName: 'mediroute',
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log('[MongoDB] Connected successfully ✅');
  } catch (err) {
    console.error('[MongoDB] Connection failed:', err.message);
  }
};

module.exports = connectDB;
