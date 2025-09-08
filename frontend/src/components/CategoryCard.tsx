import React from 'react';
import { motion } from 'framer-motion';

interface CategoryCardProps {
  name: string;
  icon: string;
  color: string;
  subtopicCount: number;
  onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  icon,
  color,
  subtopicCount,
  onClick
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group cursor-pointer"
      onClick={onClick}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300`} />
      
      <div className="relative bg-white/80 backdrop-blur-lg border border-gray-200/50 rounded-2xl p-8 hover:border-gray-300/50 transition-all duration-300 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className={`text-4xl p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
            {icon}
          </div>
          <div className={`text-sm px-3 py-1 rounded-full bg-gradient-to-r ${color} text-gray-700 font-medium`}>
            {subtopicCount} topics
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{name}</h3>
        <p className="text-gray-600">Explore {name} programming concepts</p>
        
        <div className="mt-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors">
          <span className="text-sm font-medium">Start Learning</span>
          <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};