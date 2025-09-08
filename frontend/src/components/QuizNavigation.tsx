import React from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { nextQuestion, previousQuestion, submitQuiz } from '../store/slices/quizSlice';

export const QuizNavigation: React.FC = () => {
  const dispatch = useDispatch();
  const { currentQuestionIndex, questions, selectedAnswers } = useSelector((state: RootState) => state.quiz);
  
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const currentQuestion = questions[currentQuestionIndex];
  const hasAnswered = selectedAnswers[currentQuestion?.id] !== undefined;

  const handleNext = () => {
    if (isLastQuestion) {
      dispatch(submitQuiz());
    } else {
      dispatch(nextQuestion());
    }
  };

  const handlePrevious = () => {
    dispatch(previousQuestion());
  };

  return (
    <div className="flex items-center justify-between">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handlePrevious}
        disabled={isFirstQuestion}
        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
          isFirstQuestion
            ? 'bg-gray-200/50 text-gray-400 cursor-not-allowed'
            : 'bg-white/70 text-gray-700 hover:bg-white/90 border border-gray-300 shadow-md'
        }`}
      >
        ← Previous
      </motion.button>

      <div className="text-center">
        <div className="text-sm text-gray-600 mb-1">Progress</div>
        <div className="w-48 bg-gray-200 rounded-full h-2">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-200 to-purple-200 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleNext}
        disabled={!hasAnswered}
        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
          !hasAnswered
            ? 'bg-gray-200/50 text-gray-400 cursor-not-allowed'
            : isLastQuestion
            ? 'bg-gradient-to-r from-green-200 to-emerald-200 text-gray-800 hover:from-green-300 hover:to-emerald-300 shadow-lg shadow-green-200/50'
            : 'bg-gradient-to-r from-blue-200 to-purple-200 text-gray-800 hover:from-blue-300 hover:to-purple-300 shadow-lg shadow-blue-200/50'
        }`}
      >
        {isLastQuestion ? 'Submit Quiz 🎯' : 'Next →'}
      </motion.button>
    </div>
  );
};