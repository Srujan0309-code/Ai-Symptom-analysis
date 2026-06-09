const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const https = require('https');
const http = require('http');
const connectDB = require('./config/db');
const analyzeRoutes = require('./routes/analyze');
const clinicRoutes = require('./routes/clinics');
const historyRoutes = require('./routes/history');
const reportRoutes = require('./routes/reports');

dotenv.config();

// Connect to MongoDB Atlas
connectDB();

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

  // ── Keep-Alive Pinger ──────────────────────────────────────────────
  // Render free tier sleeps after 15 min of inactivity.
  // Ping self + frontend every 14 min to stay warm.
  const PING_TARGETS = [
    'https://mediroute-api-vw0l.onrender.com/health',
    'https://mediroute-web.onrender.com/',
  ];

  const ping = (url) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, (res) => {
      console.log(`[keep-alive] ${url} → ${res.statusCode}`);
      res.resume(); // discard body
    }).on('error', (err) => {
      console.warn(`[keep-alive] ping failed for ${url}: ${err.message}`);
    });
  };

  const INTERVAL_MS = 14 * 60 * 1000; // 14 minutes
  setInterval(() => {
    PING_TARGETS.forEach(ping);
  }, INTERVAL_MS);
  // ──────────────────────────────────────────────────────────────────
});

module.exports = app;
