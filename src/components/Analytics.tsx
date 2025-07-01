import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Clock, BookOpen, TrendingUp } from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  totalSessions: number;
  totalTimeSpent: number;
  chapterViews: Record<string, number>;
  dailyStats: Record<string, any>;
}

const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-green-300 mt-4">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center text-green-300">
          <p>Unable to load analytics data.</p>
        </div>
      </div>
    );
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const averageSessionTime = analytics.totalSessions > 0 
    ? Math.round(analytics.totalTimeSpent / analytics.totalSessions)
    : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-bold text-green-400">Reader Analytics</h2>
        <p className="text-lg text-green-200 max-w-2xl mx-auto">
          Track how readers are engaging with the Civic Intelligence story.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg border border-green-500/20 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-100">Total Readers</h3>
            </div>
          </div>
          <div className="text-3xl font-bold text-green-400">{analytics.totalUsers}</div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-green-500/20 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-100">Total Sessions</h3>
            </div>
          </div>
          <div className="text-3xl font-bold text-green-400">{analytics.totalSessions}</div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-green-500/20 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-100">Total Reading Time</h3>
            </div>
          </div>
          <div className="text-3xl font-bold text-green-400">{formatTime(analytics.totalTimeSpent)}</div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-green-500/20 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-100">Avg. Session</h3>
            </div>
          </div>
          <div className="text-3xl font-bold text-green-400">{formatTime(averageSessionTime)}</div>
        </div>
      </div>

      {/* Chapter Views */}
      <div className="bg-gray-800 rounded-lg border border-green-500/20 p-6">
        <h3 className="text-2xl font-semibold text-green-300 mb-6 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          Chapter Popularity
        </h3>
        <div className="space-y-4">
          {Object.entries(analytics.chapterViews).map(([chapter, views]) => {
            const maxViews = Math.max(...Object.values(analytics.chapterViews));
            const percentage = maxViews > 0 ? (views / maxViews) * 100 : 0;
            
            return (
              <div key={chapter} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-300">Chapter {parseInt(chapter) + 1}</span>
                  <span className="text-green-400 font-semibold">{views} views</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg border border-green-500/20 p-6">
        <h3 className="text-2xl font-semibold text-green-300 mb-6">Recent Activity</h3>
        <div className="space-y-3">
          {Object.entries(analytics.dailyStats)
            .slice(-7)
            .reverse()
            .map(([date, stats]: [string, any]) => (
              <div key={date} className="flex justify-between items-center py-2 border-b border-green-500/10">
                <span className="text-green-200">{new Date(date).toLocaleDateString()}</span>
                <div className="flex space-x-4 text-sm">
                  <span className="text-green-400">{stats.sessions} sessions</span>
                  <span className="text-green-400">{stats.uniqueUsers?.length || 0} users</span>
                  <span className="text-green-400">{formatTime(stats.timeSpent)}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;