import React, { useEffect, useState } from 'react';
import { X, Trophy, Star, Sparkles } from 'lucide-react';
import { Achievement, getRarityColor } from '../data/achievements';

interface AchievementCelebrationProps {
  achievements: Achievement[];
  onDismiss: () => void;
  show: boolean;
}

export function AchievementCelebration({ achievements, onDismiss, show }: AchievementCelebrationProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; delay: number }>>([]);

  useEffect(() => {
    if (show) {
      // Generate confetti particles
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 6)],
        delay: Math.random() * 2
      }));
      setParticles(newParticles);
    }
  }, [show]);

  if (!show || achievements.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      {/* Confetti Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-3 h-3 rounded-full animate-bounce"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              backgroundColor: particle.color,
              animationDelay: `${particle.delay}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>

      {/* Celebration Modal */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full mx-auto transform transition-all duration-500 scale-100 shadow-2xl border-4 border-yellow-400 relative">
        <div className="p-8 text-center">
          {/* Close Button */}
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors bg-gray-100 dark:bg-gray-700 rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <X size={20} />
          </button>

          {/* Celebration Header */}
          <div className="mb-6">
            <div className="relative inline-block">
              <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
              <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-spin" />
              <Star className="absolute -bottom-1 -left-2 w-6 h-6 text-yellow-400 animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              🎉 Achievement{achievements.length > 1 ? 's' : ''} Unlocked! 🎉
            </h2>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              Congratulations on your amazing progress!
            </p>
          </div>

          {/* Achievement Cards */}
          <div className="space-y-4 mb-8">
            {achievements.map((achievement, index) => (
              <div
                key={achievement.id}
                className={`p-5 rounded-2xl border-3 bg-gradient-to-r ${achievement.color} text-white transform transition-all duration-300 shadow-lg`}
                style={{
                  animationDelay: `${index * 0.2}s`
                }}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-5xl drop-shadow-lg">{achievement.icon}</div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-xl text-white drop-shadow-md">{achievement.title}</h3>
                    <p className="text-base text-white drop-shadow-sm font-medium opacity-95">{achievement.description}</p>
                    <div className="flex items-center mt-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold bg-white bg-opacity-25 backdrop-blur-sm capitalize border border-white border-opacity-30`}>
                        {achievement.rarity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={onDismiss}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 shadow-xl border-2 border-yellow-300 hover:border-yellow-200"
          >
            Awesome! 🚀
          </button>
        </div>
      </div>
    </div>
  );
}