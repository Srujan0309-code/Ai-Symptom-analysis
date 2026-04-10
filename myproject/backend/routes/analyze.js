const express = require('express');
const router = express.Router();
const { analyzeSymptoms } = require('../services/aiService');
const { saveSymptomLog } = require('../services/supabaseService');

router.post('/', async (req, res) => {
  const { symptoms, userId, language } = req.body;

  if (!symptoms) {
    return res.status(400).json({ error: 'Symptoms are required' });
  }

  try {
    const analysis = await analyzeSymptoms(symptoms, language);
    
    // Save to history asynchronously
    if (userId) {
      saveSymptomLog({
        user_id: userId,
        symptoms,
        result: analysis,
        urgency: analysis.urgency,
        language: language || 'en'
      });
    }

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
