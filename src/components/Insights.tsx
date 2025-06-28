import React, { useMemo } from 'react';
import { TrendingUp, Calendar, Target, Award, Brain, Heart, Trophy } from 'lucide-react';
import { useSupabaseHabits } from '../hooks/useSupabaseHabits';
import { useSupabaseNotes } from '../hooks/useSupabaseNotes';
import { useAchievements } from '../hooks/useAchievements';
import { AchievementCelebration } from './AchievementCelebration';
import { AchievementBadges } from './AchievementBadges';

export function Insights() {
  const { habits } = useSupabaseHabits();
  const { notes } = useSupabaseNotes();
  const {
    unlockedAchievements,
    newlyUnlocked,
    showCelebration,
    dismissCelebration,
    achievementProgress,
    totalAchievements,
    unlockedCount
  } = useAchievements(habits, notes);

  // Memoize all calculations to prevent unnecessary recalculations
  const insights = useMemo(() => {
    // Calculate insights
    const totalHabits = habits.length;
    const totalStreak = habits.reduce((acc, habit) => acc + habit.streak, 0);
    const avgStreak = totalHabits > 0 ? Math.round(totalStreak / totalHabits) : 0;
    
    const today = new Date().toISOString().split('T')[0];
    const todayCompletions = habits.reduce((acc, habit) => {
      const completion = habit.completions.find(c => c.date === today && c.completed);
      return completion ? acc + 1 : acc;
    }, 0);
    
    const completionRate = totalHabits > 0 ? Math.round((todayCompletions / totalHabits) * 100) : 0;
    
    // Weekly completion data
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const completions = habits.reduce((acc, habit) => {
        const completion = habit.completions.find(c => c.date === dateStr && c.completed);
        return completion ? acc + 1 : acc;
      }, 0);
      
      weeklyData.push({
        date: dateStr,
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        completions,
        total: totalHabits,
        percentage: totalHabits > 0 ? Math.round((completions / totalHabits) * 100) : 0,
      });
    }
    
    // Category breakdown
    const categoryBreakdown = habits.reduce((acc, habit) => {
      const category = habit.category || 'other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Notes insights
    const notesThisWeek = notes.filter(note => {
      const noteDate = new Date(note.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return noteDate >= weekAgo;
    }).length;

    const avgMood = notes.length > 0 
      ? Math.round(notes.reduce((acc, note) => acc + (note.mood || 3), 0) / notes.length * 10) / 10
      : 3;

    return {
      totalHabits,
      totalStreak,
      avgStreak,
      todayCompletions,
      completionRate,
      weeklyData,
      categoryBreakdown,
      notesThisWeek,
      avgMood,
      totalNotes: notes.length
    };
  }, [habits, notes]);

  const getMoodLabel = (mood: number) => {
    if (mood >= 4.5) return 'Excellent';
    if (mood >= 3.5) return 'Good';
    if (mood >= 2.5) return 'Okay';
    if (mood >= 1.5) return 'Difficult';
    return 'Challenging';
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 4.5) return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
    if (mood >= 3.5) return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
    if (mood >= 2.5) return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
    if (mood >= 1.5) return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20';
    return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Insights Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">Track your progress and celebrate your achievements</p>
      </div>

      {/* Achievement Celebration */}
      <AchievementCelebration
        achievements={newlyUnlocked}
        onDismiss={dismissCelebration}
        show={showCelebration}
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Completion Rate</p>
              <p className="text-2xl font-bold">{insights.completionRate}%</p>
            </div>
            <Target className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Avg Streak</p>
              <p className="text-2xl font-bold">{insights.avgStreak}</p>
            </div>
            <Award className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Notes This Week</p>
              <p className="text-2xl font-bold">{insights.notesThisWeek}</p>
            </div>
            <Brain className="h-8 w-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm">Avg Mood</p>
              <p className="text-2xl font-bold">{insights.avgMood}/5</p>
            </div>
            <Heart className="h-8 w-8 text-pink-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Achievements</p>
              <p className="text-2xl font-bold">{unlockedCount}/{totalAchievements}</p>
            </div>
            <Trophy className="h-8 w-8 text-yellow-200" />
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Weekly Progress</h2>
          <TrendingUp className="h-6 w-6 text-gray-400 dark:text-gray-500" />
        </div>
        
        <div className="space-y-4">
          {insights.weeklyData.map((day) => (
            <div key={day.date} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-8">{day.day}</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-32">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${day.percentage}%` }}
                  />
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {day.completions}/{day.total} ({day.percentage}%)
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Habit Categories */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Habit Categories</h2>
          
          {Object.keys(insights.categoryBreakdown).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(insights.categoryBreakdown).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="capitalize text-gray-700 dark:text-gray-300">{category}</span>
                  <div className="flex items-center space-x-2">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-20">
                      <div
                        className="bg-indigo-500 h-2 rounded-full"
                        style={{ width: `${(count / insights.totalHabits) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No habits to analyze yet</p>
          )}
        </div>

        {/* Mood Overview */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Mood Overview</h2>
          
          <div className="text-center py-4">
            <div className={`inline-flex items-center px-4 py-2 rounded-full ${getMoodColor(insights.avgMood)} mb-4`}>
              <span className="font-medium">{getMoodLabel(insights.avgMood)}</span>
            </div>
            
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{insights.avgMood}/5</p>
            <p className="text-gray-600 dark:text-gray-300">Average mood from {insights.totalNotes} notes</p>
          </div>

          {insights.totalNotes === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">Start adding notes to track your mood</p>
          )}
        </div>
      </div>

      {/* Achievement Badges */}
      <AchievementBadges
        unlockedAchievements={unlockedAchievements}
        achievementProgress={achievementProgress}
      />
    </div>
  );
}