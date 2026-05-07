const admin = require('firebase-admin');
let serviceAccount;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    serviceAccount = require('./firebase-service-account.json');
  }
} catch (error) {
  console.warn("Firebase Service Account not found or invalid. Auth features may not work.");
  // Export a mock or null if it's not strictly required for startup
  serviceAccount = null;
}

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

module.exports = admin;
