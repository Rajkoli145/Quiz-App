#!/usr/bin/env node

/**
 * View Atlas Data Script
 * Quick way to see your quiz data in MongoDB Atlas
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const QuizResult = require('../backend/models/QuizResult.cjs');
const QuizSession = require('../backend/models/QuizSession.cjs');
const Category = require('../backend/models/Category.cjs');

async function viewAtlasData() {
  console.log('🔍 Viewing Quiz App Data in MongoDB Atlas\n');
  
  try {
    // Connect to Atlas
    const atlasUri = process.env.MONGODB_URI;
    if (!atlasUri || !atlasUri.includes('mongodb+srv://')) {
      throw new Error('Please ensure MongoDB Atlas URI is set in .env file');
    }
    
    console.log('☁️  Connecting to MongoDB Atlas...');
    await mongoose.connect(atlasUri);
    console.log('✅ Connected to Atlas\n');
    
    // View Categories
    console.log('📚 CATEGORIES:');
    console.log('=' .repeat(50));
    const categories = await Category.find({}).limit(10);
    if (categories.length > 0) {
      categories.forEach((cat, index) => {
        console.log(`${index + 1}. ${cat.name}`);
        if (cat.subtopics && cat.subtopics.length > 0) {
          cat.subtopics.forEach((sub, subIndex) => {
            console.log(`   ${subIndex + 1}. ${sub.name} (${sub.questions?.length || 0} questions)`);
          });
        }
        console.log('');
      });
    } else {
      console.log('No categories found');
    }
    
    // View Quiz Results
    console.log('\n📊 QUIZ RESULTS:');
    console.log('=' .repeat(50));
    const results = await QuizResult.find({}).sort({ createdAt: -1 }).limit(10);
    if (results.length > 0) {
      results.forEach((result, index) => {
        console.log(`${index + 1}. Score: ${result.score}% | Category: ${result.category} | Subtopic: ${result.subtopic}`);
        console.log(`   Correct: ${result.correctAnswers}/${result.totalQuestions} | Time: ${Math.round(result.timeTaken/60)}min | Grade: ${result.performance?.grade || 'N/A'}`);
        console.log(`   Date: ${result.createdAt?.toLocaleDateString()} | User: ${result.userEmail || result.userId || 'Anonymous'}`);
        console.log('');
      });
    } else {
      console.log('No quiz results found');
    }
    
    // View Quiz Sessions
    console.log('\n🎯 QUIZ SESSIONS:');
    console.log('=' .repeat(50));
    const sessions = await QuizSession.find({}).sort({ createdAt: -1 }).limit(10);
    if (sessions.length > 0) {
      sessions.forEach((session, index) => {
        const status = session.isCompleted ? '✅ Completed' : session.isSubmitted ? '📤 Submitted' : '⏳ In Progress';
        console.log(`${index + 1}. ${status} | Category: ${session.category} | Subtopic: ${session.subtopic}`);
        console.log(`   Session ID: ${session.sessionId}`);
        console.log(`   Questions: ${session.totalQuestions} | Duration: ${Math.round(session.duration/60)}min`);
        if (session.score !== undefined) {
          console.log(`   Score: ${session.score}% (${session.correctAnswers}/${session.totalQuestions})`);
        }
        console.log(`   Started: ${session.startTime?.toLocaleString()}`);
        console.log('');
      });
    } else {
      console.log('No quiz sessions found');
    }
    
    // Summary
    const totalCategories = await Category.countDocuments();
    const totalResults = await QuizResult.countDocuments();
    const totalSessions = await QuizSession.countDocuments();
    
    console.log('\n📈 SUMMARY:');
    console.log('=' .repeat(50));
    console.log(`📚 Total Categories: ${totalCategories}`);
    console.log(`📊 Total Quiz Results: ${totalResults}`);
    console.log(`🎯 Total Quiz Sessions: ${totalSessions}`);
    
    console.log('\n🌍 Your quiz data is now stored globally in MongoDB Atlas!');
    console.log('🔗 View in Atlas Dashboard: https://cloud.mongodb.com');
    
  } catch (error) {
    console.error('\n❌ Error viewing data:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the viewer
viewAtlasData().catch(console.error);
