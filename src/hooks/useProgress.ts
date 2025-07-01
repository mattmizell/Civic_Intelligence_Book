import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

interface UserProgress {
  currentChapter: number;
  chaptersRead: number[];
  timeSpent: number;
  lastReadAt: string;
}

export const useProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress>({
    currentChapter: 0,
    chaptersRead: [],
    timeSpent: 0,
    lastReadAt: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProgress();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadProgress = () => {
    try {
      const progressData = localStorage.getItem('civic_intelligence_progress');
      const allProgress = progressData ? JSON.parse(progressData) : {};
      
      const userProgress = allProgress[user!.id] || {
        currentChapter: 0,
        chaptersRead: [],
        timeSpent: 0,
        lastReadAt: new Date().toISOString()
      };
      
      setProgress(userProgress);
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = (updates: Partial<UserProgress> & { chapterCompleted?: number }) => {
    if (!user) return;

    try {
      const progressData = localStorage.getItem('civic_intelligence_progress');
      const allProgress = progressData ? JSON.parse(progressData) : {};
      
      if (!allProgress[user.id]) {
        allProgress[user.id] = {
          currentChapter: 0,
          chaptersRead: [],
          timeSpent: 0,
          lastReadAt: new Date().toISOString()
        };
      }

      const userProgress = allProgress[user.id];
      
      if (updates.currentChapter !== undefined) {
        userProgress.currentChapter = updates.currentChapter;
      }
      
      if (updates.timeSpent !== undefined) {
        userProgress.timeSpent += updates.timeSpent;
      }
      
      if (updates.chapterCompleted !== undefined && !userProgress.chaptersRead.includes(updates.chapterCompleted)) {
        userProgress.chaptersRead.push(updates.chapterCompleted);
      }
      
      userProgress.lastReadAt = new Date().toISOString();
      
      allProgress[user.id] = userProgress;
      localStorage.setItem('civic_intelligence_progress', JSON.stringify(allProgress));
      setProgress(userProgress);
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  return { progress, updateProgress, loading };
};