const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Category = require('../models/Category.cjs');
const QuizSession = require('../models/QuizSession.cjs');

// POST /api/quiz/start - Start a new quiz session
router.post('/start', async (req, res) => {
  try {
    const { category, subtopic, duration = 300 } = req.body;
    
    if (!category || !subtopic) {
      return res.status(400).json({
        success: false,
        error: 'Category and subtopic are required'
      });
    }
    
    // Find the category and subtopic
    const categoryDoc = await Category.findOne({ 
      key: category.toLowerCase(), 
      isActive: true 
    });
    
    if (!categoryDoc) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    const subtopicData = categoryDoc.subtopics.get(subtopic);
    if (!subtopicData) {
      return res.status(404).json({
        success: false,
        error: 'Subtopic not found'
      });
    }
    
    if (subtopicData.questions.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No questions available for this subtopic'
      });
    }
    
    // Create new quiz session
    const sessionId = uuidv4();
    const quizSession = new QuizSession({
      sessionId,
      category: categoryDoc.name,
      subtopic: subtopicData.name,
      questions: subtopicData.questions.map(q => ({
        questionId: q.id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation
      })),
      duration,
      timeRemaining: duration,
      totalQuestions: subtopicData.questions.length,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    await quizSession.save();
    
    // Return quiz data without correct answers
    const quizData = {
      sessionId,
      category: categoryDoc.name,
      subtopic: subtopicData.name,
      questions: subtopicData.questions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options
      })),
      duration,
      totalQuestions: subtopicData.questions.length,
      startTime: quizSession.startTime
    };
    
    res.json({
      success: true,
      data: quizData
    });
  } catch (error) {
    console.error('Error starting quiz:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start quiz',
      message: error.message
    });
  }
});

// GET /api/quiz/session/:sessionId - Get quiz session details
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await QuizSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Quiz session not found'
      });
    }
    
    // Calculate current time remaining
    const elapsed = Math.floor((Date.now() - session.startTime) / 1000);
    const timeRemaining = Math.max(0, session.duration - elapsed);
    
    // Update time remaining in database
    session.timeRemaining = timeRemaining;
    session.lastActivity = new Date();
    await session.save();
    
    // Return session data without correct answers
    const sessionData = {
      sessionId: session.sessionId,
      category: session.category,
      subtopic: session.subtopic,
      questions: session.questions.map(q => ({
        id: q.questionId,
        question: q.question,
        options: q.options
      })),
      userAnswers: Object.fromEntries(session.userAnswers),
      timeRemaining,
      totalQuestions: session.totalQuestions,
      isCompleted: session.isCompleted,
      isSubmitted: session.isSubmitted
    };
    
    res.json({
      success: true,
      data: sessionData
    });
  } catch (error) {
    console.error('Error fetching quiz session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch quiz session',
      message: error.message
    });
  }
});

// PUT /api/quiz/session/:sessionId/answer - Save user answer
router.put('/session/:sessionId/answer', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { questionId, answer } = req.body;
    
    if (questionId === undefined || answer === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Question ID and answer are required'
      });
    }
    
    const session = await QuizSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Quiz session not found'
      });
    }
    
    if (session.isCompleted || session.isSubmitted) {
      return res.status(400).json({
        success: false,
        error: 'Quiz session is already completed'
      });
    }
    
    // Check if time is up
    const elapsed = Math.floor((Date.now() - session.startTime) / 1000);
    if (elapsed >= session.duration) {
      return res.status(400).json({
        success: false,
        error: 'Quiz time has expired'
      });
    }
    
    // Save the answer
    session.userAnswers.set(questionId, answer);
    session.lastActivity = new Date();
    await session.save();
    
    res.json({
      success: true,
      message: 'Answer saved successfully'
    });
  } catch (error) {
    console.error('Error saving answer:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save answer',
      message: error.message
    });
  }
});

// POST /api/quiz/session/:sessionId/tab-switch - Record tab switch event
router.post('/session/:sessionId/tab-switch', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await QuizSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Quiz session not found'
      });
    }
    
    if (session.isCompleted || session.isSubmitted) {
      return res.json({
        success: true,
        message: 'Quiz already completed'
      });
    }
    
    // Increment tab switch count and auto-submit
    session.tabSwitchCount += 1;
    session.isCompleted = true;
    session.isSubmitted = true;
    session.endTime = new Date();
    session.submissionReason = 'tab_switch';
    
    await session.save();
    
    res.json({
      success: true,
      message: 'Quiz auto-submitted due to tab switch',
      autoSubmitted: true
    });
  } catch (error) {
    console.error('Error recording tab switch:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record tab switch',
      message: error.message
    });
  }
});

module.exports = router;
