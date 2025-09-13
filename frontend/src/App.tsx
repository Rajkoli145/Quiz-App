import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { store } from './store';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { setCategory, setSubtopic, startQuiz, resetQuiz } from './store/slices/quizSlice';
import { useQuizData } from './hooks/useQuizData';
import { CategoryCard } from './components/CategoryCard';
import { SubtopicCard } from './components/SubtopicCard';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import FirebaseOtpAuth from './components/FirebaseOtpAuth';
import UserProfile from './components/UserProfile';
import { User } from 'firebase/auth';

const QuizApp: React.FC = () => {
  const dispatch = useDispatch();
  const { user, loading: authLoading } = useAuth();
  const { categories, loading, error, getSubtopicQuestions } = useQuizData();
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);

  const handleAuthSuccess = (user: User) => {
    console.log('User authenticated:', user);
  };
  
  const {
    currentCategory,
    isQuizActive,
    showResults
  } = useSelector((state: RootState) => state.quiz);

  const handleCategorySelect = (categoryKey: string) => {
    dispatch(setCategory(categoryKey));
  };

  const handleSubtopicSelect = async (subtopicKey: string) => {
    if (!currentCategory) return;
    
    try {
      setLoadingQuiz(true);
      setQuizError(null);
      dispatch(setSubtopic(subtopicKey));
      
      // Fetch questions from Gemini API
      const questions = await getSubtopicQuestions(currentCategory, subtopicKey);
      
      if (questions.length === 0) {
        throw new Error('No questions were generated. Please try again.');
      }
      
      dispatch(startQuiz({
        questions,
        duration: 5 * 60 // 5 minutes
      }));
    } catch (err) {
      console.error('Failed to load quiz questions:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load quiz questions';
      setQuizError(errorMessage);
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleBackToCategories = () => {
    dispatch(resetQuiz());
    setQuizError(null);
  };

  const handleRetryQuiz = () => {
    setQuizError(null);
  };

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show authentication screen if user is not logged in
  if (!user) {
    return <FirebaseOtpAuth onAuthSuccess={handleAuthSuccess} />;
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <UserProfile />
        <ResultScreen />
      </div>
    );
  }

  if (isQuizActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <UserProfile />
        <QuizScreen />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading quiz categories...</p>
          <p className="text-sm text-gray-500 mt-2">Connecting to Gemini AI...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-800">
              <strong>Setup Required:</strong>
            </p>
            <ul className="text-xs text-yellow-700 mt-2 space-y-1 text-left">
              <li>• Ensure backend server is running on port 5000</li>
              <li>• Add GEMINI_API_KEY to your .env file</li>
              <li>• Run: npm run dev:backend</li>
            </ul>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const currentCategoryData = categories.find(cat => cat.key === currentCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <UserProfile />
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            {!currentCategory ? (
              <>
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-6xl font-bold mb-4"
                >
                  <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                    Quiz
                  </span>
                  <span className="text-gray-800">Master</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl text-gray-600 max-w-2xl mx-auto"
                >
                  Test your programming knowledge with AI-generated questions.
                  Each quiz is unique and personalized just for you.
                </motion.p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBackToCategories}
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    ← Back to Categories
                  </motion.button>
                </div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  {currentCategoryData?.name} Topics
                </h1>
                <p className="text-gray-600">
                  Choose a subtopic to start your AI-generated quiz
                </p>
              </>
            )}
          </div>

          {/* Quiz Error */}
          {quizError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center space-x-2 text-red-700 mb-2">
                <span>❌</span>
                <span className="font-medium">Quiz Loading Failed</span>
              </div>
              <p className="text-sm text-red-600 mb-3">{quizError}</p>
              <button
                onClick={handleRetryQuiz}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* Loading overlay for quiz start */}
          {loadingQuiz && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 text-center max-w-sm mx-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-lg text-gray-600 mb-2">Generating Questions...</p>
                <div className="mt-4 text-xs text-gray-400">
                  This may take 10-15 seconds
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <AnimatePresence mode="wait">
            {!currentCategory ? (
              <motion.div
                key="categories"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {categories.map((category) => (
                  <CategoryCard
                    key={category.key}
                    name={category.name}
                    icon={category.icon}
                    color={category.color}
                    subtopicCount={Object.keys(category.subtopics).length}
                    onClick={() => handleCategorySelect(category.key)}
                  />
                ))}
              </motion.div>
            ) : currentCategoryData ? (
              <motion.div
                key="subtopics"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl mx-auto px-4"
              >
                {Object.entries(currentCategoryData.subtopics).map(([key, subtopic], index) => (
                  <div key={key} className="h-full">
                    <SubtopicCard
                      name={subtopic.name}
                      questionCount={20} // Always 20 questions from Gemini
                      color={currentCategoryData.color}
                      onClick={() => handleSubtopicSelect(key)}
                      index={index}
                    />
                  </div>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <QuizApp />
      </AuthProvider>
    </Provider>
  );
}

export default App;