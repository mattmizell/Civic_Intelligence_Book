import React from 'react';
import { Play, Zap, Monitor } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProgress } from '../hooks/useProgress';

interface BookCoverProps {
  onStart: () => void;
}

const BookCover: React.FC<BookCoverProps> = ({ onStart }) => {
  const { user } = useAuth();
  const { progress } = useProgress();

  // Determine button text based on user status and progress
  const getButtonText = () => {
    if (!user) {
      return 'Start Reading';
    }
    
    if (progress.chaptersRead.length > 0 || progress.timeSpent > 0) {
      return 'Continue Reading';
    }
    
    return 'Start Reading';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{
          backgroundImage: `url('/src/assets/ChatGPT Image Jun 30, 2025, 09_42_30 AM.png')`,
          filter: 'brightness(0.6) contrast(1.2)'
        }}
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900/90" />
      
      {/* Content */}
      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center space-y-8">
          {/* Main Title */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 via-green-400 to-cyan-400 rounded-lg flex items-center justify-center shadow-2xl shadow-blue-500/20">
                  <Monitor className="w-16 h-16 text-gray-900" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
                    <Zap className="w-4 h-4 text-gray-900" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-green-400 to-cyan-400 rounded-lg blur-lg opacity-30 animate-pulse"></div>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-green-400 to-cyan-400 tracking-wider drop-shadow-2xl">
              CIVIC
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 tracking-wider drop-shadow-2xl">
              INTELLIGENCE
            </h2>
          </div>

          {/* Subtitle */}
          <div className="space-y-4 text-green-200">
            <p className="text-xl md:text-2xl font-light drop-shadow-lg">
              When a teenage hacker accidentally awakens a dormant AI,
            </p>
            <p className="text-xl md:text-2xl font-light drop-shadow-lg">
              the line between creator and created begins to blur.
            </p>
          </div>

          {/* Author */}
          <div className="text-green-400">
            <p className="text-lg font-semibold drop-shadow-lg">Book One</p>
            <p className="text-sm opacity-75 drop-shadow-lg">A story of faith, technology, and the price of power</p>
          </div>

          {/* Progress indicator for logged-in users */}
          {user && (progress.chaptersRead.length > 0 || progress.timeSpent > 0) && (
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 border border-green-500/20 max-w-md mx-auto">
              <p className="text-green-300 text-sm mb-2">Your Progress</p>
              <div className="flex justify-between text-xs text-green-400 mb-1">
                <span>Chapter {progress.currentChapter + 1}</span>
                <span>{progress.chaptersRead.length} chapters read</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (progress.chaptersRead.length / 20) * 100)}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Start Button */}
          <div className="pt-8">
            <button
              onClick={onStart}
              className="group relative inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:from-blue-500 hover:to-green-500 hover:shadow-lg hover:shadow-green-500/25 hover:scale-105 backdrop-blur-sm border border-green-500/20"
            >
              <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>{getButtonText()}</span>
            </button>
          </div>
        </div>

        {/* Bottom decorative elements */}
        <div className="mt-16 flex justify-center space-x-8 opacity-30">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookCover;