const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: [{
    type: String,
    required: true,
    trim: true
  }],
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  explanation: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  _id: false
});

const subtopicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  questions: [questionSchema]
}, {
  _id: false
});

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  key: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  color: {
    type: String,
    required: true,
    default: 'from-blue-200 to-indigo-200'
  },
  icon: {
    type: String,
    required: true,
    default: '📚'
  },
  description: {
    type: String,
    trim: true
  },
  subtopics: {
    type: Map,
    of: subtopicSchema,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
categorySchema.index({ key: 1 });
categorySchema.index({ name: 1 });
categorySchema.index({ isActive: 1 });

module.exports = mongoose.model('Category', categorySchema);
