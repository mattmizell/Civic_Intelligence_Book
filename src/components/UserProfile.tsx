import React, { useState } from 'react';
import { User, Clock, BookOpen, Trophy, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProgress } from '../hooks/useProgress';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { progress } = useProgress();

  if (!isOpen || !user) return null;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const completionPercentage = Math.round((progress.chaptersRead.length / 3) * 100);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg border border-green-500/20 p-6 w-full max-w-md mx-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto">
            <User className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-green-400">{user.username}</h2>
            <p className="text-green-300 text-sm">{user.email}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <BookOpen className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-100">{progress.currentChapter + 1}</div>
              <div className="text-green-300 text-sm">Current Chapter</div>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <Clock className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-100">{formatTime(progress.timeSpent)}</div>
              <div className="text-green-300 text-sm">Time Reading</div>
            </div>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-300 text-sm">Story Progress</span>
              <span className="text-green-400 text-sm font-semibold">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Trophy className="w-5 h-5 text-green-400" />
              <span className="text-green-300 text-sm font-semibold">Chapters Completed</span>
            </div>
            <div className="flex space-x-2">
              {[0, 1, 2].map((chapter) => (
                <div
                  key={chapter}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    progress.chaptersRead.includes(chapter)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-600 text-gray-400'
                  }`}
                >
                  {chapter + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 text-green-300 py-2 px-4 rounded-lg font-semibold transition-all duration-200 hover:bg-gray-600"
            >
              Close
            </button>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200 hover:bg-red-500 flex items-center justify-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;