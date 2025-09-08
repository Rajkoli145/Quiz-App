import { useState, useEffect } from 'react';
import { apiService, Category, Question } from '../services/api';

interface UseQuizDataReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  getSubtopicQuestions: (categoryKey: string, subtopicKey: string) => Promise<Question[]>;
  refreshCategories: () => Promise<void>;
  generateQuestions: (categoryKey: string, subtopicKey: string, count?: number) => Promise<Question[]>;
  clearCache: () => Promise<void>;
  getCacheStats: () => Promise<any>;
}

export const useQuizData = (): UseQuizDataReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const categoriesData = await apiService.getCategories();
      setCategories(categoriesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(errorMessage);
      console.error('Error fetching categories:', err);
      
      // If it's a connection error, provide helpful message
      if (errorMessage.includes('fetch')) {
        setError('Cannot connect to server. Please ensure the backend is running on the correct port.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getSubtopicQuestions = async (categoryKey: string, subtopicKey: string): Promise<Question[]> => {
    try {
      // Convert subtopic name back to the format expected by the API
      const subtopicName = categories
        .find(cat => cat.key === categoryKey)
        ?.subtopics[subtopicKey]?.name || subtopicKey;
      
      return await apiService.getSubtopicQuestions(categoryKey, subtopicName);
    } catch (err) {
      console.error('Error fetching subtopic questions:', err);
      throw err;
    }
  };

  const generateQuestions = async (categoryKey: string, subtopicKey: string, count: number = 40): Promise<Question[]> => {
    try {
      const subtopicName = categories
        .find(cat => cat.key === categoryKey)
        ?.subtopics[subtopicKey]?.name || subtopicKey;
      
      return await apiService.generateQuestions(categoryKey, subtopicName, count);
    } catch (err) {
      console.error('Error generating questions:', err);
      throw err;
    }
  };

  const clearCache = async (): Promise<void> => {
    try {
      await apiService.clearQuestionCache();
    } catch (err) {
      console.error('Error clearing cache:', err);
      throw err;
    }
  };

  const getCacheStats = async (): Promise<any> => {
    try {
      return await apiService.getCacheStats();
    } catch (err) {
      console.error('Error getting cache stats:', err);
      throw err;
    }
  };

  const refreshCategories = async () => {
    await fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    getSubtopicQuestions,
    refreshCategories,
    generateQuestions,
    clearCache,
    getCacheStats,
  };
};
