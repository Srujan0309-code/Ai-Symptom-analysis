const express = require('express');
const router = express.Router();
const { getClinicsBySpecialty } = require('../services/supabaseService');

router.get('/', async (req, res) => {
  const { specialty } = req.query;

  try {
    const clinics = await getClinicsBySpecialty(specialty);
    res.json(clinics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
