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

// MongoDB Connection for Serverless Environment
let isConnected = false;

const connectDB = async () => {
  // Check if already connected and connection is ready
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    // Disconnect if in a bad state
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    // Primary: Try MongoDB Atlas (Cloud) or custom URI
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quizapp';
    const isAtlas = mongoUri.includes('mongodb+srv://');
    
    console.log(`Attempting to connect to: ${isAtlas ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB'}`);
    console.log('URI:', mongoUri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in log
    
    const connectionOptions = {
      // Serverless-optimized settings
      maxPoolSize: 1, // Limit connection pool for serverless
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false, // Disable mongoose buffering for serverless
    };
    
    await mongoose.connect(mongoUri, connectionOptions);
    
    // Wait for connection to be fully ready
    await new Promise((resolve, reject) => {
      if (mongoose.connection.readyState === 1) {
        resolve();
      } else {
        mongoose.connection.once('connected', resolve);
        mongoose.connection.once('error', reject);
        setTimeout(() => reject(new Error('Connection timeout')), 10000);
      }
    });
    
    isConnected = true;
    console.log(`✅ MongoDB connected successfully ${isAtlas ? '(Cloud Atlas)' : '(Local)'}`);
    
    // Log database name
    const dbName = mongoose.connection.db.databaseName;
    console.log(`📊 Database: ${dbName}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    isConnected = false;
    throw error; // Re-throw for serverless error handling
  }
};

// Middleware to ensure DB connection for each request
const ensureDBConnection = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Database connection failed',
      message: error.message 
    });
  }
};

// Import routes
const quizRoutes = require('./routes/quiz.cjs');
const categoryRoutes = require('./routes/categories.cjs');
const submissionRoutes = require('./routes/submissions.cjs');
const questionsRoutes = require('./routes/questions.cjs'); // New Gemini-powered routes
const userAnalyticsRoutes = require('./routes/userAnalytics.cjs'); // User performance tracking

// Routes with DB connection middleware
app.use('/api/quiz', ensureDBConnection, quizRoutes);
app.use('/api/categories', ensureDBConnection, categoryRoutes);
app.use('/api/submissions', ensureDBConnection, submissionRoutes);
app.use('/api/questions', ensureDBConnection, questionsRoutes); // New endpoint for dynamic questions
app.use('/api/user-analytics', ensureDBConnection, userAnalyticsRoutes); // User performance tracking

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

// Start server (for local development)
const startServer = async () => {
  if (process.env.NODE_ENV !== 'production') {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`Gemini API integration: ${process.env.GEMINI_API_KEY ? 'Enabled' : 'Disabled'}`);
    });
  }
};

// Only start server if not in production (Vercel handles this)
if (process.env.NODE_ENV !== 'production') {
  startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

module.exports = app;