const mongoose = require('mongoose');

const quizSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  subtopic: {
    type: String,
    required: true,
    trim: true
  },
  questions: [{
    questionId: String,
    question: String,
    options: [String],
    correctAnswer: Number,
    explanation: String
  }],
  userAnswers: {
    type: Map,
    of: Number,
    default: new Map()
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number, // in seconds
    required: true,
    default: 300 // 5 minutes
  },
  timeRemaining: {
    type: Number, // in seconds
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  isSubmitted: {
    type: Boolean,
    default: false
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  submissionReason: {
    type: String,
    enum: ['manual', 'timeout', 'tab_switch', 'browser_close'],
    default: 'manual'
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  tabSwitchCount: {
    type: Number,
    default: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better performance
quizSessionSchema.index({ sessionId: 1 });
quizSessionSchema.index({ category: 1, subtopic: 1 });
quizSessionSchema.index({ startTime: 1 });
quizSessionSchema.index({ isCompleted: 1 });

// Auto-expire sessions after 24 hours
quizSessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('QuizSession', quizSessionSchema);
