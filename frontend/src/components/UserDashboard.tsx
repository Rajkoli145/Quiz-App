import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';

interface UserStats {
  totalQuizzes: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  totalTimeSpent: number;
  averageTimePerQuiz: number;
  gradeDistribution: Record<string, number>;
  categoryPerformance: Record<string, {
    totalQuizzes: number;
    averageScore: number;
    bestScore: number;
  }>;
  recentActivity: Array<{
    category: string;
    subtopic: string;
    score: number;
    grade: string;
    timeTaken: number;
    completedAt: string;
  }>;
  improvementTrend: Array<{
    period: string;
    averageScore: number;
  }>;
}

interface QuizHistory {
  results: Array<{
    sessionId: string;
    category: string;
    subtopic: string;
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    timeTaken: number;
    submissionReason: string;
    grade: string;
    createdAt: string;
  }>;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface UserDashboardProps {
  user: User;
  onClose: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [quizHistory, setQuizHistory] = useState<QuizHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchUserData();
  }, [user.uid]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching user data for:', user.uid);
      console.log('API Base URL:', API_BASE_URL);

      // First check if backend is running
      try {
        const healthUrl = API_BASE_URL.replace('/api', '/api/health');
        console.log('Checking backend health:', healthUrl);
        const healthResponse = await fetch(healthUrl);
        if (healthResponse.ok) {
          const healthData = await healthResponse.json();
          console.log('Backend health check:', healthData);
        } else {
          console.error('Backend health check failed:', healthResponse.status);
        }
      } catch (healthError) {
        console.error('Backend is not responding:', healthError);
        throw new Error('Backend server is not running. Please start the backend server on port 5000.');
      }

      // Fetch user statistics
      const statsUrl = `${API_BASE_URL}/user-analytics/stats/${user.uid}`;
      console.log('Fetching stats from:', statsUrl);
      const statsResponse = await fetch(statsUrl);
      
      if (!statsResponse.ok) {
        const errorText = await statsResponse.text();
        console.error('Stats API error:', statsResponse.status, errorText);
        throw new Error(`Failed to fetch user statistics: ${statsResponse.status}`);
      }
      
      const statsData = await statsResponse.json();
      console.log('Stats data received:', statsData);
      console.log('Stats data details:', JSON.stringify(statsData.data, null, 2));
      setUserStats(statsData.data);

      // Fetch quiz history
      const historyUrl = `${API_BASE_URL}/user-analytics/history/${user.uid}?limit=10`;
      console.log('Fetching history from:', historyUrl);
      const historyResponse = await fetch(historyUrl);
      
      if (!historyResponse.ok) {
        const errorText = await historyResponse.text();
        console.error('History API error:', historyResponse.status, errorText);
        throw new Error(`Failed to fetch quiz history: ${historyResponse.status}`);
      }
      
      const historyData = await historyResponse.json();
      console.log('History data received:', historyData);
      console.log('History data details:', JSON.stringify(historyData.data, null, 2));
      setQuizHistory(historyData.data);

    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const getGradeColor = (grade: string): string => {
    const gradeColors: Record<string, string> = {
      'A+': 'text-green-600 bg-green-100',
      'A': 'text-green-600 bg-green-100',
      'B+': 'text-blue-600 bg-blue-100',
      'B': 'text-blue-600 bg-blue-100',
      'C+': 'text-yellow-600 bg-yellow-100',
      'C': 'text-yellow-600 bg-yellow-100',
      'D': 'text-orange-600 bg-orange-100',
      'F': 'text-red-600 bg-red-100'
    };
    return gradeColors[grade] || 'text-gray-600 bg-gray-100';
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center z-50">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/50 mx-auto mb-4"></div>
            <p className="text-white/80">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center z-50">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
          <div className="text-center">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-white mb-2">Error Loading Dashboard</h3>
            <p className="text-white/70 mb-6">{error}</p>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={fetchUserData}
                className="bg-blue-500/30 hover:bg-blue-500/50 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-xl transition-all duration-300"
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-xl transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600/80 via-blue-600/80 to-indigo-600/80 backdrop-blur-sm text-white p-6 border-b border-white/10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Performance Dashboard
              </h2>
              <p className="text-blue-100/80 mt-1">{user.email || user.phoneNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="flex space-x-2 px-6 py-2">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'history', label: 'Quiz History', icon: '📚' },
              { id: 'categories', label: 'Categories', icon: '🎯' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-6 rounded-xl font-medium text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30'
                    : 'text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] bg-gradient-to-b from-transparent to-white/5">
          {activeTab === 'overview' && userStats && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold text-white">{userStats.totalQuizzes}</div>
                  <div className="text-sm text-blue-100/80 mt-1">Total Quizzes</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold text-white">
                    {userStats.averageScore}%
                  </div>
                  <div className="text-sm text-green-100/80 mt-1">Average Score</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold text-white">{userStats.highestScore}%</div>
                  <div className="text-sm text-purple-100/80 mt-1">Best Score</div>
                </div>
                <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold text-white">
                    {formatTime(userStats.totalTimeSpent)}
                  </div>
                  <div className="text-sm text-orange-100/80 mt-1">Time Spent</div>
                </div>
              </div>

              {/* Grade Distribution */}
              {Object.keys(userStats.gradeDistribution).length > 0 && (
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Grade Distribution</h3>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(userStats.gradeDistribution).map(([grade, count]) => (
                      <div key={grade} className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-xl text-sm font-medium text-white">
                        {grade}: {count}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvement Trend */}
              {userStats.improvementTrend.length > 0 && (
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Improvement Trend</h3>
                  <div className="flex space-x-4">
                    {userStats.improvementTrend.map((trend, index) => (
                      <div key={index} className="flex-1 text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="text-3xl font-bold text-white">
                          {trend.averageScore}%
                        </div>
                        <div className="text-sm text-white/70 mt-1">{trend.period}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              {userStats.recentActivity.length > 0 && (
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {userStats.recentActivity.slice(0, 5).map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300">
                        <div>
                          <div className="font-medium text-white">
                            {activity.category} - {activity.subtopic}
                          </div>
                          <div className="text-sm text-white/70 mt-1">
                            {new Date(activity.completedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-white text-lg">
                            {activity.score}%
                          </div>
                          <div className="text-xs px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 mt-1">
                            {activity.grade}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && quizHistory && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white">Quiz History</h3>
              {quizHistory.results.length === 0 ? (
                <div className="text-center py-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl">
                  <div className="text-6xl mb-4">📚</div>
                  <p className="text-white/70 text-lg">No quiz history found. Start taking quizzes to see your progress!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {quizHistory.results.map((result) => (
                    <div key={result.sessionId} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-lg">
                            {result.category} - {result.subtopic}
                          </h4>
                          <div className="text-sm text-white/70 mt-2">
                            {result.correctAnswers}/{result.totalQuestions} correct • {formatTime(result.timeTaken)}
                          </div>
                          <div className="text-xs text-white/50 mt-1">
                            {new Date(result.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">
                            {result.score}%
                          </div>
                          <div className="text-xs px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 mt-2">
                            {result.grade}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'categories' && userStats && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white">Category Performance</h3>
              {Object.keys(userStats.categoryPerformance).length === 0 ? (
                <div className="text-center py-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl">
                  <div className="text-6xl mb-4">🎯</div>
                  <p className="text-white/70 text-lg">No category data available yet. Take some quizzes to see your performance by category!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(userStats.categoryPerformance).map(([category, performance]) => (
                    <div key={category} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                      <h4 className="font-semibold text-white text-xl mb-4">{category}</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/70">Quizzes Taken:</span>
                          <span className="font-medium text-white text-lg">{performance.totalQuizzes}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/70">Average Score:</span>
                          <span className="font-medium text-white text-lg">
                            {performance.averageScore}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/70">Best Score:</span>
                          <span className="font-medium text-white text-lg">
                            {performance.bestScore}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
