import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user in localStorage
    const savedUser = localStorage.getItem('civic_intelligence_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('civic_intelligence_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Get users from localStorage
      const usersData = localStorage.getItem('civic_intelligence_users');
      const users = usersData ? JSON.parse(usersData) : {};
      
      const user = users[email];
      if (user && user.password === password) {
        const userData = {
          id: user.id,
          username: user.username,
          email: user.email
        };
        setUser(userData);
        localStorage.setItem('civic_intelligence_user', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      // Get existing users from localStorage
      const usersData = localStorage.getItem('civic_intelligence_users');
      const users = usersData ? JSON.parse(usersData) : {};
      
      // Check if user already exists
      if (users[email]) {
        return false;
      }

      // Create new user
      const userId = Date.now().toString();
      const newUser = {
        id: userId,
        username,
        email,
        password,
        createdAt: new Date().toISOString()
      };

      users[email] = newUser;
      localStorage.setItem('civic_intelligence_users', JSON.stringify(users));

      // Set current user
      const userData = {
        id: userId,
        username,
        email
      };
      setUser(userData);
      localStorage.setItem('civic_intelligence_user', JSON.stringify(userData));

      // Initialize user progress
      const progressData = localStorage.getItem('civic_intelligence_progress');
      const progress = progressData ? JSON.parse(progressData) : {};
      progress[userId] = {
        currentChapter: 0,
        chaptersRead: [],
        timeSpent: 0,
        lastReadAt: new Date().toISOString()
      };
      localStorage.setItem('civic_intelligence_progress', JSON.stringify(progress));

      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('civic_intelligence_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};