export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category: 'habits' | 'notes' | 'streaks' | 'milestones' | 'special';
  requirement: {
    type: 'habit_count' | 'note_count' | 'streak_total' | 'streak_single' | 'completion_rate' | 'consecutive_days' | 'mood_average' | 'tags_used' | 'stickers_used' | 'special';
    value: number;
    timeframe?: 'day' | 'week' | 'month' | 'all_time';
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const achievements: Achievement[] = [
  // Beginner Achievements (Common)
  {
    id: 'first_habit',
    title: 'First Steps',
    description: 'Create your first habit',
    icon: '🎯',
    color: 'from-blue-400 to-blue-600',
    category: 'habits',
    requirement: { type: 'habit_count', value: 1 },
    rarity: 'common'
  },
  {
    id: 'first_note',
    title: 'Thoughtful Beginning',
    description: 'Write your first note',
    icon: '📝',
    color: 'from-green-400 to-green-600',
    category: 'notes',
    requirement: { type: 'note_count', value: 1 },
    rarity: 'common'
  },
  {
    id: 'habit_starter',
    title: 'Habit Builder',
    description: 'Create 3 habits',
    icon: '🏗️',
    color: 'from-blue-400 to-blue-600',
    category: 'habits',
    requirement: { type: 'habit_count', value: 3 },
    rarity: 'common'
  },
  {
    id: 'note_taker',
    title: 'Note Taker',
    description: 'Write 5 notes',
    icon: '📚',
    color: 'from-green-400 to-green-600',
    category: 'notes',
    requirement: { type: 'note_count', value: 5 },
    rarity: 'common'
  },

  // Streak Achievements (Rare)
  {
    id: 'week_warrior',
    title: 'Week Warrior',
    description: 'Achieve a 7-day total streak',
    icon: '🔥',
    color: 'from-orange-400 to-orange-600',
    category: 'streaks',
    requirement: { type: 'streak_total', value: 7 },
    rarity: 'rare'
  },
  {
    id: 'consistency_king',
    title: 'Consistency Champion',
    description: 'Maintain a single habit for 7 days',
    icon: '👑',
    color: 'from-yellow-400 to-yellow-600',
    category: 'streaks',
    requirement: { type: 'streak_single', value: 7 },
    rarity: 'rare'
  },
  {
    id: 'month_master',
    title: 'Month Master',
    description: 'Achieve a 30-day total streak',
    icon: '🏆',
    color: 'from-purple-400 to-purple-600',
    category: 'streaks',
    requirement: { type: 'streak_total', value: 30 },
    rarity: 'epic'
  },
  {
    id: 'dedication_diamond',
    title: 'Diamond Dedication',
    description: 'Maintain a single habit for 30 days',
    icon: '💎',
    color: 'from-cyan-400 to-cyan-600',
    category: 'streaks',
    requirement: { type: 'streak_single', value: 30 },
    rarity: 'epic'
  },

  // Milestone Achievements (Epic)
  {
    id: 'habit_collector',
    title: 'Habit Collector',
    description: 'Create 10 different habits',
    icon: '🎪',
    color: 'from-indigo-400 to-indigo-600',
    category: 'habits',
    requirement: { type: 'habit_count', value: 10 },
    rarity: 'epic'
  },
  {
    id: 'prolific_writer',
    title: 'Prolific Writer',
    description: 'Write 25 notes',
    icon: '✍️',
    color: 'from-emerald-400 to-emerald-600',
    category: 'notes',
    requirement: { type: 'note_count', value: 25 },
    rarity: 'epic'
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Achieve 100% completion rate for a week',
    icon: '⭐',
    color: 'from-amber-400 to-amber-600',
    category: 'milestones',
    requirement: { type: 'completion_rate', value: 100, timeframe: 'week' },
    rarity: 'epic'
  },
  {
    id: 'mood_master',
    title: 'Mood Master',
    description: 'Maintain an average mood of 4+ for a week',
    icon: '😊',
    color: 'from-pink-400 to-pink-600',
    category: 'milestones',
    requirement: { type: 'mood_average', value: 4, timeframe: 'week' },
    rarity: 'rare'
  },

  // Creative Achievements (Rare)
  {
    id: 'tag_master',
    title: 'Tag Master',
    description: 'Use 20 different tags across your notes',
    icon: '🏷️',
    color: 'from-teal-400 to-teal-600',
    category: 'notes',
    requirement: { type: 'tags_used', value: 20 },
    rarity: 'rare'
  },
  {
    id: 'sticker_enthusiast',
    title: 'Sticker Enthusiast',
    description: 'Use 30 different stickers in your notes',
    icon: '🎨',
    color: 'from-rose-400 to-rose-600',
    category: 'notes',
    requirement: { type: 'stickers_used', value: 30 },
    rarity: 'rare'
  },

  // Legendary Achievements
  {
    id: 'century_club',
    title: 'Century Club',
    description: 'Achieve a 100-day total streak',
    icon: '🌟',
    color: 'from-gradient-to-r from-yellow-400 via-red-500 to-pink-500',
    category: 'streaks',
    requirement: { type: 'streak_total', value: 100 },
    rarity: 'legendary'
  },
  {
    id: 'iron_will',
    title: 'Iron Will',
    description: 'Maintain a single habit for 100 days',
    icon: '🛡️',
    color: 'from-gray-400 to-gray-600',
    category: 'streaks',
    requirement: { type: 'streak_single', value: 100 },
    rarity: 'legendary'
  },
  {
    id: 'mindflow_master',
    title: 'MindFlow Master',
    description: 'Write 100 notes',
    icon: '🧠',
    color: 'from-purple-500 via-pink-500 to-red-500',
    category: 'notes',
    requirement: { type: 'note_count', value: 100 },
    rarity: 'legendary'
  },
  {
    id: 'zen_master',
    title: 'Zen Master',
    description: 'Complete habits for 30 consecutive days',
    icon: '🧘',
    color: 'from-green-400 via-blue-500 to-purple-600',
    category: 'milestones',
    requirement: { type: 'consecutive_days', value: 30 },
    rarity: 'legendary'
  },

  // Special Achievements
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete habits before 8 AM for 7 days',
    icon: '🌅',
    color: 'from-orange-300 to-yellow-500',
    category: 'special',
    requirement: { type: 'special', value: 1 },
    rarity: 'rare'
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Write notes after 10 PM for 5 days',
    icon: '🦉',
    color: 'from-indigo-500 to-purple-700',
    category: 'special',
    requirement: { type: 'special', value: 2 },
    rarity: 'rare'
  },
  {
    id: 'rainbow_collector',
    title: 'Rainbow Collector',
    description: 'Create habits in all 5 categories',
    icon: '🌈',
    color: 'from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400',
    category: 'special',
    requirement: { type: 'special', value: 3 },
    rarity: 'epic'
  }
];

export const getRarityColor = (rarity: Achievement['rarity']) => {
  switch (rarity) {
    case 'common':
      return 'from-gray-400 to-gray-600';
    case 'rare':
      return 'from-blue-400 to-blue-600';
    case 'epic':
      return 'from-purple-400 to-purple-600';
    case 'legendary':
      return 'from-yellow-400 via-orange-500 to-red-500';
    default:
      return 'from-gray-400 to-gray-600';
  }
};

export const getRarityBorder = (rarity: Achievement['rarity']) => {
  switch (rarity) {
    case 'common':
      return 'border-gray-300 dark:border-gray-600';
    case 'rare':
      return 'border-blue-300 dark:border-blue-600';
    case 'epic':
      return 'border-purple-300 dark:border-purple-600';
    case 'legendary':
      return 'border-yellow-300 dark:border-yellow-600';
    default:
      return 'border-gray-300 dark:border-gray-600';
  }
};