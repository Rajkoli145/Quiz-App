#!/usr/bin/env node

/**
 * Data Migration Script: Local MongoDB → MongoDB Atlas
 * Migrates existing quiz data from local MongoDB to Atlas
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const QuizResult = require('../backend/models/QuizResult.cjs');
const QuizSession = require('../backend/models/QuizSession.cjs');
const Category = require('../backend/models/Category.cjs');

async function migrateData() {
  console.log('🔄 Starting data migration from Local MongoDB to Atlas...\n');
  
  let localConnection, atlasConnection;
  
  try {
    // Connect to local MongoDB
    console.log('📡 Connecting to local MongoDB...');
    localConnection = await mongoose.createConnection('mongodb://localhost:27017/quizapp', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to local MongoDB');
    
    // Connect to Atlas
    console.log('☁️  Connecting to MongoDB Atlas...');
    const atlasUri = process.env.MONGODB_URI;
    if (!atlasUri || !atlasUri.includes('mongodb+srv://')) {
      throw new Error('Please set up your MongoDB Atlas URI in .env file first');
    }
    
    atlasConnection = await mongoose.createConnection(atlasUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected to MongoDB Atlas');
    
    // Create models for both connections
    const LocalQuizResult = localConnection.model('QuizResult', QuizResult.schema);
    const LocalQuizSession = localConnection.model('QuizSession', QuizSession.schema);
    const LocalCategory = localConnection.model('Category', Category.schema);
    
    const AtlasQuizResult = atlasConnection.model('QuizResult', QuizResult.schema);
    const AtlasQuizSession = atlasConnection.model('QuizSession', QuizSession.schema);
    const AtlasCategory = atlasConnection.model('Category', Category.schema);
    
    // Migrate Categories
    console.log('\n📚 Migrating Categories...');
    const localCategories = await LocalCategory.find({});
    if (localCategories.length > 0) {
      await AtlasCategory.deleteMany({}); // Clear existing
      await AtlasCategory.insertMany(localCategories);
      console.log(`✅ Migrated ${localCategories.length} categories`);
    } else {
      console.log('ℹ️  No categories found in local database');
    }
    
    // Migrate Quiz Results
    console.log('\n📊 Migrating Quiz Results...');
    const localResults = await LocalQuizResult.find({});
    if (localResults.length > 0) {
      // Don't clear existing results, just add new ones
      const existingResults = await AtlasQuizResult.find({});
      const existingSessionIds = new Set(existingResults.map(r => r.sessionId));
      
      const newResults = localResults.filter(r => !existingSessionIds.has(r.sessionId));
      
      if (newResults.length > 0) {
        await AtlasQuizResult.insertMany(newResults);
        console.log(`✅ Migrated ${newResults.length} new quiz results`);
        console.log(`ℹ️  Skipped ${localResults.length - newResults.length} existing results`);
      } else {
        console.log('ℹ️  All quiz results already exist in Atlas');
      }
    } else {
      console.log('ℹ️  No quiz results found in local database');
    }
    
    // Migrate Quiz Sessions (active sessions)
    console.log('\n🎯 Migrating Quiz Sessions...');
    const localSessions = await LocalQuizSession.find({});
    if (localSessions.length > 0) {
      const existingSessions = await AtlasQuizSession.find({});
      const existingSessionIds = new Set(existingSessions.map(s => s.sessionId));
      
      const newSessions = localSessions.filter(s => !existingSessionIds.has(s.sessionId));
      
      if (newSessions.length > 0) {
        await AtlasQuizSession.insertMany(newSessions);
        console.log(`✅ Migrated ${newSessions.length} new quiz sessions`);
        console.log(`ℹ️  Skipped ${localSessions.length - newSessions.length} existing sessions`);
      } else {
        console.log('ℹ️  All quiz sessions already exist in Atlas');
      }
    } else {
      console.log('ℹ️  No active quiz sessions found in local database');
    }
    
    // Summary
    console.log('\n📈 Migration Summary:');
    const atlasCategories = await AtlasCategory.countDocuments();
    const atlasResults = await AtlasQuizResult.countDocuments();
    const atlasSessions = await AtlasQuizSession.countDocuments();
    
    console.log(`📚 Categories in Atlas: ${atlasCategories}`);
    console.log(`📊 Quiz Results in Atlas: ${atlasResults}`);
    console.log(`🎯 Quiz Sessions in Atlas: ${atlasSessions}`);
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('1. Test your app with the Atlas connection');
    console.log('2. Once confirmed working, you can stop your local MongoDB');
    console.log('3. Your quiz app now uses global cloud storage!');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.log('\n🔍 Troubleshooting:');
    console.log('- Ensure local MongoDB is running');
    console.log('- Verify Atlas connection string in .env');
    console.log('- Check network connectivity');
  } finally {
    // Close connections
    if (localConnection) await localConnection.close();
    if (atlasConnection) await atlasConnection.close();
  }
}

// Run migration
migrateData().catch(console.error);
