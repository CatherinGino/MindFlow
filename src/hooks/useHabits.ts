import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Habit } from '../types';

export function useHabits() {
  const [habits, setHabits] = useLocalStorage<Habit[]>('mindflow-habits', []);

  const addHabit = useCallback((habit: Omit<Habit, 'id' | 'streak' | 'completions' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habit,
      id: crypto.randomUUID(),
      streak: 0,
      completions: [],
      createdAt: new Date().toISOString(),
    };
    setHabits(prev => [...prev, newHabit]);
  }, [setHabits]);

  const toggleHabitCompletion = useCallback((habitId: string, date: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit;
      
      const existingCompletion = habit.completions.find(c => c.date === date);
      let newCompletions;
      
      if (existingCompletion) {
        newCompletions = habit.completions.map(c => 
          c.date === date ? { ...c, completed: !c.completed } : c
        );
      } else {
        newCompletions = [...habit.completions, { date, completed: true }];
      }
      
      // Calculate streak
      const sortedCompletions = newCompletions
        .filter(c => c.completed)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      let streak = 0;
      const today = new Date().toISOString().split('T')[0];
      let currentDate = new Date(today);
      
      for (const completion of sortedCompletions) {
        const completionDate = new Date(completion.date);
        if (completionDate.toISOString().split('T')[0] === currentDate.toISOString().split('T')[0]) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }
      
      return { ...habit, completions: newCompletions, streak };
    }));
  }, [setHabits]);

  const deleteHabit = useCallback((habitId: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
  }, [setHabits]);

  return {
    habits,
    addHabit,
    toggleHabitCompletion,
    deleteHabit,
  };
}