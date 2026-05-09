const express = require('express');
const router = express.Router();
const { analyzeSymptoms } = require('../services/aiService');
const { saveSymptomLog } = require('../services/supabaseService');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  const { symptoms, language } = req.body;
  const userId = req.user?.uid || 'anonymous';

  console.log('[ANALYZE] Request received:', { symptoms: symptoms?.substring(0, 50), userId, language });

  if (!symptoms) {
    return res.status(400).json({ error: 'Symptoms are required' });
  }

  try {
    const analysis = await analyzeSymptoms(symptoms, language);
    console.log('[ANALYZE] Success:', { urgency: analysis.urgency, category: analysis.category });
    
    // Save to history asynchronously (don't block response)
    try {
      saveSymptomLog({
        user_id: userId,
        symptoms,
        result: analysis,
        urgency: analysis.urgency,
        language: language || 'en'
      });
    } catch (logErr) {
      console.warn('[ANALYZE] Failed to save log (non-blocking):', logErr.message);
    }

    res.json(analysis);
  } catch (error) {
    console.error('[ANALYZE] Error:', error.message, error.stack);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

