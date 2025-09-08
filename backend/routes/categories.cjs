const express = require('express');
const router = express.Router();
const Category = require('../models/Category.cjs');

// GET /api/categories - Get all categories with subtopic counts
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).select('-__v');
    
    // Transform data to match frontend format
    const categoriesData = {};
    categories.forEach(category => {
      const subtopics = {};
      
      // Convert Map to object and add question counts
      for (const [key, subtopic] of category.subtopics) {
        subtopics[key] = {
          name: subtopic.name,
          questions: subtopic.questions,
          questionCount: subtopic.questions.length
        };
      }
      
      categoriesData[category.key] = {
        name: category.name,
        color: category.color,
        icon: category.icon,
        description: category.description,
        subtopics: subtopics,
        subtopicCount: Object.keys(subtopics).length
      };
    });
    
    res.json({
      success: true,
      data: categoriesData
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
      message: error.message
    });
  }
});

// GET /api/categories/:categoryKey - Get specific category with all subtopics
router.get('/:categoryKey', async (req, res) => {
  try {
    const { categoryKey } = req.params;
    const category = await Category.findOne({ 
      key: categoryKey.toLowerCase(), 
      isActive: true 
    }).select('-__v');
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    // Transform subtopics Map to object
    const subtopics = {};
    for (const [key, subtopic] of category.subtopics) {
      subtopics[key] = {
        name: subtopic.name,
        questions: subtopic.questions,
        questionCount: subtopic.questions.length
      };
    }
    
    res.json({
      success: true,
      data: {
        name: category.name,
        color: category.color,
        icon: category.icon,
        description: category.description,
        subtopics: subtopics
      }
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category',
      message: error.message
    });
  }
});

// GET /api/categories/:categoryKey/subtopics/:subtopicKey - Get specific subtopic questions
router.get('/:categoryKey/subtopics/:subtopicKey', async (req, res) => {
  try {
    const { categoryKey, subtopicKey } = req.params;
    const category = await Category.findOne({ 
      key: categoryKey.toLowerCase(), 
      isActive: true 
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    const subtopic = category.subtopics.get(subtopicKey);
    if (!subtopic) {
      return res.status(404).json({
        success: false,
        error: 'Subtopic not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        name: subtopic.name,
        questions: subtopic.questions,
        questionCount: subtopic.questions.length,
        category: category.name
      }
    });
  } catch (error) {
    console.error('Error fetching subtopic:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subtopic',
      message: error.message
    });
  }
});

module.exports = router;
