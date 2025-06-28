import React from 'react';
import { Trophy, Lock, Star } from 'lucide-react';
import { Achievement, achievements, getRarityColor, getRarityBorder } from '../data/achievements';

interface AchievementBadgesProps {
  unlockedAchievements: Achievement[];
  achievementProgress: { [key: string]: { progress: number; total: number; percentage: number } };
}

export function AchievementBadges({ unlockedAchievements, achievementProgress }: AchievementBadgesProps) {
  const unlockedIds = unlockedAchievements.map(a => a.id);

  const groupedAchievements = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  const categoryNames = {
    habits: 'Habit Mastery',
    notes: 'Mindful Writing',
    streaks: 'Consistency',
    milestones: 'Major Milestones',
    special: 'Special Achievements'
  };

  const categoryIcons = {
    habits: '🎯',
    notes: '📝',
    streaks: '🔥',
    milestones: '🏆',
    special: '⭐'
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Achievement Collection</h2>
        <p className="text-gray-600 dark:text-gray-300">
          {unlockedAchievements.length} of {achievements.length} achievements unlocked
        </p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-4">
          <div
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(unlockedAchievements.length / achievements.length) * 100}%` }}
          />
        </div>
      </div>

      {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
        <div key={category} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-2xl">{categoryIcons[category as keyof typeof categoryIcons]}</span>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {categoryNames[category as keyof typeof categoryNames]}
            </h3>
            <div className="flex-1 text-right">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {categoryAchievements.filter(a => unlockedIds.includes(a.id)).length} / {categoryAchievements.length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryAchievements.map(achievement => {
              const isUnlocked = unlockedIds.includes(achievement.id);
              const progress = achievementProgress[achievement.id];

              return (
                <div
                  key={achievement.id}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                    isUnlocked
                      ? `${getRarityBorder(achievement.rarity)} bg-gradient-to-br ${achievement.color} text-white shadow-lg transform hover:scale-105`
                      : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {/* Rarity Indicator */}
                  <div className="absolute top-2 right-2">
                    {isUnlocked ? (
                      <div className="flex items-center space-x-1">
                        <Trophy size={16} className="text-yellow-300" />
                        {achievement.rarity === 'legendary' && <Star size={12} className="text-yellow-300" />}
                      </div>
                    ) : (
                      <Lock size={16} className="text-gray-400 dark:text-gray-500" />
                    )}
                  </div>

                  {/* Achievement Content */}
                  <div className="space-y-3">
                    <div className="text-3xl">{achievement.icon}</div>
                    
                    <div>
                      <h4 className={`font-semibold ${isUnlocked ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        {achievement.title}
                      </h4>
                      <p className={`text-sm ${isUnlocked ? 'text-white text-opacity-90' : 'text-gray-600 dark:text-gray-300'}`}>
                        {achievement.description}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    {!isUnlocked && progress && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>{progress.progress} / {progress.total}</span>
                          <span>{Math.round(progress.percentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Rarity Badge */}
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        isUnlocked
                          ? 'bg-white bg-opacity-20 text-white'
                          : achievement.rarity === 'common'
                          ? 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                          : achievement.rarity === 'rare'
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : achievement.rarity === 'epic'
                          ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                          : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                      }`}>
                        {achievement.rarity}
                      </span>
                      
                      {isUnlocked && (
                        <div className="text-xs text-white text-opacity-75">
                          ✓ Unlocked
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}