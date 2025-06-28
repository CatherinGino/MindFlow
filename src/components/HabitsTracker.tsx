import React, { useState } from 'react';
import { Plus, Target, Flame, Calendar, Trash2, Loader2 } from 'lucide-react';
import { useSupabaseHabits } from '../hooks/useSupabaseHabits';
import { Habit } from '../types';

export function HabitsTracker() {
  const { habits, loading, addHabit, toggleHabitCompletion, deleteHabit } = useSupabaseHabits();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    category: 'mental' as const,
    color: '#3B82F6',
    icon: 'target',
    frequency: 'daily' as const,
  });

  const today = new Date().toISOString().split('T')[0];

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabit.name.trim()) {
      addHabit(newHabit);
      setNewHabit({
        name: '',
        description: '',
        category: 'mental',
        color: '#3B82F6',
        icon: 'target',
        frequency: 'daily',
      });
      setShowAddForm(false);
    }
  };

  const isHabitCompleted = (habit: Habit, date: string) => {
    return habit.completions.find(c => c.date === date && c.completed);
  };

  const getLastSevenDays = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const lastSevenDays = getLastSevenDays();

  const categoryColors = {
    mental: '#3B82F6',
    physical: '#10B981',
    social: '#F59E0B',
    spiritual: '#8B5CF6',
    creative: '#EF4444'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-300">Loading habits...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Habit Tracker</h1>
          <p className="text-gray-600 dark:text-gray-300">Build positive habits one day at a time</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-md hover:shadow-lg"
        >
          <Plus size={20} />
          <span>Add Habit</span>
        </button>
      </div>

      {/* Add Habit Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <form onSubmit={handleAddHabit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Habit Name
              </label>
              <input
                type="text"
                value={newHabit.name}
                onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                placeholder="e.g., Morning meditation"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={newHabit.description}
                onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                placeholder="Describe your habit..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={newHabit.category}
                  onChange={(e) => {
                    const category = e.target.value as any;
                    setNewHabit({ 
                      ...newHabit, 
                      category,
                      color: categoryColors[category] || '#3B82F6'
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                >
                  <option value="mental">Mental</option>
                  <option value="physical">Physical</option>
                  <option value="social">Social</option>
                  <option value="spiritual">Spiritual</option>
                  <option value="creative">Creative</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Frequency
                </label>
                <select
                  value={newHabit.frequency}
                  onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              >
                Add Habit
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Habits List */}
      <div className="space-y-4">
        {habits.map((habit) => (
          <div key={habit.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300 hover:shadow-md">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: habit.color }}
                  />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{habit.name}</h3>
                  <div className="flex items-center space-x-1 text-orange-600 dark:text-orange-400">
                    <Flame size={16} />
                    <span className="text-sm font-medium">{habit.streak}</span>
                  </div>
                </div>
                {habit.description && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{habit.description}</p>
                )}
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="capitalize">{habit.category}</span>
                  <span>•</span>
                  <span className="capitalize">{habit.frequency}</span>
                </div>
              </div>
              <button
                onClick={() => deleteHabit(habit.id)}
                className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Weekly View */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                <Calendar size={16} />
                <span>Last 7 Days</span>
              </h4>
              <div className="grid grid-cols-7 gap-2">
                {lastSevenDays.map((date) => {
                  const isCompleted = isHabitCompleted(habit, date);
                  const isToday = date === today;
                  
                  return (
                    <button
                      key={date}
                      onClick={() => toggleHabitCompletion(habit.id, date)}
                      className={`
                        p-3 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105
                        ${isCompleted 
                          ? 'bg-green-500 text-white shadow-md hover:bg-green-600' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }
                        ${isToday ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800' : ''}
                      `}
                    >
                      <div className="text-center">
                        <div className="text-xs opacity-75">
                          {new Date(date).toLocaleDateString('en', { weekday: 'short' })}
                        </div>
                        <div className="text-sm font-bold">
                          {new Date(date).getDate()}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {habits.length === 0 && !loading && (
        <div className="text-center py-12">
          <Target size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No habits yet</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Start building positive habits today!</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            Add Your First Habit
          </button>
        </div>
      )}
    </div>
  );
}