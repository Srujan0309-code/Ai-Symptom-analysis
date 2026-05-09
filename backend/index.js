const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const analyzeRoutes = require('./routes/analyze');
const clinicRoutes = require('./routes/clinics');
const historyRoutes = require('./routes/history');
const reportRoutes = require('./routes/reports');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/analyze', analyzeRoutes);
app.use('/api/clinics', clinicRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/reports', reportRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`MediRoute AI server running on port ${PORT}`);
});

module.exports = app;
