// backend/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// mount auth routes under /api/auth
app.use('/api/auth', authRoutes);
// mount posts routes
app.use('/api/posts', postsRoutes);

// public sample data
app.get('/', (req, res) => {
  res.json([
    { id: '1', title: 'Book Review: The Name of the Wind' },
    { id: '2', title: 'Game Review: Pokemon Brilliant Diamond' },
    { id: '3', title: 'Show Review: Alice in Borderland' }
  ]);
});

app.get('/healthz', (req, res) => res.status(200).send('ok'));

// Mongoose connect with retry
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/mydb';
const connectWithRetry = () => {
  console.log('Attempting MongoDB connection...');
  mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
      console.error('MongoDB connection error, retrying in 3s:', err.message);
      setTimeout(connectWithRetry, 3000);
    });
};

connectWithRetry();

app.listen(PORT, () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
