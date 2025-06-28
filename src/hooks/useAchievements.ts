import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { achievements, Achievement } from '../data/achievements';
import { Habit, Note } from '../types';

interface UnlockedAchievement {
  id: string;
  unlockedAt: string;
}

interface AchievementProgress {
  [achievementId: string]: {
    progress: number;
    total: number;
    percentage: number;
  };
}

export function useAchievements(habits: Habit[], notes: Note[]) {
  const [unlockedAchievements, setUnlockedAchievements] = useLocalStorage<UnlockedAchievement[]>('mindflow-achievements', []);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  // Calculate achievement progress
  const calculateProgress = useCallback((): AchievementProgress => {
    const progress: AchievementProgress = {};

    achievements.forEach(achievement => {
      let current = 0;
      const target = achievement.requirement.value;

      switch (achievement.requirement.type) {
        case 'habit_count':
          current = habits.length;
          break;

        case 'note_count':
          current = notes.length;
          break;

        case 'streak_total':
          current = habits.reduce((acc, habit) => acc + habit.streak, 0);
          break;

        case 'streak_single':
          current = Math.max(...habits.map(h => h.streak), 0);
          break;

        case 'completion_rate':
          if (achievement.requirement.timeframe === 'week') {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            
            let totalPossible = 0;
            let totalCompleted = 0;
            
            habits.forEach(habit => {
              const weekCompletions = habit.completions.filter(c => {
                const completionDate = new Date(c.date);
                return completionDate >= weekAgo && c.completed;
              });
              totalCompleted += weekCompletions.length;
              totalPossible += 7; // 7 days
            });
            
            current = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
          }
          break;

        case 'consecutive_days':
          // Calculate consecutive days of any habit completion
          const today = new Date();
          let consecutiveDays = 0;
          
          for (let i = 0; i < target; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - i);
            const dateStr = checkDate.toISOString().split('T')[0];
            
            const hasCompletion = habits.some(habit => 
              habit.completions.some(c => c.date === dateStr && c.completed)
            );
            
            if (hasCompletion) {
              consecutiveDays++;
            } else {
              break;
            }
          }
          current = consecutiveDays;
          break;

        case 'mood_average':
          if (achievement.requirement.timeframe === 'week') {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            
            const weekNotes = notes.filter(note => {
              const noteDate = new Date(note.createdAt);
              return noteDate >= weekAgo && note.mood;
            });
            
            if (weekNotes.length > 0) {
              const avgMood = weekNotes.reduce((acc, note) => acc + (note.mood || 0), 0) / weekNotes.length;
              current = Math.round(avgMood * 10) / 10;
            }
          }
          break;

        case 'tags_used':
          const uniqueTags = new Set();
          notes.forEach(note => {
            note.tags.forEach(tag => uniqueTags.add(tag));
          });
          current = uniqueTags.size;
          break;

        case 'stickers_used':
          const uniqueStickers = new Set();
          notes.forEach(note => {
            (note.stickers || []).forEach(sticker => uniqueStickers.add(sticker));
          });
          current = uniqueStickers.size;
          break;

        case 'special':
          // Handle special achievements with custom logic
          if (achievement.id === 'rainbow_collector') {
            const categories = new Set(habits.map(h => h.category));
            current = categories.size;
          }
          break;
      }

      progress[achievement.id] = {
        progress: current,
        total: target,
        percentage: Math.min((current / target) * 100, 100)
      };
    });

    return progress;
  }, [habits, notes]);

  // Check for newly unlocked achievements
  useEffect(() => {
    const progress = calculateProgress();
    const currentUnlockedIds = unlockedAchievements.map(a => a.id);
    const newUnlocks: Achievement[] = [];

    achievements.forEach(achievement => {
      const isAlreadyUnlocked = currentUnlockedIds.includes(achievement.id);
      const progressData = progress[achievement.id];
      
      if (!isAlreadyUnlocked && progressData && progressData.percentage >= 100) {
        newUnlocks.push(achievement);
      }
    });

    if (newUnlocks.length > 0) {
      // Add to unlocked achievements
      const newUnlockedData = newUnlocks.map(achievement => ({
        id: achievement.id,
        unlockedAt: new Date().toISOString()
      }));
      
      setUnlockedAchievements(prev => [...prev, ...newUnlockedData]);
      setNewlyUnlocked(newUnlocks);
      setShowCelebration(true);
    }
  }, [habits, notes, unlockedAchievements, setUnlockedAchievements, calculateProgress]);

  const dismissCelebration = useCallback(() => {
    setShowCelebration(false);
    setNewlyUnlocked([]);
  }, []);

  const getUnlockedAchievements = useCallback(() => {
    return achievements.filter(achievement => 
      unlockedAchievements.some(unlocked => unlocked.id === achievement.id)
    );
  }, [unlockedAchievements]);

  const getAchievementProgress = useCallback(() => {
    return calculateProgress();
  }, [calculateProgress]);

  return {
    unlockedAchievements: getUnlockedAchievements(),
    newlyUnlocked,
    showCelebration,
    dismissCelebration,
    achievementProgress: getAchievementProgress(),
    totalAchievements: achievements.length,
    unlockedCount: unlockedAchievements.length
  };
}