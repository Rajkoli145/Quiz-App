import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import Confetti from 'react-confetti';
import { RootState } from '../store';
import { resetQuiz, setSubmissionStatus } from '../store/slices/quizSlice';
import { useAuth } from '../contexts/AuthContext';

export const ResultScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { 
    score, 
    questions, 
    selectedAnswers, 
    currentCategory, 
    currentSubtopic, 
    sessionId, 
    submissionStatus,
    quizStartTime 
  } = useSelector((state: RootState) => state.quiz);
  
  const correctAnswers = questions.filter(q => selectedAnswers[q.id] === q.correctAnswer).length;
  const totalQuestions = questions.length;
  
  const getScoreColor = () => {
    if (score >= 80) return 'from-green-200 to-emerald-200';
    if (score >= 60) return 'from-yellow-200 to-orange-200';
    return 'from-red-200 to-red-300';
  };

  const getPerformanceMessage = () => {
    if (score >= 90) return { message: "Outstanding! 🌟", emoji: "🎉" };
    if (score >= 80) return { message: "Excellent work! 🎯", emoji: "🎊" };
    if (score >= 70) return { message: "Good job! 👍", emoji: "✨" };
    if (score >= 60) return { message: "Not bad! 📚", emoji: "💪" };
    return { message: "Keep practicing! 🤔", emoji: "📖" };
  };

  const performance = getPerformanceMessage();

  // Submit quiz results to backend when component mounts
  useEffect(() => {
    const submitQuizResults = async () => {
      console.log('ResultScreen mounted - checking submission conditions:');
      console.log('- sessionId:', sessionId);
      console.log('- user:', user?.uid);
      console.log('- submissionStatus:', submissionStatus);
      console.log('- questions length:', questions.length);
      console.log('- selectedAnswers:', selectedAnswers);
      
      if (!sessionId || !user || submissionStatus !== 'idle') {
        console.log('Skipping submission - conditions not met');
        return;
      }

      try {
        dispatch(setSubmissionStatus('submitting'));
        
        const { apiService } = await import('../services/api');
        
        // Calculate time taken
        const timeTaken = quizStartTime ? Math.floor((Date.now() - quizStartTime) / 1000) : 0;
        
        // Submit quiz results with questions data
        const submissionData = {
          sessionId,
          answers: selectedAnswers,
          questions: questions.map(q => ({
            ...q,
            difficulty: q.difficulty || 'medium',
            category: q.category || currentCategory || '',
            subtopic: q.subtopic || currentSubtopic || ''
          })), // Include questions for proper calculation
          timeSpent: timeTaken,
          tabSwitches: 0, // This would be tracked during quiz if needed
          userId: user.uid, // Include user ID for temporary sessions
          userEmail: user.email || user.phoneNumber || undefined // Include user email
        };
        
        console.log('Submitting quiz data:', submissionData);
        await apiService.submitQuiz(submissionData);
        
        dispatch(setSubmissionStatus('success'));
        console.log('Quiz results submitted successfully');
        
      } catch (error) {
        console.error('Failed to submit quiz results:', error);
        dispatch(setSubmissionStatus('error'));
      }
    };

    submitQuizResults();
  }, [sessionId, user, submissionStatus, selectedAnswers, quizStartTime, dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4"
    >
      {score >= 80 && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="bg-white/80 backdrop-blur-lg border border-gray-200/50 rounded-3xl p-8 text-center shadow-xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-6xl mb-6"
          >
            {performance.emoji}
          </motion.div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Quiz Completed!
          </h1>
          
          <p className="text-gray-600 mb-4">
            {currentCategory} • {currentSubtopic}
          </p>
          
          {/* Submission Status */}
          <div className="mb-4">
            {submissionStatus === 'submitting' && (
              <div className="flex items-center justify-center space-x-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">Saving your results...</span>
              </div>
            )}
            {submissionStatus === 'success' && (
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <span>✅</span>
                <span className="text-sm">Results saved to your dashboard!</span>
              </div>
            )}
            {submissionStatus === 'error' && (
              <div className="flex items-center justify-center space-x-2 text-red-600">
                <span>⚠️</span>
                <span className="text-sm">Failed to save results</span>
              </div>
            )}
          </div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="relative mb-8"
          >
            <div className="w-32 h-32 mx-auto relative">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="stroke-current text-gray-300"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <motion.path
                  className={`stroke-current bg-gradient-to-r ${getScoreColor()} bg-clip-text`}
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: score / 100 }}
                  transition={{ delay: 0.6, duration: 1.5, ease: "easeOut" }}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  style={{
                    stroke: `url(#gradient-${score})`,
                  }}
                />
                <defs>
                  <linearGradient id={`gradient-${score}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={score >= 80 ? '#BBF7D0' : score >= 60 ? '#FED7AA' : '#FECACA'} />
                    <stop offset="100%" stopColor={score >= 80 ? '#A7F3D0' : score >= 60 ? '#FDBA74' : '#FCA5A5'} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className={`text-3xl font-bold bg-gradient-to-r ${getScoreColor()} bg-clip-text text-transparent`}
                >
                  {score}%
                </motion.span>
              </div>
            </div>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-2xl font-bold text-gray-800 mb-6"
          >
            {performance.message}
          </motion.h2>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="bg-white/60 rounded-xl p-4 border border-gray-200/50"
            >
              <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="bg-white/60 rounded-xl p-4 border border-gray-200/50"
            >
              <div className="text-2xl font-bold text-red-400">{totalQuestions - correctAnswers}</div>
              <div className="text-sm text-gray-600">Wrong</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="bg-white/60 rounded-xl p-4 border border-gray-200/50"
            >
              <div className="text-2xl font-bold text-blue-400">{totalQuestions}</div>
              <div className="text-sm text-gray-600">Total</div>
            </motion.div>
          </div>
          
          <div className="space-y-4">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(resetQuiz())}
              className="w-full bg-gradient-to-r from-blue-200 to-purple-200 text-gray-800 font-bold py-4 px-8 rounded-xl hover:from-blue-300 hover:to-purple-300 transition-all duration-300 shadow-lg shadow-blue-200/50"
            >
              Try Another Quiz 🚀
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};