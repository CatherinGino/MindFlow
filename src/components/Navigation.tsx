import React from 'react';
import { Home, Target, BookOpen, Music, BarChart3, User } from 'lucide-react';

interface NavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ currentTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'habits', label: 'Habits', icon: Target },
    { id: 'notes', label: 'Notes', icon: BookOpen },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 md:relative md:border-0 md:bg-transparent md:dark:bg-transparent md:px-0 md:py-0 transition-colors duration-300">
      <div className="flex justify-around md:flex-col md:space-y-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 md:flex-row md:space-y-0 md:space-x-3 md:justify-start md:w-full ${
              currentTab === id
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
            }`}
          >
            <Icon size={20} />
            <span className="text-xs md:text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}