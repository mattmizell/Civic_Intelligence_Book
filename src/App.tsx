import React, { useState, useEffect } from 'react';
import { Book, Users, MapPin, Settings as SettingsIcon, ChevronLeft, ChevronRight, Menu, X, User, BarChart3 } from 'lucide-react';
import BookCover from './components/BookCover';
import CharacterProfiles from './components/CharacterProfiles';
import Settings from './components/Settings';
import ChapterReader from './components/ChapterReader';
import Navigation from './components/Navigation';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import Analytics from './components/Analytics';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { useProgress } from './hooks/useProgress';

function AppContent() {
  const [currentSection, setCurrentSection] = useState('cover');
  const [currentChapter, setCurrentChapter] = useState(0); // Start at 0 (prologue)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());
  
  const { user } = useAuth();
  const { progress, updateProgress } = useProgress();

  const sections = [
    { id: 'cover', label: 'Cover', icon: Book },
    { id: 'characters', label: 'Characters', icon: Users },
    { id: 'settings', label: 'Settings', icon: MapPin },
    { id: 'chapters', label: 'Story', icon: Book },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  // Update progress when chapter changes
  useEffect(() => {
    if (user && currentSection === 'chapters') {
      const timeSpent = Math.floor((Date.now() - sessionStartTime) / 60000); // minutes
      updateProgress({ 
        currentChapter,
        timeSpent: Math.max(1, timeSpent) // At least 1 minute
      });
      setSessionStartTime(Date.now());
    }
  }, [currentChapter, user]);

  // Load user's saved progress when they have a profile
  useEffect(() => {
    if (user && progress.currentChapter !== undefined) {
      // If user has read something before (has progress), load their last position
      if (progress.chaptersRead.length > 0 || progress.timeSpent > 0) {
        setCurrentChapter(progress.currentChapter);
      }
      // If they're new users with no progress, they'll start at prologue (0)
    }
  }, [progress, user]);

  const handleChapterChange = (newChapter: number) => {
    setCurrentChapter(newChapter);
    if (user) {
      const timeSpent = Math.floor((Date.now() - sessionStartTime) / 60000);
      updateProgress({ 
        currentChapter: newChapter,
        timeSpent: Math.max(1, timeSpent),
        chapterCompleted: currentChapter // Mark previous chapter as completed
      });
      setSessionStartTime(Date.now());
    }
  };

  // Handle "Start Reading" button - smart loading based on user status
  const handleStartReading = () => {
    setCurrentSection('chapters');
    
    if (user) {
      // If user has progress, load their last position
      if (progress.chaptersRead.length > 0 || progress.timeSpent > 0) {
        setCurrentChapter(progress.currentChapter);
      } else {
        // New user with profile but no progress - start at prologue
        setCurrentChapter(0);
      }
    } else {
      // No user profile - start at prologue
      setCurrentChapter(0);
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'cover':
        return <BookCover onStart={handleStartReading} />;
      case 'characters':
        return <CharacterProfiles />;
      case 'settings':
        return <Settings />;
      case 'chapters':
        return <ChapterReader currentChapter={currentChapter} setCurrentChapter={handleChapterChange} />;
      case 'analytics':
        return <Analytics />;
      default:
        return <BookCover onStart={handleStartReading} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-green-100 font-mono">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-gray-900 to-green-900"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(0, 255, 0, 0.1) 0%, transparent 50%)`
        }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-gray-800 border-b border-green-500/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-green-400 rounded-sm flex items-center justify-center">
                <SettingsIcon className="w-5 h-5 text-gray-900" />
              </div>
              <h1 className="text-xl font-bold text-green-400">CIVIC INTELLIGENCE</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <button
                  onClick={() => setShowUserProfile(true)}
                  className="flex items-center space-x-2 bg-gray-700 text-green-300 px-3 py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.username}</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-md font-semibold transition-all duration-200 hover:from-blue-500 hover:to-green-500"
                >
                  Sign In
                </button>
              )}

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md text-green-400 hover:bg-gray-700 transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            <nav className="hidden md:flex space-x-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(section.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                      currentSection === section.id
                        ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
                        : 'text-green-300 hover:bg-gray-700 hover:text-green-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-green-500/30">
            <nav className="px-4 py-2 space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setCurrentSection(section.id);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-2 px-4 py-3 rounded-md transition-all duration-200 ${
                      currentSection === section.id
                        ? 'bg-green-600 text-white'
                        : 'text-green-300 hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {renderSection()}
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-800 border-t border-green-500/30 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-green-400">
            <p className="text-sm">
              "Trust must be earned — in humans and machines."
            </p>
            <p className="text-xs text-green-500 mt-2">CIVIC INTELLIGENCE • Book One</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <UserProfile isOpen={showUserProfile} onClose={() => setShowUserProfile(false)} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;