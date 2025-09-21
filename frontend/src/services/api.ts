const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

// Debug logging
console.log('API Configuration:', {
  VITE_API_URL: (import.meta as any).env.VITE_API_URL,
  API_BASE_URL,
  allEnvVars: (import.meta as any).env
});

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  subtopic: string;
}

export interface Subtopic {
  name: string;
  questions: Question[];
}

export interface Category {
  _id: string;
  name: string;
  key: string;
  color: string;
  icon: string;
  description: string;
  subtopics: { [key: string]: Subtopic };
}

export interface QuizSession {
  sessionId: string;
  categoryKey: string;
  subtopicKey: string;
  questions: Question[];
  duration: number;
}

export interface QuizSubmission {
  sessionId: string;
  answers: { [questionId: string]: number };
  questions?: Question[]; // Include questions for proper result calculation
  timeSpent: number;
  tabSwitches: number;
  userId?: string; // User ID for linking results
  userEmail?: string; // User email for identification
}

export interface QuizResult {
  sessionId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  performance: {
    accuracy: number;
    averageTimePerQuestion: number;
    difficultyBreakdown: {
      easy: { correct: number; total: number };
      medium: { correct: number; total: number };
      hard: { correct: number; total: number };
    };
  };
  answers: Array<{
    questionId: string;
    selectedAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    question: string;
    explanation: string;
  }>;
}

class ApiService {
  private async fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      console.log('Making API request to:', url);
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // New Gemini-powered Categories API
  async getCategories(): Promise<Category[]> {
    const response = await this.fetchWithErrorHandling<{ 
      success: boolean; 
      data: { [key: string]: { name: string; subtopics: string[] } };
    }>(`${API_BASE_URL}/questions/categories`);
    
    // Add debugging and validation
    console.log('API Response:', response);
    
    if (!response || !response.data) {
      console.error('Invalid response structure:', response);
      throw new Error('Invalid API response structure');
    }
    
    // Transform the response to match frontend expectations
    const categories: Category[] = [];
    
    // Define category metadata (colors, icons, descriptions)
    const categoryMetadata: { [key: string]: { color: string; icon: string; description: string } } = {
      'Java': {
        color: 'from-orange-400 to-red-500',
        icon: '/icons/java.png',
        description: 'Object-oriented programming language'
      },
      'C': {
        color: 'from-blue-400 to-blue-600',
        icon: '/icons/C.png',
        description: 'System programming language'
      },
      'C++': {
        color: 'from-purple-400 to-purple-600',
        icon: '/icons/c-.png',
        description: 'High-performance programming language'
      },
      'Python': {
        color: 'from-green-400 to-blue-500',
        icon: '/icons/python.png',
        description: 'Versatile and beginner-friendly language'
      }
    };
    
    for (const [key, categoryData] of Object.entries(response.data)) {
      const metadata = categoryMetadata[key] || {
        color: 'from-gray-400 to-gray-600',
        icon: '📚',
        description: 'Programming language'
      };
      
      // Create subtopics object with empty questions arrays (questions loaded dynamically)
      const subtopics: { [key: string]: Subtopic } = {};
      categoryData.subtopics.forEach(subtopicName => {
        const subtopicKey = subtopicName.replace(/\s+/g, '').toLowerCase();
        subtopics[subtopicKey] = {
          name: subtopicName,
          questions: [] // Questions are now loaded dynamically from Gemini
        };
      });
      
      categories.push({
        _id: key,
        name: categoryData.name,
        key: key,
        color: metadata.color,
        icon: metadata.icon,
        description: metadata.description,
        subtopics: subtopics
      });
    }
    
    return categories;
  }

  // New Gemini-powered Questions API
  async getSubtopicQuestions(categoryKey: string, subtopicKey: string): Promise<Question[]> {
    // First try to get questions from cache, if not available, generate them
    try {
      const response = await this.fetchWithErrorHandling<{ 
        success: boolean; 
        data: {
          questions: Question[];
          category: string;
          subtopic: string;
          totalQuestions: number;
        };
      }>(`${API_BASE_URL}/questions/${encodeURIComponent(categoryKey)}/${encodeURIComponent(subtopicKey)}`);
      
      return response.data.questions;
    } catch (error) {
      console.error('Failed to get questions:', error);
      throw new Error('Failed to load quiz questions. Please ensure the backend server is running and Gemini API is configured.');
    }
  }

  // Generate questions for a specific topic (optional - for pre-loading)
  async generateQuestions(categoryKey: string, subtopicKey: string, count: number = 40): Promise<Question[]> {
    const response = await this.fetchWithErrorHandling<{ 
      success: boolean; 
      data: {
        questions: Question[];
        cached: boolean;
      };
    }>(`${API_BASE_URL}/questions/generate`, {
      method: 'POST',
      body: JSON.stringify({ 
        category: categoryKey, 
        subtopic: subtopicKey, 
        count 
      }),
    });
    
    return response.data.questions;
  }

  // Cache management
  async clearQuestionCache(): Promise<void> {
    await this.fetchWithErrorHandling(`${API_BASE_URL}/questions/cache`, {
      method: 'DELETE',
    });
  }

  async getCacheStats(): Promise<any> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/questions/cache/stats`);
  }

  // Health check
  async checkHealth(): Promise<{ status: string; features: { geminiIntegration: boolean; mongodb: boolean } }> {
    return this.fetchWithErrorHandling(`${API_BASE_URL.replace('/api', '')}/api/health`);
  }

  // Legacy endpoints (keeping for backward compatibility if needed)
  async getCategory(categoryKey: string): Promise<Category> {
    return this.fetchWithErrorHandling<Category>(`${API_BASE_URL}/categories/${categoryKey}`);
  }

  // Quiz Session API (updated to include user information)
  async startQuizSession(categoryKey: string, subtopicKey: string, userId?: string, userEmail?: string): Promise<QuizSession> {
    const response = await this.fetchWithErrorHandling<{ success: boolean; data: QuizSession }>(`${API_BASE_URL}/quiz/start`, {
      method: 'POST',
      body: JSON.stringify({ 
        category: categoryKey, 
        subtopic: subtopicKey,
        userId,
        userEmail
      }),
    });
    return response.data;
  }

  async getQuizSession(sessionId: string): Promise<QuizSession> {
    return this.fetchWithErrorHandling<QuizSession>(`${API_BASE_URL}/quiz/session/${sessionId}`);
  }

  async saveAnswer(sessionId: string, questionId: string, selectedAnswer: number): Promise<void> {
    await this.fetchWithErrorHandling(`${API_BASE_URL}/quiz/answer`, {
      method: 'POST',
      body: JSON.stringify({ sessionId, questionId, selectedAnswer }),
    });
  }

  async handleTabSwitch(sessionId: string): Promise<void> {
    await this.fetchWithErrorHandling(`${API_BASE_URL}/quiz/tab-switch`, {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    });
  }

  // Quiz Submission API (unchanged)
  async submitQuiz(submission: QuizSubmission): Promise<QuizResult> {
    return this.fetchWithErrorHandling<QuizResult>(`${API_BASE_URL}/submissions/submit`, {
      method: 'POST',
      body: JSON.stringify(submission),
    });
  }

  async getQuizResult(sessionId: string): Promise<QuizResult> {
    return this.fetchWithErrorHandling<QuizResult>(`${API_BASE_URL}/submissions/result/${sessionId}`);
  }

  async getAnalytics(categoryKey?: string, subtopicKey?: string): Promise<any> {
    const params = new URLSearchParams();
    if (categoryKey) params.append('category', categoryKey);
    if (subtopicKey) params.append('subtopic', subtopicKey);
    
    const queryString = params.toString();
    const url = `${API_BASE_URL}/submissions/analytics${queryString ? `?${queryString}` : ''}`;
    
    return this.fetchWithErrorHandling(url);
  }
}

export const apiService = new ApiService();
