import React, { useState } from 'react';
import { User, LogOut, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import UserDashboard from './UserDashboard';

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const [showDashboard, setShowDashboard] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <>
      <div className="fixed top-4 left-4 z-50 flex items-center space-x-3">
        <div className="flex items-center space-x-2 px-4 py-2 rounded-full shadow-lg bg-white dark:bg-black text-gray-700 dark:text-gray-300">
          <User size={20} />
          <span className="text-sm font-medium">
            {user.displayName || user.email || user.phoneNumber || 'User'}
          </span>
          <button
            onClick={() => setShowDashboard(true)}
            className="p-1 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-blue-500"
            title="View Dashboard"
          >
            <BarChart3 size={16} />
          </button>
          <button
            onClick={handleLogout}
            className="p-1 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-red-500"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
      
      {showDashboard && (
        <UserDashboard 
          user={user} 
          onClose={() => setShowDashboard(false)} 
        />
      )}
    </>
  );
};

export default UserProfile;
