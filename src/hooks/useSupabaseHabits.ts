import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useLocalStorage } from './useLocalStorage';
import { Habit, DatabaseHabit } from '../types';

// Transform database habit to app habit
const transformHabit = (dbHabit: DatabaseHabit): Habit => ({
  id: dbHabit.id,
  name: dbHabit.name,
  description: dbHabit.description || '',
  category: (dbHabit.category as any) || 'mental',
  color: dbHabit.color || '#3B82F6',
  icon: dbHabit.icon || 'target',
  frequency: (dbHabit.frequency as any) || 'daily',
  streak: dbHabit.streak || 0,
  completions: Array.isArray(dbHabit.completions) ? dbHabit.completions : [],
  createdAt: dbHabit.created_at,
  user_id: dbHabit.user_id,
});

export function useSupabaseHabits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Local storage fallback
  const [localHabits, setLocalHabits] = useLocalStorage<Habit[]>('mindflow-habits', []);

  // Memoize this to prevent unnecessary re-renders
  const useSupabase = useMemo(() => isSupabaseConfigured && user, [user]);

  // Fetch habits from Supabase or use local storage
  useEffect(() => {
    let mounted = true;

    const fetchHabits = async () => {
      if (!mounted) return;
      
      // If not using Supabase, load from local storage immediately
      if (!useSupabase) {
        setHabits(localHabits);
        setLoading(false);
        return;
      }

      try {
        // Increased timeout from 2 seconds to 5 seconds for better reliability
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Fetch timeout')), 5000)
        );
        
        const fetchPromise = supabase
          .from('habits')
          .select('*')
          .eq('user_id', user!.id)
          .order('created_at', { ascending: false });

        const { data, error } = await Promise.race([
          fetchPromise,
          timeoutPromise
        ]) as any;

        if (mounted) {
          if (error) throw error;
          const transformedHabits = (data || []).map(transformHabit);
          setHabits(transformedHabits);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching habits:', error);
        if (mounted) {
          // Fallback to local storage on error
          setHabits(localHabits);
          setLoading(false);
        }
      }
    };

    fetchHabits();

    return () => {
      mounted = false;
    };
  }, [useSupabase, user?.id, localHabits]);

  const addHabit = useCallback(async (habit: Omit<Habit, 'id' | 'streak' | 'completions' | 'createdAt' | 'user_id'>) => {
    const newHabit: Habit = {
      ...habit,
      id: crypto.randomUUID(),
      streak: 0,
      completions: [],
      createdAt: new Date().toISOString(),
    };

    // Always update local state first for immediate UI response
    const updatedHabits = [newHabit, ...habits];
    setHabits(updatedHabits);
    setLocalHabits(updatedHabits);

    if (!useSupabase) {
      return;
    }

    // Background sync to Supabase
    try {
      const habitWithUserId = {
        id: newHabit.id,
        user_id: user!.id,
        name: newHabit.name,
        description: newHabit.description,
        category: newHabit.category,
        color: newHabit.color,
        icon: newHabit.icon,
        frequency: newHabit.frequency,
        streak: newHabit.streak,
        completions: newHabit.completions,
        created_at: newHabit.createdAt,
      };

      const { data, error } = await supabase
        .from('habits')
        .insert([habitWithUserId])
        .select()
        .single();

      if (error) throw error;
      
      // Update with server response
      const transformedHabit = transformHabit(data);
      setHabits(prev => prev.map(h => h.id === newHabit.id ? transformedHabit : h));
    } catch (error) {
      console.error('Error adding habit:', error);
      // Local storage already updated, so no need to do anything else
    }
  }, [user, useSupabase, habits, setLocalHabits]);

  const toggleHabitCompletion = useCallback(async (habitId: string, date: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

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

    const updatedHabit = { ...habit, completions: newCompletions, streak };

    // Always update local state first for immediate UI response
    const updatedHabits = habits.map(h => h.id === habitId ? updatedHabit : h);
    setHabits(updatedHabits);
    setLocalHabits(updatedHabits);

    if (!useSupabase) {
      return;
    }

    // Background sync to Supabase
    try {
      const { error } = await supabase
        .from('habits')
        .update({ 
          completions: newCompletions,
          streak: streak 
        })
        .eq('id', habitId);

      if (error) throw error;
    } catch (error) {
      console.error('Error toggling habit completion:', error);
      // Local storage already updated, so no need to do anything else
    }
  }, [habits, user, useSupabase, setLocalHabits]);

  const deleteHabit = useCallback(async (habitId: string) => {
    // Always update local state first for immediate UI response
    const updatedHabits = habits.filter(h => h.id !== habitId);
    setHabits(updatedHabits);
    setLocalHabits(updatedHabits);

    if (!useSupabase) {
      return;
    }

    // Background sync to Supabase
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting habit:', error);
      // Local storage already updated, so no need to do anything else
    }
  }, [user, useSupabase, habits, setLocalHabits]);

  return {
    habits,
    loading,
    addHabit,
    toggleHabitCompletion,
    deleteHabit,
  };
}