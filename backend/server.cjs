const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5175', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    // Fallback to local MongoDB if Atlas fails
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quizapp';
    console.log('Attempting to connect to:', mongoUri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in log
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Falling back to local MongoDB...');
    
    try {
      await mongoose.connect('mongodb://localhost:27017/quizapp', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to local MongoDB successfully');
    } catch (localError) {
      console.error('Local MongoDB connection failed:', localError);
      console.log('Please check your .env file or start local MongoDB');
      process.exit(1);
    }
  }
};

// Import routes
const quizRoutes = require('./routes/quiz.cjs');
const categoryRoutes = require('./routes/categories.cjs');
const submissionRoutes = require('./routes/submissions.cjs');
const questionsRoutes = require('./routes/questions.cjs'); // New Gemini-powered routes
const userAnalyticsRoutes = require('./routes/userAnalytics.cjs'); // User performance tracking

// Routes
app.use('/api/quiz', quizRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/questions', questionsRoutes); // New endpoint for dynamic questions
app.use('/api/user-analytics', userAnalyticsRoutes); // User performance tracking

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Quiz App API is running',
    features: {
      geminiIntegration: !!process.env.GEMINI_API_KEY,
      mongodb: mongoose.connection.readyState === 1
    },
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`Gemini API integration: ${process.env.GEMINI_API_KEY ? 'Enabled' : 'Disabled'}`);
  });
};

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

module.exports = app;