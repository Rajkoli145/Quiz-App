import React from 'react';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="fixed top-4 left-4 z-50 flex items-center space-x-3">
      <div className="flex items-center space-x-2 px-4 py-2 rounded-full shadow-lg bg-white text-gray-700">
        <User size={20} />
        <span className="text-sm font-medium">
          {user.displayName || user.email || user.phoneNumber || 'User'}
        </span>
        <button
          onClick={handleLogout}
          className="p-1 rounded-full transition-colors hover:bg-gray-100 text-red-500"
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
