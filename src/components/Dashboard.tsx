import React, { useMemo } from 'react';
import { Calendar, Flame, Heart, Smile, Target } from 'lucide-react';
import { useSupabaseHabits } from '../hooks/useSupabaseHabits';
import { useSupabaseNotes } from '../hooks/useSupabaseNotes';

interface DashboardProps {
  onTabChange?: (tab: string) => void;
  onNoteSelect?: (noteId: string) => void;
}

export function Dashboard({ onTabChange, onNoteSelect }: DashboardProps) {
  const { habits, loading: habitsLoading } = useSupabaseHabits();
  const { notes, loading: notesLoading } = useSupabaseNotes();

  // Memoize calculations to prevent unnecessary recalculations
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayCompletions = habits.reduce((acc, habit) => {
      const completion = habit.completions.find(c => c.date === today && c.completed);
      return completion ? acc + 1 : acc;
    }, 0);

    const totalStreak = habits.reduce((acc, habit) => acc + habit.streak, 0);
    const recentNotes = notes.slice(0, 3);

    return {
      todayCompletions,
      totalStreak,
      recentNotes,
      totalHabits: habits.length,
      totalNotes: notes.length
    };
  }, [habits, notes]);

  const handleNoteClick = (noteId: string) => {
    onNoteSelect?.(noteId);
    onTabChange?.('notes');
  };

  // Show loading only for a brief moment
  if ((habitsLoading || notesLoading) && habits.length === 0 && notes.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome to MindFlow</h1>
          <p className="text-gray-600 dark:text-gray-300">Loading your wellness data...</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 animate-pulse p-6 rounded-2xl h-24"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome to MindFlow</h1>
        <p className="text-gray-600 dark:text-gray-300">Your journey to better mental health starts here</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Today's Habits</p>
              <p className="text-2xl font-bold">{stats.todayCompletions}/{stats.totalHabits}</p>
            </div>
            <Target className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Total Streak</p>
              <p className="text-2xl font-bold">{stats.totalStreak}</p>
            </div>
            <Flame className="h-8 w-8 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Notes</p>
              <p className="text-2xl font-bold">{stats.totalNotes}</p>
            </div>
            <Heart className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Wellness</p>
              <p className="text-2xl font-bold">Great</p>
            </div>
            <Smile className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => onTabChange?.('habits')}
            className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 text-left hover:scale-105 hover:shadow-md"
          >
            <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
            <h3 className="font-medium text-gray-900 dark:text-white">Log Today's Habits</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Mark your progress for today</p>
          </button>
          
          <button 
            onClick={() => onTabChange?.('notes')}
            className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-200 text-left hover:scale-105 hover:shadow-md"
          >
            <Heart className="h-6 w-6 text-green-600 dark:text-green-400 mb-2" />
            <h3 className="font-medium text-gray-900 dark:text-white">Add a Note</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Capture your thoughts and feelings</p>
          </button>
          
          <button 
            onClick={() => onTabChange?.('insights')}
            className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-200 text-left hover:scale-105 hover:shadow-md"
          >
            <Smile className="h-6 w-6 text-purple-600 dark:text-purple-400 mb-2" />
            <h3 className="font-medium text-gray-900 dark:text-white">View Insights</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Track your wellness journey</p>
          </button>
        </div>
      </div>

      {/* Recent Notes */}
      {stats.recentNotes.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Notes</h2>
          <div className="space-y-3">
            {stats.recentNotes.map((note) => (
              <button
                key={note.id}
                onClick={() => handleNoteClick(note.id)}
                className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-xl transition-all duration-200 text-left hover:bg-gray-100 dark:hover:bg-gray-600 hover:scale-[1.02] hover:shadow-md"
              >
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">{note.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{note.content}</p>
                <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                  {note.tags.length > 0 && (
                    <span className="ml-2">• {note.tags.join(', ')}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Welcome message for new users */}
      {habits.length === 0 && notes.length === 0 && !habitsLoading && !notesLoading && (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-2xl p-8 text-center transition-colors duration-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Welcome to MindFlow!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Start your mental wellness journey by creating your first habit or note.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => onTabChange?.('habits')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              Create Your First Habit
            </button>
            <button 
              onClick={() => onTabChange?.('notes')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
            >
              Write Your First Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
}