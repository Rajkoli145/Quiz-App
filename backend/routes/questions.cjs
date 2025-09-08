const express = require('express');
const router = express.Router();
const GeminiQuestionService = require('../services/geminiService.cjs');

const questionService = new GeminiQuestionService();

/**
 * GET /api/questions/:category/:subtopic
 * Get random questions for a quiz (20 questions from 40 generated)
 */
router.get('/:category/:subtopic', async (req, res) => {
  try {
    const { category, subtopic } = req.params;
    const count = parseInt(req.query.count) || 20;

    console.log(`Fetching ${count} random questions for ${category} - ${subtopic}`);

    const questions = await questionService.getRandomQuestions(category, subtopic, count);

    res.json({
      success: true,
      data: {
        category,
        subtopic,
        questions,
        totalQuestions: questions.length,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate questions',
      message: error.message
    });
  }
});

/**
 * POST /api/questions/generate
 * Generate and cache questions for a specific category/subtopic
 */
router.post('/generate', async (req, res) => {
  try {
    const { category, subtopic, count = 40 } = req.body;

    if (!category || !subtopic) {
      return res.status(400).json({
        success: false,
        error: 'Category and subtopic are required'
      });
    }

    console.log(`Generating ${count} questions for ${category} - ${subtopic}`);

    const questions = await questionService.generateQuestions(category, subtopic, count);

    res.json({
      success: true,
      data: {
        category,
        subtopic,
        questionsGenerated: questions.length,
        questions: questions.slice(0, 5), // Return first 5 as preview
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate questions',
      message: error.message
    });
  }
});

/**
 * GET /api/questions/categories
 * Get all available categories and subtopics
 */
router.get('/categories', (req, res) => {
  const categories = {
    Java: {
      name: 'Java',
      icon: '☕',
      color: 'from-orange-200 to-red-200',
      subtopics: [
        'Basics & Syntax',
        'Data Types & Variables',
        'Operators',
        'Control Flow',
        'Arrays',
        'Strings & StringBuilder',
        'Methods & Recursion',
        'OOP - Classes & Objects',
        'Constructors',
        'Inheritance',
        'Polymorphism',
        'Abstraction',
        'Encapsulation',
        'Interfaces',
        'Exception Handling',
        'Collections Framework',
        'Generics',
        'Multithreading & Concurrency',
        'File I/O',
        'Java 8 Features (Streams, Lambdas)'
      ]
    },
    C: {
      name: 'C',
      icon: '🔷',
      color: 'from-blue-200 to-indigo-200',
      subtopics: [
        'Basics & Syntax',
        'Data Types & Variables',
        'Operators',
        'Control Flow',
        'Functions & Recursion',
        'Arrays',
        'Strings & String Functions',
        'Pointers',
        'Structures & Unions',
        'Dynamic Memory Allocation',
        'File Handling',
        'Preprocessor Directives & Macros',
        'Bitwise Operators'
      ]
    },
    'C++': {
      name: 'C++',
      icon: '➕',
      color: 'from-purple-200 to-pink-200',
      subtopics: [
        'Basics & Syntax',
        'Data Types & Variables',
        'Operators',
        'Control Flow',
        'Functions & Recursion',
        'Arrays',
        'Strings & String Class',
        'Pointers & References',
        'Classes & Objects',
        'Constructors & Destructors',
        'Inheritance',
        'Polymorphism',
        'Encapsulation',
        'Abstraction',
        'Operator Overloading',
        'Function Overloading',
        'Friend Functions',
        'Templates',
        'STL (Vectors, Maps, Sets, Queues, Stacks)',
        'Exception Handling',
        'File Handling'
      ]
    },
    Python: {
      name: 'Python',
      icon: '🐍',
      color: 'from-green-200 to-teal-200',
      subtopics: [
        'Basics & Syntax',
        'Data Types & Variables',
        'Operators',
        'Control Flow',
        'Functions & Recursion',
        'Lists',
        'Tuples',
        'Strings',
        'Dictionaries',
        'Sets',
        'List Comprehensions',
        'Classes & Objects',
        'Inheritance',
        'Polymorphism',
        'Encapsulation',
        'Exception Handling',
        'File Handling',
        'Modules & Packages',
        'Iterators & Generators',
        'Decorators',
        'Lambda Functions',
        'Regular Expressions',
        'Python Libraries (NumPy, Pandas, Matplotlib)'
      ]
    }
  };

  res.json({
    success: true,
    data: categories
  });
});

/**
 * DELETE /api/questions/cache
 * Clear question cache
 */
router.delete('/cache', (req, res) => {
  try {
    const { category, subtopic } = req.query;
    
    questionService.clearCache(category, subtopic);
    
    res.json({
      success: true,
      message: category && subtopic 
        ? `Cache cleared for ${category} - ${subtopic}`
        : 'All cache cleared'
    });
    
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear cache',
      message: error.message
    });
  }
});

/**
 * GET /api/questions/cache/stats
 * Get cache statistics
 */
router.get('/cache/stats', (req, res) => {
  try {
    const stats = questionService.getCacheStats();
    
    res.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('Error getting cache stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get cache stats',
      message: error.message
    });
  }
});

module.exports = router;
