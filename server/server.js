const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/students', require('./src/routes/students'));
app.use('/api/internships', require('./src/routes/internships'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
