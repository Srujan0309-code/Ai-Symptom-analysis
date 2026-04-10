const express = require('express');
const router = express.Router();
const { getSymptomHistory } = require('../services/supabaseService');

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const history = await getSymptomHistory(userId);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
