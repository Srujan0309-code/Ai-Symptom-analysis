const express = require('express');
const router = express.Router();
const { analyzeSymptoms } = require('../services/aiService');
const { saveSymptomLog } = require('../services/supabaseService');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  const { symptoms, language } = req.body;
  const userId = req.user.uid;

  if (!symptoms) {
    return res.status(400).json({ error: 'Symptoms are required' });
  }

  try {
    const analysis = await analyzeSymptoms(symptoms, language);
    
    // Save to history asynchronously
    saveSymptomLog({
      user_id: userId,
      symptoms,
      result: analysis,
      urgency: analysis.urgency,
      language: language || 'en'
    });

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
