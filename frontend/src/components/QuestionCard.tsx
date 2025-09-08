import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { selectAnswer } from '../store/slices/quizSlice';

export const QuestionCard: React.FC = () => {
  const dispatch = useDispatch();
  const { questions, currentQuestionIndex, selectedAnswers } = useSelector((state: RootState) => state.quiz);
  
  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = selectedAnswers[currentQuestion?.id];

  if (!currentQuestion) return null;

  const handleAnswerSelect = (answerIndex: number) => {
    dispatch(selectAnswer({ questionId: currentQuestion.id, answer: answerIndex }));
  };

  return (
    <motion.div
      key={currentQuestion.id}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <div className="flex space-x-1">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-blue-300'
                    : index < currentQuestionIndex
                    ? 'bg-green-300'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
          {currentQuestion.question}
        </h2>

        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                selectedAnswer === index
                  ? 'border-blue-300 bg-blue-100/50 text-blue-800'
                  : 'border-gray-300 bg-white/30 text-gray-700 hover:border-gray-400 hover:bg-white/50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswer === index
                    ? 'border-blue-300 bg-blue-300'
                    : 'border-gray-400'
                }`}>
                  {selectedAnswer === index && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-white rounded-full"
                    />
                  )}
                </div>
                <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                <span>{option}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};