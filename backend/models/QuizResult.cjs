const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    ref: 'QuizSession'
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
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  correctAnswers: {
    type: Number,
    required: true,
    min: 0
  },
  totalQuestions: {
    type: Number,
    required: true,
    min: 1
  },
  timeTaken: {
    type: Number, // in seconds
    required: true
  },
  submissionReason: {
    type: String,
    enum: ['manual', 'timeout', 'tab_switch', 'browser_close'],
    required: true
  },
  answers: [{
    questionId: String,
    selectedAnswer: Number,
    correctAnswer: Number,
    isCorrect: Boolean,
    timeTaken: Number // time taken for this specific question
  }],
  performance: {
    grade: {
      type: String,
      enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F']
    },
    percentile: Number,
    strengths: [String],
    improvements: [String]
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    tabSwitchCount: Number,
    deviceType: String,
    browserName: String
  }
}, {
  timestamps: true
});

// Calculate grade based on score
quizResultSchema.pre('save', function(next) {
  if (this.score >= 95) this.performance.grade = 'A+';
  else if (this.score >= 90) this.performance.grade = 'A';
  else if (this.score >= 85) this.performance.grade = 'B+';
  else if (this.score >= 80) this.performance.grade = 'B';
  else if (this.score >= 75) this.performance.grade = 'C+';
  else if (this.score >= 70) this.performance.grade = 'C';
  else if (this.score >= 60) this.performance.grade = 'D';
  else this.performance.grade = 'F';
  
  next();
});

// Indexes for analytics and performance
quizResultSchema.index({ category: 1, subtopic: 1 });
quizResultSchema.index({ score: -1 });
quizResultSchema.index({ createdAt: -1 });
quizResultSchema.index({ sessionId: 1 });

module.exports = mongoose.model('QuizResult', quizResultSchema);
