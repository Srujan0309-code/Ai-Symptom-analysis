const express = require('express');
const router = express.Router();
const { getSymptomHistory } = require('../services/supabaseService');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.uid; // Provided by Firebase Admin

  try {
    const history = await getSymptomHistory(userId);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
