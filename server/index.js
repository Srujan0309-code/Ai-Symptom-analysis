const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected to Clinical Vault'))
  .catch(err => {
    console.error('MongoDB Connection Error:');
    console.error(err);
    process.exit(1);
  });
console.log('After DB connection call...');

// Routes placeholder
app.get('/', (req, res) => {
  res.send('Digital Health Vault API is running...');
});

// Import Routes
const authRoutes = require('./routes/auth');
const recordRoutes = require('./routes/records');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
