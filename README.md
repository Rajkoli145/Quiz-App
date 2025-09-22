# QuizMaster - AI-Powered Programming Quiz Platform

A modern, full-stack quiz application with Firebase authentication that generates MCQ questions dynamically using Google's Gemini AI. Features user authentication, progress tracking, and personalized quiz experiences with glassmorphism UI design.

## 🌐 Live Demo
**🚀 [Try QuizMaster Live](https://quiz-app-cyan-two-23.vercel.app)**

Test the app with any phone number for OTP authentication!

## 🚀 Features

- **🔐 Firebase Authentication**: Secure user login/signup with OTP verification
- **🤖 AI-Powered Questions**: 10-20 questions per subtopic generated via Gemini AI
- **🎲 Random Quiz Experience**: Each user gets 20 random questions from the pool
- **💾 Progress Tracking**: User results saved to MongoDB with session management
- **🎨 Glassmorphism UI**: Modern glassmorphism design with backdrop blur effects
- **🌙 Dark/Light Mode**: Toggle between themes with persistence
- **📱 Responsive Design**: Works on desktop, tablet, and mobile
- **☁️ Cloud Deployed**: Full-stack deployment on Vercel with MongoDB Atlas
- **📊 Analytics Dashboard**: Beautiful performance tracking with glassmorphism design
- **4 Programming Languages**: Java, C, C++, Python with 20+ subtopics each

## ⚡ Quick Start (5 Minutes)

**For experienced developers who want to get running fast:**

1. **Clone & Install**: `git clone <repo> && cd Quiz-App-main && npm install`
2. **Firebase**: Create project at [console.firebase.google.com](https://console.firebase.google.com), enable Phone auth
3. **Environment**: Create `frontend/.env` with Firebase config (see Step 2 below)
4. **Backend**: Copy `.env.example` to `.env`, add MongoDB URI and Gemini API key
5. **Run**: `npm run dev` → Open http://localhost:5173

**Need detailed instructions?** Continue reading below ⬇️

## 🛠️ Complete Setup Instructions

### Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (Local) OR **MongoDB Atlas** (Cloud) - [Get Atlas free](https://www.mongodb.com/atlas)
- **Firebase Project** - [Firebase Console](https://console.firebase.google.com)
- **Gemini API Key** - [Google AI Studio](https://makersuite.google.com/app/apikey)

### Step 1: Clone and Install Dependencies
```bash
# Clone the repository
git clone <repository-url>
cd Quiz-App-main

# Install all dependencies (backend + frontend)
npm install
```

### Step 2: Firebase Setup
1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Click "Create a project" or select existing project
   - Enable Authentication → Sign-in method → Phone

2. **Get Firebase Configuration**:
   - Go to Project Settings (⚙️ icon)
   - Scroll to "Your apps" → Add web app (</> icon)
   - Copy the configuration object

3. **Create Frontend Environment File**:
```bash
# Create environment file in frontend directory
touch frontend/.env
```

Edit `frontend/.env` with your Firebase credentials:
```env
# Firebase Configuration (Replace with your actual values)
VITE_FIREBASE_API_KEY=AIzaSyC...your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-ABCDEF1234

# API Configuration
VITE_API_URL=http://localhost:5000/api
```

### Step 3: MongoDB Configuration

#### Option A: Local MongoDB
```bash
# Install MongoDB locally
# macOS: brew install mongodb-community
# Ubuntu: sudo apt install mongodb
# Windows: Download from mongodb.com

# Start MongoDB service
# macOS: brew services start mongodb-community
# Ubuntu: sudo systemctl start mongod
# Windows: Start MongoDB service from Services
```

#### Option B: MongoDB Atlas (Recommended)
1. **Create Atlas Account**: [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. **Create Cluster**: Choose free tier (M0)
3. **Setup Database User**: Database Access → Add user
4. **Whitelist IP**: Network Access → Add IP (0.0.0.0/0 for development)
5. **Get Connection String**: Clusters → Connect → Connect your application

### Step 4: Backend Environment Configuration
```bash
# Copy example environment file
cp .env.example .env
```

Edit `.env` file with your credentials:
```env
# MongoDB Configuration
# For Local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/quizapp

# For MongoDB Atlas (Replace with your connection string):
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/quizapp?retryWrites=true&w=majority

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Step 5: Get Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key and add to `.env` file

### Step 6: Start the Application
```bash
# Method 1: Start both backend and frontend together
npm run dev

# Method 2: Start separately (useful for debugging)
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend  
npm run dev:frontend
```

### Step 7: Verify Setup
1. **Backend**: Open http://localhost:5000 - should show "Quiz App Backend Running"
2. **Frontend**: Open http://localhost:5173 - should show login screen
3. **Test Authentication**: Try logging in with phone number
4. **Test Quiz**: Complete authentication and start a quiz

### Step 8: Optional - MongoDB Atlas Migration
If you want to migrate from local MongoDB to Atlas:
```bash
# Run the Atlas setup wizard
npm run setup:atlas

# Migrate existing data
npm run migrate:atlas
```

## 🎮 How to Use the App

### User Flow
1. **Authentication**: Enter phone number → Receive OTP → Verify
2. **Dashboard**: View available programming languages and topics
3. **Quiz Selection**: Choose language (Java/C/C++/Python) and subtopic
4. **Quiz Experience**: Answer 20 AI-generated multiple choice questions
5. **Results**: View score, correct answers, and explanations
6. **Progress Tracking**: All results saved to your profile

### App Features in Detail

#### 🔐 Authentication System
- **Phone-based OTP**: Secure login without passwords
- **Session Management**: Stay logged in across browser sessions
- **User Profiles**: Track individual progress and history

#### 🎯 Quiz Experience
- **Smart Question Pool**: 40 questions generated per topic, 20 served randomly
- **Instant Feedback**: See correct answers and explanations after completion
- **Progress Tracking**: Results automatically saved to your account
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop

#### 🌙 Theme Support
- **Dark/Light Toggle**: Switch themes with button in top-right corner
- **Persistent Preference**: Theme choice saved across sessions
- **Full Black Dark Mode**: True black background for OLED displays

#### 📊 Performance Features
- **Smart Caching**: Questions cached for instant loading
- **Offline Capability**: Continue quiz even with network interruptions
- **Fast Loading**: Optimized for quick question delivery

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

### Common Issues & Solutions

#### 🔥 Firebase Authentication Errors
**Error: "auth/invalid-api-key"**
```bash
# Check if frontend/.env exists and has correct Firebase config
ls -la frontend/.env
cat frontend/.env

# Verify VITE_ prefix on all Firebase variables
# Restart development server after creating .env file
npm run dev:frontend
```

**Error: "Firebase project not found"**
- Verify `VITE_FIREBASE_PROJECT_ID` matches your Firebase project ID
- Check Firebase project is active in console

#### 🍃 MongoDB Connection Issues
**Local MongoDB not connecting:**
```bash
# Check if MongoDB is running
mongosh
# If not running, start it:
# macOS: brew services start mongodb-community
# Ubuntu: sudo systemctl start mongod
```

**MongoDB Atlas connection issues:**
```bash
# Test connection string
node -e "console.log(process.env.MONGODB_URI)" 
# Verify IP whitelist includes your current IP
# Check username/password are correct (no special characters)
```

#### 🤖 Gemini API Errors
**API Key Issues:**
```bash
# Test your Gemini API key
npm run test:gemini

# Verify key is active in Google AI Studio
# Check for rate limiting (wait a few minutes)
```

#### 🎯 General Issues
**Port already in use:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
# Or change port in .env file
```

**Dependencies issues:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Frontend not loading:**
```bash
# Check if backend is running first
curl http://localhost:5000
# Then start frontend
npm run dev:frontend
```

### 🔍 Debug Mode
Enable detailed logging by setting:
```env
NODE_ENV=development
```

Check browser console for Firebase config loading:
- Open Developer Tools → Console
- Look for "Firebase Config:" log message
- Verify all values show as "Set" not "Missing"

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

## 🚀 Deployment

This app is deployed on **Vercel** with the following architecture:

### Production Stack
- **Frontend**: Vercel (Static Build)
- **Backend**: Vercel Serverless Functions
- **Database**: MongoDB Atlas (Cloud)
- **Authentication**: Firebase
- **AI**: Google Gemini API

### Deployment URL
- **Live App**: https://quiz-app-cyan-two-23.vercel.app
- **API Health**: https://quiz-app-cyan-two-23.vercel.app/api/health

### Deploy Your Own
1. **Fork this repository**
2. **Connect to Vercel**: Import your GitHub repo to Vercel
3. **Environment Variables**: Add all required env vars in Vercel dashboard
4. **Deploy**: Vercel will automatically build and deploy

### Environment Variables for Vercel
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase vars

# Backend Configuration
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/quizapp
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=production
VITE_API_URL=https://your-app.vercel.app/api
```

## 📈 Scaling

For production deployment:
1. ✅ **Serverless Architecture**: Already implemented with Vercel
2. ✅ **Cloud Database**: MongoDB Atlas for global access
3. ✅ **CDN**: Vercel's global CDN for fast loading
4. 🔄 **Monitoring**: Add application monitoring (recommended)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Test Gemini integration
4. Submit pull request

## 📄 License

MIT License - see LICENSE file for details