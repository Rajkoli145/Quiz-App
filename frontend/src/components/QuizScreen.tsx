import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { submitQuiz } from '../store/slices/quizSlice';
import { useTabVisibility } from '../hooks/useTabVisibility';
import { QuizTimer } from './QuizTimer';
import { QuestionCard } from './QuestionCard';
import { QuizNavigation } from './QuizNavigation';

export const QuizScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { currentCategory, currentSubtopic, isQuizActive } = useSelector((state: RootState) => state.quiz);

  const handleTabSwitch = () => {
    if (isQuizActive) {
      dispatch(submitQuiz());
    }
  };

  useTabVisibility(handleTabSwitch);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              {currentCategory} Quiz
            </h1>
            <p className="text-gray-600">
              {currentSubtopic} • Programming Assessment
            </p>
          </div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <QuizTimer />
          </motion.div>
        </motion.div>

        {/* Quiz Content */}
        <div className="space-y-8">
          <QuestionCard />
          <QuizNavigation />
        </div>

        {/* Warning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-yellow-100/60 border border-yellow-300/50 rounded-xl"
        >
          <div className="flex items-center space-x-2 text-yellow-700">
            <span>⚠️</span>
            <span className="text-sm font-medium">
              Warning: Switching tabs will auto-submit your quiz!
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};