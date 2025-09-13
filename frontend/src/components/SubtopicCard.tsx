import React from 'react';
import { motion } from 'framer-motion';

interface SubtopicCardProps {
  name: string;
  questionCount: number;
  color: string;
  onClick: () => void;
  index: number;
}

export const SubtopicCard: React.FC<SubtopicCardProps> = ({
  name,
  questionCount,
  color,
  onClick,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <div
        onClick={onClick}
        className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group h-full flex flex-col"
      >
        {/* Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
        
        {/* Content */}
        <div className="relative p-6 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
              {name}
            </h3>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                20 Questions
              </span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
             
              <motion.div
                className={`w-8 h-8 rounded-full bg-gradient-to-r ${color} flex items-center justify-center text-white text-sm font-medium`}
                whileHover={{ scale: 1.1 }}
              >
                →
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};