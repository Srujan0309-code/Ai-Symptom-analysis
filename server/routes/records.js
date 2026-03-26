const express = require('express');
const Record = require('../models/Record');
const router = express.Router();
// Middleware to protect routes (can be refined later)
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all patient records
// @route   GET /api/records
router.get('/', async (req, res) => {
  try {
    const records = await Record.find({ patientId: req.query.patientId });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new record
// @route   POST /api/records
router.post('/', async (req, res) => {
  const { patientId, title, category, doctorName, notes } = req.body;

  try {
    const record = await Record.create({
      patientId,
      title,
      category,
      doctorName,
      notes,
    });
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a record
// @route   PUT /api/records/:id
router.put('/:id', async (req, res) => {
  try {
    const record = await Record.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a record
// @route   DELETE /api/records/:id
router.delete('/:id', async (req, res) => {
  try {
    await Record.findByIdAndDelete(req.params.id);
    res.json({ message: 'Record removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
