const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(helmet());
// CORS configuration for both development and production
const allowedOrigins = [
  // Development origins
  'http://localhost:5173', 
  'http://localhost:5174', 
  'http://localhost:5175', 
  'http://127.0.0.1:5173', 
  'http://127.0.0.1:5174', 
  'http://127.0.0.1:5175', 
  'http://localhost:3000',
  // Production origins (replace with your actual Vercel domain)
  process.env.FRONTEND_URL || 'https://quiz-app-cyan-two-23.vercel.app',
  'https://quiz-app-cyan-two-23.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    // Primary: Try MongoDB Atlas (Cloud) or custom URI
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quizapp';
    const isAtlas = mongoUri.includes('mongodb+srv://');
    
    console.log(`Attempting to connect to: ${isAtlas ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB'}`);
    console.log('URI:', mongoUri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in log
    
    const connectionOptions = {
      // Atlas-specific optimizations
      ...(isAtlas && {
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        bufferCommands: false, // Disable mongoose buffering
      })
    };
    
    await mongoose.connect(mongoUri, connectionOptions);
    console.log(`✅ MongoDB connected successfully ${isAtlas ? '(Cloud Atlas)' : '(Local)'}`);
    
    // Log database name
    const dbName = mongoose.connection.db.databaseName;
    console.log(`📊 Database: ${dbName}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    
    // Only fallback to local if we were trying Atlas
    if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('mongodb+srv://')) {
      console.log('🔄 Falling back to local MongoDB...');
      
      try {
        await mongoose.connect('mongodb://localhost:27017/quizapp');
        console.log('✅ Connected to local MongoDB successfully (fallback)');
      } catch (localError) {
        console.error('❌ Local MongoDB connection failed:', localError.message);
        console.log('💡 Please check your .env file or start local MongoDB');
        console.log('💡 For Atlas: Verify your connection string, username, password, and IP whitelist');
        process.exit(1);
      }
    } else {
      console.log('💡 Please check your MongoDB connection or .env configuration');
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