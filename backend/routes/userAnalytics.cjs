const express = require('express');
const router = express.Router();
const QuizResult = require('../models/QuizResult.cjs');
const QuizSession = require('../models/QuizSession.cjs');

// GET /api/user-analytics/history/:userId - Get user's quiz history
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, category, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Build query filter
    const filter = { userId };
    if (category) {
      filter.category = new RegExp(category, 'i');
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get paginated results
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const results = await QuizResult.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('sessionId category subtopic score correctAnswers totalQuestions timeTaken submissionReason performance.grade createdAt');

    // Get total count for pagination
    const totalResults = await QuizResult.countDocuments(filter);
    const totalPages = Math.ceil(totalResults / parseInt(limit));

    res.json({
      success: true,
      data: {
        results,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalResults,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user history',
      message: error.message
    });
  }
});

// GET /api/user-analytics/stats/:userId - Get user's overall statistics
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Get all user results
    const results = await QuizResult.find({ userId }).sort({ createdAt: -1 });
    
    if (results.length === 0) {
      return res.json({
        success: true,
        data: {
          totalQuizzes: 0,
          averageScore: 0,
          highestScore: 0,
          lowestScore: 0,
          totalTimeSpent: 0,
          averageTimePerQuiz: 0,
          gradeDistribution: {},
          categoryPerformance: {},
          recentActivity: [],
          improvementTrend: []
        }
      });
    }

    // Calculate basic statistics
    const scores = results.map(r => r.score);
    const totalQuizzes = results.length;
    const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);
    const totalTimeSpent = results.reduce((total, r) => total + r.timeTaken, 0);
    const averageTimePerQuiz = Math.round(totalTimeSpent / totalQuizzes);

    // Grade distribution
    const gradeDistribution = {};
    results.forEach(r => {
      const grade = r.performance.grade;
      gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1;
    });

    // Category performance
    const categoryPerformance = {};
    results.forEach(r => {
      if (!categoryPerformance[r.category]) {
        categoryPerformance[r.category] = {
          totalQuizzes: 0,
          totalScore: 0,
          averageScore: 0,
          bestScore: 0
        };
      }
      categoryPerformance[r.category].totalQuizzes++;
      categoryPerformance[r.category].totalScore += r.score;
      categoryPerformance[r.category].bestScore = Math.max(categoryPerformance[r.category].bestScore, r.score);
    });

    // Calculate average scores for categories
    Object.keys(categoryPerformance).forEach(category => {
      const perf = categoryPerformance[category];
      perf.averageScore = Math.round(perf.totalScore / perf.totalQuizzes);
    });

    // Recent activity (last 10 quizzes)
    const recentActivity = results.slice(0, 10).map(r => ({
      category: r.category,
      subtopic: r.subtopic,
      score: r.score,
      grade: r.performance.grade,
      timeTaken: r.timeTaken,
      completedAt: r.createdAt
    }));

    // Improvement trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentResults = results.filter(r => r.createdAt >= thirtyDaysAgo);
    
    const improvementTrend = [];
    if (recentResults.length >= 2) {
      const firstHalf = recentResults.slice(Math.floor(recentResults.length / 2));
      const secondHalf = recentResults.slice(0, Math.floor(recentResults.length / 2));
      
      const firstHalfAvg = firstHalf.reduce((sum, r) => sum + r.score, 0) / firstHalf.length;
      const secondHalfAvg = secondHalf.reduce((sum, r) => sum + r.score, 0) / secondHalf.length;
      
      improvementTrend.push({
        period: 'Earlier',
        averageScore: Math.round(firstHalfAvg)
      });
      improvementTrend.push({
        period: 'Recent',
        averageScore: Math.round(secondHalfAvg)
      });
    }

    res.json({
      success: true,
      data: {
        totalQuizzes,
        averageScore,
        highestScore,
        lowestScore,
        totalTimeSpent,
        averageTimePerQuiz,
        gradeDistribution,
        categoryPerformance,
        recentActivity,
        improvementTrend
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user statistics',
      message: error.message
    });
  }
});

// GET /api/user-analytics/performance/:userId/:category - Get user performance for specific category
router.get('/performance/:userId/:category', async (req, res) => {
  try {
    const { userId, category } = req.params;
    
    if (!userId || !category) {
      return res.status(400).json({
        success: false,
        error: 'User ID and category are required'
      });
    }

    const results = await QuizResult.find({ 
      userId, 
      category: new RegExp(category, 'i') 
    }).sort({ createdAt: -1 });

    if (results.length === 0) {
      return res.json({
        success: true,
        data: {
          category,
          totalAttempts: 0,
          averageScore: 0,
          bestScore: 0,
          subtopicPerformance: {},
          progressOverTime: [],
          commonMistakes: [],
          strengths: []
        }
      });
    }

    // Basic stats
    const scores = results.map(r => r.score);
    const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const bestScore = Math.max(...scores);

    // Subtopic performance
    const subtopicPerformance = {};
    results.forEach(r => {
      if (!subtopicPerformance[r.subtopic]) {
        subtopicPerformance[r.subtopic] = {
          attempts: 0,
          totalScore: 0,
          averageScore: 0,
          bestScore: 0
        };
      }
      const perf = subtopicPerformance[r.subtopic];
      perf.attempts++;
      perf.totalScore += r.score;
      perf.bestScore = Math.max(perf.bestScore, r.score);
    });

    // Calculate averages
    Object.keys(subtopicPerformance).forEach(subtopic => {
      const perf = subtopicPerformance[subtopic];
      perf.averageScore = Math.round(perf.totalScore / perf.attempts);
    });

    // Progress over time (last 10 attempts)
    const progressOverTime = results.slice(0, 10).reverse().map((r, index) => ({
      attempt: index + 1,
      score: r.score,
      subtopic: r.subtopic,
      date: r.createdAt
    }));

    // Collect strengths and improvements
    const allStrengths = [];
    const allImprovements = [];
    results.forEach(r => {
      if (r.performance.strengths) allStrengths.push(...r.performance.strengths);
      if (r.performance.improvements) allImprovements.push(...r.performance.improvements);
    });

    // Get most common strengths and improvements
    const strengthCounts = {};
    const improvementCounts = {};
    
    allStrengths.forEach(strength => {
      strengthCounts[strength] = (strengthCounts[strength] || 0) + 1;
    });
    
    allImprovements.forEach(improvement => {
      improvementCounts[improvement] = (improvementCounts[improvement] || 0) + 1;
    });

    const topStrengths = Object.entries(strengthCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([strength]) => strength);

    const commonMistakes = Object.entries(improvementCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([improvement]) => improvement);

    res.json({
      success: true,
      data: {
        category,
        totalAttempts: results.length,
        averageScore,
        bestScore,
        subtopicPerformance,
        progressOverTime,
        commonMistakes,
        strengths: topStrengths
      }
    });
  } catch (error) {
    console.error('Error fetching category performance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category performance',
      message: error.message
    });
  }
});

// GET /api/user-analytics/leaderboard/:category/:subtopic - Get leaderboard for category/subtopic
router.get('/leaderboard/:category/:subtopic', async (req, res) => {
  try {
    const { category, subtopic } = req.params;
    const { limit = 10 } = req.query;

    // Get best scores for each user in this category/subtopic
    const pipeline = [
      {
        $match: {
          category: new RegExp(category, 'i'),
          subtopic: new RegExp(subtopic, 'i'),
          userId: { $ne: null } // Only include users with IDs
        }
      },
      {
        $group: {
          _id: '$userId',
          bestScore: { $max: '$score' },
          totalAttempts: { $sum: 1 },
          averageScore: { $avg: '$score' },
          userEmail: { $first: '$userEmail' },
          lastAttempt: { $max: '$createdAt' }
        }
      },
      {
        $sort: { bestScore: -1, averageScore: -1 }
      },
      {
        $limit: parseInt(limit)
      }
    ];

    const leaderboard = await QuizResult.aggregate(pipeline);

    // Add rank to each entry
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      rank: index + 1,
      userId: entry._id,
      userEmail: entry.userEmail,
      bestScore: entry.bestScore,
      averageScore: Math.round(entry.averageScore),
      totalAttempts: entry.totalAttempts,
      lastAttempt: entry.lastAttempt
    }));

    res.json({
      success: true,
      data: {
        category,
        subtopic,
        leaderboard: rankedLeaderboard
      }
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard',
      message: error.message
    });
  }
});

module.exports = router;
