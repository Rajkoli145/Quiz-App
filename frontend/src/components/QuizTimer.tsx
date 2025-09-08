import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { decrementTime, submitQuiz } from '../store/slices/quizSlice';

export const QuizTimer: React.FC = () => {
  const dispatch = useDispatch();
  const { timeLeft, isQuizActive } = useSelector((state: RootState) => state.quiz);

  useEffect(() => {
    if (!isQuizActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      if (timeLeft <= 1) {
        dispatch(submitQuiz());
      } else {
        dispatch(decrementTime());
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isQuizActive, dispatch]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const percentage = (timeLeft / (5 * 60)) * 100; // Assuming 5 minutes total

  const getTimerColor = () => {
    if (percentage > 60) return 'from-green-200 to-emerald-200';
    if (percentage > 30) return 'from-yellow-200 to-orange-200';
    return 'from-red-200 to-red-300';
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-700 text-sm font-medium">Time Remaining</span>
        <span className={`text-lg font-bold bg-gradient-to-r ${getTimerColor()} bg-clip-text text-transparent`}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${getTimerColor()} rounded-full relative`}
          initial={{ width: '100%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30 animate-pulse" />
        </motion.div>
      </div>
      
      {timeLeft <= 30 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-300 text-xs mt-2 text-center animate-pulse"
        >
          ⚠️ Time running out!
        </motion.div>
      )}
    </div>
  );
};