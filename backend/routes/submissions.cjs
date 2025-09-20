const express = require('express');
const router = express.Router();
const QuizSession = require('../models/QuizSession.cjs');
const QuizResult = require('../models/QuizResult.cjs');

// POST /api/submissions/submit - Submit quiz and calculate results
router.post('/submit', async (req, res) => {
  try {
    const { sessionId, submissionReason = 'manual', answers: submittedAnswers, questions: quizQuestions, userId, userEmail } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required'
      });
    }
    
    let session = await QuizSession.findOne({ sessionId });
    
    // If session not found and it's a temporary session, create a minimal session record
    if (!session && sessionId.startsWith('temp-')) {
      console.log('Creating temporary session record for:', sessionId);
      
      // Extract user info from the submission if available
      const userId = quizQuestions && quizQuestions.length > 0 ? 
        (quizQuestions[0].category ? null : null) : null; // We'll get this from the request
      
      session = new QuizSession({
        sessionId,
        userId: userId || null,
        userEmail: userEmail || null,
        category: quizQuestions && quizQuestions.length > 0 ? quizQuestions[0].category : 'Unknown',
        subtopic: quizQuestions && quizQuestions.length > 0 ? quizQuestions[0].subtopic : 'Unknown',
        questions: [],
        duration: 300,
        timeRemaining: 0,
        totalQuestions: quizQuestions ? quizQuestions.length : 0,
        startTime: new Date(Date.now() - 300000), // 5 minutes ago
        isCompleted: false,
        isSubmitted: false
      });
      
      await session.save();
      console.log('Temporary session created');
    }
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Quiz session not found'
      });
    }
    
    if (session.isSubmitted) {
      // Return existing results if already submitted
      const existingResult = await QuizResult.findOne({ sessionId });
      if (existingResult) {
        return res.json({
          success: true,
          data: {
            sessionId: existingResult.sessionId,
            score: existingResult.score,
            correctAnswers: existingResult.correctAnswers,
            totalQuestions: existingResult.totalQuestions,
            timeTaken: existingResult.timeTaken,
            submissionReason: existingResult.submissionReason,
            performance: existingResult.performance,
            answers: existingResult.answers
          }
        });
      }
    }
    
    // Calculate results
    let correctAnswers = 0;
    const answers = [];
    const timeTaken = Math.floor((Date.now() - session.startTime) / 1000);
    
    // Use submitted questions and answers for calculation
    if (quizQuestions && quizQuestions.length > 0 && submittedAnswers) {
      // Calculate based on submitted quiz data (Gemini-powered quizzes)
      quizQuestions.forEach(question => {
        const userAnswer = submittedAnswers[question.id];
        const isCorrect = userAnswer === question.correctAnswer;
        
        if (isCorrect) {
          correctAnswers++;
        }
        
        answers.push({
          questionId: question.id,
          selectedAnswer: userAnswer !== undefined ? userAnswer : -1,
          correctAnswer: question.correctAnswer,
          isCorrect,
          question: question.question,
          options: question.options,
          explanation: question.explanation || 'No explanation provided'
        });
      });
      
      // Update session with actual questions for future reference
      session.questions = quizQuestions.map(q => ({
        questionId: q.id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || 'No explanation provided'
      }));
      session.totalQuestions = quizQuestions.length;
      
    } else if (session.questions && session.questions.length > 0) {
      // Fallback to session-stored questions (legacy approach)
      session.questions.forEach(question => {
        const userAnswer = session.userAnswers.get(question.questionId);
        const isCorrect = userAnswer === question.correctAnswer;
        
        if (isCorrect) {
          correctAnswers++;
        }
        
        answers.push({
          questionId: question.questionId,
          selectedAnswer: userAnswer !== undefined ? userAnswer : -1,
          correctAnswer: question.correctAnswer,
          isCorrect,
          question: question.question,
          options: question.options,
          explanation: question.explanation
        });
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'No quiz questions found. Please provide questions data.'
      });
    }
    
    const score = Math.round((correctAnswers / session.totalQuestions) * 100);
    
    // Update session
    session.isCompleted = true;
    session.isSubmitted = true;
    session.endTime = new Date();
    session.score = score;
    session.correctAnswers = correctAnswers;
    session.submissionReason = submissionReason;
    await session.save();
    
    // Create quiz result record
    const quizResult = new QuizResult({
      sessionId,
      userId: session.userId || null, // Include user ID from session
      userEmail: session.userEmail || null, // Include user email from session
      category: session.category,
      subtopic: session.subtopic,
      score,
      correctAnswers,
      totalQuestions: session.totalQuestions,
      timeTaken,
      submissionReason,
      answers,
      performance: {
        strengths: getStrengths(answers),
        improvements: getImprovements(answers)
      },
      metadata: {
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        tabSwitchCount: session.tabSwitchCount,
        deviceType: getDeviceType(session.userAgent),
        browserName: getBrowserName(session.userAgent)
      }
    });
    
    await quizResult.save();
    
    res.json({
      success: true,
      data: {
        sessionId,
        score,
        correctAnswers,
        totalQuestions: session.totalQuestions,
        timeTaken,
        submissionReason,
        performance: quizResult.performance,
        answers
      }
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit quiz',
      message: error.message
    });
  }
});

// GET /api/submissions/results/:sessionId - Get quiz results
router.get('/results/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const result = await QuizResult.findOne({ sessionId });
    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Quiz results not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        sessionId: result.sessionId,
        category: result.category,
        subtopic: result.subtopic,
        score: result.score,
        correctAnswers: result.correctAnswers,
        totalQuestions: result.totalQuestions,
        timeTaken: result.timeTaken,
        submissionReason: result.submissionReason,
        performance: result.performance,
        answers: result.answers,
        completedAt: result.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch results',
      message: error.message
    });
  }
});

// GET /api/submissions/analytics/:category/:subtopic - Get analytics for a specific subtopic
router.get('/analytics/:category/:subtopic', async (req, res) => {
  try {
    const { category, subtopic } = req.params;
    
    const results = await QuizResult.find({ 
      category: new RegExp(category, 'i'),
      subtopic: new RegExp(subtopic, 'i')
    }).sort({ createdAt: -1 }).limit(100);
    
    if (results.length === 0) {
      return res.json({
        success: true,
        data: {
          totalAttempts: 0,
          averageScore: 0,
          highestScore: 0,
          lowestScore: 0,
          passRate: 0,
          recentAttempts: []
        }
      });
    }
    
    const scores = results.map(r => r.score);
    const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);
    const passRate = Math.round((scores.filter(s => s >= 70).length / scores.length) * 100);
    
    res.json({
      success: true,
      data: {
        totalAttempts: results.length,
        averageScore,
        highestScore,
        lowestScore,
        passRate,
        recentAttempts: results.slice(0, 10).map(r => ({
          score: r.score,
          timeTaken: r.timeTaken,
          submissionReason: r.submissionReason,
          completedAt: r.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
      message: error.message
    });
  }
});

// Helper functions
function getStrengths(answers) {
  const correctAnswers = answers.filter(a => a.isCorrect);
  if (correctAnswers.length === 0) return ['Keep practicing!'];
  
  const strengths = [];
  if (correctAnswers.length / answers.length >= 0.8) {
    strengths.push('Excellent overall performance');
  }
  if (correctAnswers.length / answers.length >= 0.6) {
    strengths.push('Good understanding of concepts');
  }
  
  return strengths.length > 0 ? strengths : ['Shows potential for improvement'];
}

function getImprovements(answers) {
  const incorrectAnswers = answers.filter(a => !a.isCorrect);
  if (incorrectAnswers.length === 0) return ['Perfect performance!'];
  
  const improvements = [];
  if (incorrectAnswers.length / answers.length >= 0.5) {
    improvements.push('Review fundamental concepts');
  }
  if (incorrectAnswers.length >= 3) {
    improvements.push('Practice more questions');
  }
  
  return improvements.length > 0 ? improvements : ['Minor areas for improvement'];
}

function getDeviceType(userAgent) {
  if (!userAgent) return 'unknown';
  if (/Mobile|Android|iPhone|iPad/.test(userAgent)) return 'mobile';
  if (/Tablet|iPad/.test(userAgent)) return 'tablet';
  return 'desktop';
}

function getBrowserName(userAgent) {
  if (!userAgent) return 'unknown';
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  return 'other';
}

module.exports = router;
