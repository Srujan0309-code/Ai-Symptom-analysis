const express = require('express');
const router = express.Router();
const { analyzeSymptoms } = require('../services/aiService');
const { saveSymptomLog } = require('../services/supabaseService');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  const { symptoms, language, imageBase64, doctorChat, doctorName, doctorSpecialty, conversationHistory } = req.body;
  const userId = req.user?.uid || 'anonymous';

  // ── Doctor Chat Mode ─────────────────────────────────────────────────────
  if (doctorChat) {
    try {
      const Groq = require('groq-sdk');
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

      const history = (conversationHistory || []).slice(-6).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const reply = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are ${doctorName || 'a doctor'}, a licensed ${doctorSpecialty || 'General Physician'}. 
Respond as a caring, professional doctor in a telemedicine consultation. 
Ask focused follow-up questions. Give practical, evidence-based advice. 
Keep responses concise (2-4 sentences). 
Always remind the patient to visit in-person for definitive diagnosis. 
Never prescribe specific medication dosages.`,
          },
          ...history,
          { role: 'user', content: symptoms },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.4,
        max_tokens: 200,
      });

      return res.json({
        doctorReply: reply.choices[0]?.message?.content || 'Could you elaborate more on your symptoms?',
      });
    } catch (err) {
      console.error('[DOCTOR CHAT] Error:', err.message);
      return res.json({ doctorReply: 'Thank you for sharing that. Could you tell me more about when these symptoms started?' });
    }
  }

  // ── Normal Symptom Analysis Mode ─────────────────────────────────────────
  console.log('[ANALYZE] Request received:', { symptoms: symptoms?.substring(0, 50), userId, language, hasImage: !!imageBase64 });

  if (!symptoms) {
    return res.status(400).json({ error: 'Symptoms are required' });
  }

  try {
    const analysis = await analyzeSymptoms(symptoms, language, imageBase64);
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

