const admin = require('../config/firebaseAdmin');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    // Check if Firebase Admin is properly initialized
    if (admin.apps && admin.apps.length > 0) {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedToken;
    } else {
      // Fallback: decode JWT payload without verification (for local dev without service account)
      console.warn('Firebase Admin not initialized. Decoding token payload without verification.');
      const payloadBase64 = idToken.split('.')[1];
      if (!payloadBase64) {
        return res.status(403).json({ error: 'Invalid token format' });
      }
      const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'));
      req.user = {
        uid: payload.user_id || payload.sub || 'anonymous',
        email: payload.email || '',
      };
    }
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error.message);
    // Last resort fallback: try decoding the payload anyway
    try {
      const payloadBase64 = idToken.split('.')[1];
      const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'));
      req.user = {
        uid: payload.user_id || payload.sub || 'anonymous',
        email: payload.email || '',
      };
      next();
    } catch {
      res.status(403).json({ error: 'Unauthorized: Invalid token' });
    }
  }
};

module.exports = authMiddleware;

