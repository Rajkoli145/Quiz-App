# Quiz App with Gemini AI Integration

A modern, interactive quiz application that generates MCQ questions dynamically using Google's Gemini AI. Each user gets unique questions for a personalized quiz experience.

## 🚀 Features

- **Dynamic Question Generation**: 40 questions per subtopic generated via Gemini AI
- **Random Quiz Experience**: Each user gets 20 random questions from the pool
- **4 Programming Languages**: Java, C, C++, Python
- **Comprehensive Topics**: 20+ subtopics per language
- **Smart Caching**: Questions cached for performance
- **Modern UI**: React-based frontend with Tailwind CSS

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Gemini API Key from Google AI Studio

### 1. Clone and Install
```bash
git clone <repository-url>
cd Quiz-App-main
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
```

Edit `.env` file with your credentials:
```env
MONGODB_URI=mongodb://localhost:27017/quizapp
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
VITE_API_URL=http://localhost:5000/api
```

### 3. Get Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file

### 4. Start the Application
```bash
# Start both backend and frontend
npm run dev

# Or start separately
npm run dev:backend  # Backend only
npm run dev:frontend # Frontend only
```

### 5. Test Gemini Integration
```bash
npm run test:gemini
```

## 📡 API Endpoints

### Question Generation
- `GET /api/questions/:category/:subtopic` - Get 20 random questions for quiz
- `POST /api/questions/generate` - Generate and cache 40 questions
- `GET /api/questions/categories` - Get all categories and subtopics
- `DELETE /api/questions/cache` - Clear question cache
- `GET /api/questions/cache/stats` - Get cache statistics

### Example Usage
```javascript
// Get random questions for Java Basics
fetch('/api/questions/Java/Basics%20%26%20Syntax')
  .then(res => res.json())
  .then(data => console.log(data.questions));

// Generate questions for a topic
fetch('/api/questions/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    category: 'Python',
    subtopic: 'Data Types & Variables',
    count: 40
  })
});
```

## 🏗️ Architecture

### Backend Services
- **GeminiQuestionService**: Handles AI question generation
- **Question Caching**: In-memory cache for performance
- **Random Selection**: Ensures unique quiz experience

### Question Format
```json
{
  "id": "java-basics-1",
  "question": "What is the correct way to declare the main method?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,
  "explanation": "The main method must be public, static, void...",
  "difficulty": "easy",
  "category": "Java",
  "subtopic": "Basics & Syntax"
}
```

## 🎯 How It Works

1. **Question Generation**: Gemini AI generates 40 unique questions per subtopic
2. **Caching**: Questions are cached in memory for fast access
3. **Random Selection**: Each quiz randomly selects 20 questions from the 40
4. **User Experience**: Every user gets different questions, preventing memorization

## 🔧 Development

### Project Structure
```
Quiz-App-main/
├── backend/
│   ├── services/
│   │   └── geminiService.cjs     # Gemini AI integration
│   ├── routes/
│   │   └── questions.cjs         # Question API routes
│   ├── test/
│   │   └── testGemini.cjs        # Gemini testing
│   └── server.cjs
├── frontend/
│   └── src/
│       └── data/
│           └── quizData.ts       # Category structure
└── package.json
```

### Adding New Categories
1. Update `categories` object in `/backend/routes/questions.cjs`
2. Add subtopics array for the new category
3. Questions will be generated automatically via Gemini

### Customizing Question Generation
Edit the `buildPrompt()` method in `geminiService.cjs` to:
- Change difficulty distribution
- Modify question format
- Add specific requirements

## 🚨 Troubleshooting

### Common Issues

**Gemini API Errors**
```bash
# Test your API key
npm run test:gemini
```

**MongoDB Connection Issues**
```bash
# Check MongoDB is running
mongosh
```

**Cache Issues**
```bash
# Clear question cache
curl -X DELETE http://localhost:5000/api/questions/cache
```

## 📊 Performance

- **Question Generation**: ~10-15 seconds for 40 questions
- **Cache Hit**: Instant response for cached questions
- **Memory Usage**: ~1MB per 40 questions cached
- **API Limits**: Respects Gemini API rate limits

## 🔐 Security

- API keys stored in environment variables
- Input validation on all endpoints
- Error handling prevents information leakage
- CORS configured for frontend domain

## 📈 Scaling

For production deployment:
1. Use Redis for distributed caching
2. Implement database storage for questions
3. Add rate limiting for API endpoints
4. Set up monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Test Gemini integration
4. Submit pull request

## 📄 License

MIT License - see LICENSE file for details