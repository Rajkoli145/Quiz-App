const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiQuestionService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    this.questionCache = new Map(); // Cache for generated questions
  }

  /**
   * Generate MCQ questions for a specific category and subtopic
   * @param {string} category - Programming language (Java, C, C++, Python)
   * @param {string} subtopic - Specific subtopic within the category
   * @param {number} count - Number of questions to generate (default: 40)
   * @returns {Promise<Array>} Array of generated questions
   */
  async generateQuestions(category, subtopic, count = 40) {
    const cacheKey = `${category}-${subtopic}`;
    
    // Check if questions are already cached
    if (this.questionCache.has(cacheKey)) {
      console.log(`Returning cached questions for ${cacheKey}`);
      return this.questionCache.get(cacheKey);
    }

    // Try with retry logic and fallback to smaller batches
    let questions = [];
    const maxRetries = 3;
    const batchSizes = [count, Math.ceil(count/2), Math.ceil(count/4), 10]; // Fallback to smaller batches
    
    for (const batchSize of batchSizes) {
      for (let retry = 0; retry < maxRetries; retry++) {
        try {
          console.log(`Attempt ${retry + 1}/${maxRetries}: Generating ${batchSize} questions for ${category} - ${subtopic}`);
          
          const prompt = this.buildPrompt(category, subtopic, batchSize);
          const result = await this.model.generateContent(prompt);
          const response = await result.response;
          const text = response.text();
          
          questions = this.parseQuestions(text, category, subtopic);
          
          if (questions.length > 0) {
            // Cache the generated questions
            this.questionCache.set(cacheKey, questions);
            console.log(`Successfully generated and cached ${questions.length} questions for ${cacheKey}`);
            return questions;
          }
          
        } catch (error) {
          console.error(`Attempt ${retry + 1} failed:`, error.message);
          
          // Check if it's a rate limit or overload error
          if (error.message.includes('overloaded') || error.message.includes('503')) {
            const delay = Math.pow(2, retry) * 1000; // Exponential backoff
            console.log(`API overloaded, waiting ${delay}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          
          // If it's a parsing error, try the next batch size
          if (error.message.includes('Failed to parse questions')) {
            console.log(`Parsing failed with batch size ${batchSize}, trying smaller batch...`);
            break;
          }
          
          // For other errors, retry with same batch size
          if (retry === maxRetries - 1) {
            console.error(`All retries failed for batch size ${batchSize}`);
          }
        }
      }
    }
    
    // Final fallback: generate sample questions
    console.log('All Gemini attempts failed, generating fallback sample questions');
    return this.generateFallbackQuestions(category, subtopic, Math.min(count, 10));
  }

  /**
   * Get random subset of questions for quiz
   * @param {string} category - Programming language
   * @param {string} subtopic - Specific subtopic
   * @param {number} count - Number of questions to return (default: 20)
   * @returns {Promise<Array>} Array of random questions
   */
  async getRandomQuestions(category, subtopic, count = 20) {
    const allQuestions = await this.generateQuestions(category, subtopic, 40);
    
    // Shuffle and return random subset
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * Build prompt for Gemini API
   * @param {string} category - Programming language
   * @param {string} subtopic - Specific subtopic
   * @param {number} count - Number of questions
   * @returns {string} Formatted prompt
   */
  buildPrompt(category, subtopic, count) {
    return `Generate exactly ${count} multiple choice questions for ${category} programming language on "${subtopic}".

CRITICAL: Return ONLY a valid JSON array. No markdown, no explanations, no code blocks.

Format:
[
  {
    "id": "q1",
    "question": "What is the correct syntax for declaring a variable in ${category}?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Brief explanation",
    "difficulty": "easy"
  }
]

Rules:
- Each question needs exactly 4 options
- correctAnswer is 0-3 (0=first option, 3=fourth option)
- difficulty: "easy", "medium", or "hard"
- Mix: 60% easy, 30% medium, 10% hard
- Focus on practical ${subtopic} concepts
- Return valid JSON only, no extra text`;
  }

  /**
   * Parse questions from Gemini response
   * @param {string} text - Raw response from Gemini
   * @param {string} category - Programming language
   * @param {string} subtopic - Specific subtopic
   * @returns {Array} Parsed questions array
   */
  parseQuestions(text, category, subtopic) {
    try {
      // Clean up the response text more aggressively
      let cleanText = text.trim();
      
      // Remove markdown code blocks and any extra text
      cleanText = cleanText.replace(/```json\s*/gi, '').replace(/```\s*/g, '');
      cleanText = cleanText.replace(/^[^[\{]*/, ''); // Remove text before first [ or {
      cleanText = cleanText.replace(/[^\]\}]*$/, ''); // Remove text after last ] or }
      
      // Find the JSON array more precisely
      let jsonText = '';
      const arrayStart = cleanText.indexOf('[');
      if (arrayStart !== -1) {
        let bracketCount = 0;
        let inString = false;
        let escapeNext = false;
        
        for (let i = arrayStart; i < cleanText.length; i++) {
          const char = cleanText[i];
          
          if (escapeNext) {
            escapeNext = false;
            continue;
          }
          
          if (char === '\\') {
            escapeNext = true;
            continue;
          }
          
          if (char === '"' && !escapeNext) {
            inString = !inString;
          }
          
          if (!inString) {
            if (char === '[') bracketCount++;
            if (char === ']') bracketCount--;
          }
          
          jsonText += char;
          
          if (bracketCount === 0 && char === ']') {
            break;
          }
        }
      } else {
        throw new Error('No JSON array found in response');
      }

      // Simple cleanup for common JSON issues
      jsonText = jsonText
        .replace(/,(\s*[}\]])/g, '$1')  // Remove trailing commas
        .replace(/\n|\r|\t/g, ' ')      // Replace line breaks and tabs with spaces
        .replace(/\s+/g, ' ')           // Normalize multiple spaces
        .trim();

      console.log('Cleaned JSON text:', jsonText.substring(0, 300) + '...');
      
      const questions = JSON.parse(jsonText);
      
      if (!Array.isArray(questions)) {
        throw new Error('Response is not an array');
      }
      
      // Validate and clean questions
      const validQuestions = questions.map((q, index) => ({
        id: q.id || `${category.toLowerCase()}-${subtopic.toLowerCase().replace(/[^a-z0-9]/g, '')}-${index + 1}`,
        question: q.question?.toString().trim(),
        options: Array.isArray(q.options) ? q.options.map(opt => opt?.toString().trim()) : [],
        correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
        explanation: q.explanation?.toString().trim() || 'No explanation provided',
        difficulty: q.difficulty || 'medium',
        category: category,
        subtopic: subtopic,
        generatedAt: new Date().toISOString()
      })).filter(q => 
        q.question && 
        q.options.length === 4 && 
        q.correctAnswer >= 0 && 
        q.correctAnswer <= 3
      );
      
      if (validQuestions.length === 0) {
        throw new Error('No valid questions found after parsing');
      }
      
      console.log(`Successfully parsed ${validQuestions.length} questions`);
      return validQuestions;
      
    } catch (error) {
      console.error('Error parsing questions:', error);
      console.log('Raw response (first 1000 chars):', text.substring(0, 1000));
      throw new Error(`Failed to parse questions: ${error.message}`);
    }
  }

  /**
   * Clear cache for specific category/subtopic or all cache
   * @param {string} category - Optional category to clear
   * @param {string} subtopic - Optional subtopic to clear
   */
  clearCache(category = null, subtopic = null) {
    if (category && subtopic) {
      const cacheKey = `${category}-${subtopic}`;
      this.questionCache.delete(cacheKey);
      console.log(`Cleared cache for ${cacheKey}`);
    } else {
      this.questionCache.clear();
      console.log('Cleared all question cache');
    }
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getCacheStats() {
    const stats = {
      totalCachedTopics: this.questionCache.size,
      topics: []
    };

    for (const [key, questions] of this.questionCache.entries()) {
      stats.topics.push({
        topic: key,
        questionCount: questions.length
      });
    }

    return stats;
  }

  /**
   * Generate fallback sample questions when Gemini API fails
   * @param {string} category - Programming language
   * @param {string} subtopic - Specific subtopic
   * @param {number} count - Number of questions to generate
   * @returns {Array} Array of sample questions
   */
  generateFallbackQuestions(category, subtopic, count = 10) {
    const sampleQuestions = [];
    
    for (let i = 1; i <= count; i++) {
      sampleQuestions.push({
        id: `${category.toLowerCase()}-${subtopic.toLowerCase().replace(/[^a-z0-9]/g, '')}-fallback-${i}`,
        question: `Sample ${category} question ${i} about ${subtopic}. What is a key concept in ${subtopic}?`,
        options: [
          `Correct answer for ${subtopic}`,
          `Incorrect option A`,
          `Incorrect option B`, 
          `Incorrect option C`
        ],
        correctAnswer: 0,
        explanation: `This is a sample question generated as fallback when Gemini API is unavailable. The correct answer demonstrates a key concept in ${subtopic}.`,
        difficulty: i <= count * 0.6 ? 'easy' : (i <= count * 0.9 ? 'medium' : 'hard'),
        category: category,
        subtopic: subtopic,
        generatedAt: new Date().toISOString(),
        isFallback: true
      });
    }
    
    console.log(`Generated ${count} fallback questions for ${category} - ${subtopic}`);
    return sampleQuestions;
  }
}

module.exports = GeminiQuestionService;
