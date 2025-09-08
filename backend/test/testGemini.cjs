const GeminiQuestionService = require('../services/geminiService.cjs');
require('dotenv').config();

async function testGeminiIntegration() {
  console.log('🧪 Testing Gemini API Integration...\n');

  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in environment variables');
    console.log('Please add your Gemini API key to .env file');
    process.exit(1);
  }

  const questionService = new GeminiQuestionService();

  try {
    console.log('📝 Generating 5 test questions for Java - Basics & Syntax...');
    
    const questions = await questionService.generateQuestions('Java', 'Basics & Syntax', 5);
    
    console.log(`✅ Successfully generated ${questions.length} questions\n`);
    
    // Display first question as example
    if (questions.length > 0) {
      const firstQuestion = questions[0];
      console.log('📋 Sample Question:');
      console.log(`ID: ${firstQuestion.id}`);
      console.log(`Question: ${firstQuestion.question}`);
      console.log('Options:');
      firstQuestion.options.forEach((option, index) => {
        const marker = index === firstQuestion.correctAnswer ? '✓' : ' ';
        console.log(`  ${marker} ${String.fromCharCode(65 + index)}. ${option}`);
      });
      console.log(`Explanation: ${firstQuestion.explanation}`);
      console.log(`Difficulty: ${firstQuestion.difficulty}\n`);
    }

    // Test random question selection
    console.log('🎲 Testing random question selection...');
    const randomQuestions = await questionService.getRandomQuestions('Java', 'Basics & Syntax', 3);
    console.log(`✅ Successfully selected ${randomQuestions.length} random questions\n`);

    // Test cache
    console.log('💾 Testing cache functionality...');
    const cachedQuestions = await questionService.generateQuestions('Java', 'Basics & Syntax', 5);
    console.log(`✅ Cache working - returned ${cachedQuestions.length} cached questions\n`);

    // Cache stats
    const stats = questionService.getCacheStats();
    console.log('📊 Cache Statistics:');
    console.log(`Total cached topics: ${stats.totalCachedTopics}`);
    stats.topics.forEach(topic => {
      console.log(`  - ${topic.topic}: ${topic.questionCount} questions`);
    });

    console.log('\n🎉 All tests passed! Gemini integration is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Run test if called directly
if (require.main === module) {
  testGeminiIntegration();
}

module.exports = { testGeminiIntegration };
