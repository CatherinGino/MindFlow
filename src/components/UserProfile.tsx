import React, { useState, useRef } from 'react';
import { User, Music, LogOut, Settings, Edit2, Check, X, Moon, Sun, ChevronRight, Bell, Shield, Palette, Clock, Target, BookOpen, Volume2, Vibrate, Eye, Globe, Download, Trash2, Camera, Upload, UserX } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AppSettings {
  notifications: {
    habitReminders: boolean;
    achievementCelebrations: boolean;
    dailySummary: boolean;
    weeklyReports: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
  };
  privacy: {
    dataCollection: boolean;
    analytics: boolean;
    crashReports: boolean;
    shareProgress: boolean;
  };
  appearance: {
    compactMode: boolean;
    animationsEnabled: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
    accentColor: string;
  };
  habits: {
    defaultReminder: string;
    weekStartsOn: 'sunday' | 'monday';
    showStreakAnimations: boolean;
    autoCompleteEnabled: boolean;
  };
  notes: {
    autoSave: boolean;
    defaultMood: number;
    showWordCount: boolean;
    enableMarkdown: boolean;
  };
  data: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    exportFormat: 'json' | 'csv';
  };
}

const defaultSettings: AppSettings = {
  notifications: {
    habitReminders: true,
    achievementCelebrations: true,
    dailySummary: false,
    weeklyReports: false,
    soundEnabled: true,
    vibrationEnabled: true,
  },
  privacy: {
    dataCollection: true,
    analytics: false,
    crashReports: true,
    shareProgress: false,
  },
  appearance: {
    compactMode: false,
    animationsEnabled: true,
    highContrast: false,
    fontSize: 'medium',
    accentColor: '#3B82F6',
  },
  habits: {
    defaultReminder: '09:00',
    weekStartsOn: 'monday',
    showStreakAnimations: true,
    autoCompleteEnabled: false,
  },
  notes: {
    autoSave: true,
    defaultMood: 3,
    showWordCount: false,
    enableMarkdown: false,
  },
  data: {
    autoBackup: true,
    backupFrequency: 'weekly',
    exportFormat: 'json',
  },
};

export function UserProfile() {
  const { user, signOut, spotifyToken, connectSpotify, disconnectSpotify } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(user?.user_metadata?.full_name || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [spotifyError, setSpotifyError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useLocalStorage<AppSettings>('mindflow-settings', defaultSettings);
  
  // Profile image states
  const [profileImage, setProfileImage] = useLocalStorage<string | null>('mindflow-profile-image', null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveName = async () => {
    if (!editedName.trim() || !user) return;

    setIsUpdating(true);
    try {
      if (isSupabaseConfigured) {
        // Update in Supabase auth metadata
        const { error } = await supabase.auth.updateUser({
          data: { full_name: editedName.trim() }
        });

        if (error) throw error;

        // Also update in user_profiles table if it exists
        await supabase
          .from('user_profiles')
          .upsert({
            id: user.id,
            full_name: editedName.trim(),
          });
      }

      setIsEditingName(false);
    } catch (error) {
      console.error('Error updating name:', error);
      // Reset to original name on error
      setEditedName(user?.user_metadata?.full_name || '');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedName(user?.user_metadata?.full_name || '');
    setIsEditingName(false);
  };

  const handleSpotifyConnect = () => {
    setSpotifyError('');
    
    // Check if Spotify client ID is configured
    const spotifyClientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    if (!spotifyClientId) {
      setSpotifyError('Spotify client ID not configured. Please add VITE_SPOTIFY_CLIENT_ID to your environment variables.');
      return;
    }

    if (!isSupabaseConfigured) {
      setSpotifyError('Supabase is not configured. Spotify integration requires a database connection.');
      return;
    }

    if (!user) {
      setSpotifyError('You must be signed in to connect Spotify.');
      return;
    }

    connectSpotify();
  };

  const updateSetting = (category: keyof AppSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const exportData = () => {
    // This would export user data in the selected format
    console.log('Exporting data in', settings.data.exportFormat, 'format');
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Profile image handlers
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB.');
      return;
    }

    setIsUploadingImage(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setProfileImage(result);
      setIsUploadingImage(false);
      setShowImageOptions(false);
    };
    reader.onerror = () => {
      alert('Error reading file. Please try again.');
      setIsUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setShowImageOptions(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (showSettings) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowSettings(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300 transform rotate-180" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">App Settings</h1>
            <p className="text-gray-600 dark:text-gray-300">Customize your MindFlow experience</p>
          </div>
        </div>

        {/* Notifications Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Habit Reminders</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Get reminded to complete your daily habits</p>
              </div>
              <button
                onClick={() => updateSetting('notifications', 'habitReminders', !settings.notifications.habitReminders)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.notifications.habitReminders ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications.habitReminders ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Achievement Celebrations</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Show celebrations when you unlock achievements</p>
              </div>
              <button
                onClick={() => updateSetting('notifications', 'achievementCelebrations', !settings.notifications.achievementCelebrations)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.notifications.achievementCelebrations ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications.achievementCelebrations ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Sound Effects</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Play sounds for interactions and notifications</p>
              </div>
              <button
                onClick={() => updateSetting('notifications', 'soundEnabled', !settings.notifications.soundEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.notifications.soundEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Theme</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Choose between light and dark mode</p>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDark ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDark ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Animations</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Enable smooth animations and transitions</p>
              </div>
              <button
                onClick={() => updateSetting('appearance', 'animationsEnabled', !settings.appearance.animationsEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.appearance.animationsEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.appearance.animationsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <p className="font-medium text-gray-900 dark:text-white mb-2">Font Size</p>
              <div className="flex space-x-2">
                {['small', 'medium', 'large'].map((size) => (
                  <button
                    key={size}
                    onClick={() => updateSetting('appearance', 'fontSize', size)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                      settings.appearance.fontSize === size
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-medium text-gray-900 dark:text-white mb-2">Accent Color</p>
              <div className="flex space-x-2">
                {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'].map((color) => (
                  <button
                    key={color}
                    onClick={() => updateSetting('appearance', 'accentColor', color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      settings.appearance.accentColor === color
                        ? 'border-gray-900 dark:border-white scale-110'
                        : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Habits Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Habits</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="font-medium text-gray-900 dark:text-white mb-2">Default Reminder Time</p>
              <input
                type="time"
                value={settings.habits.defaultReminder}
                onChange={(e) => updateSetting('habits', 'defaultReminder', e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <p className="font-medium text-gray-900 dark:text-white mb-2">Week Starts On</p>
              <div className="flex space-x-2">
                {['sunday', 'monday'].map((day) => (
                  <button
                    key={day}
                    onClick={() => updateSetting('habits', 'weekStartsOn', day)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                      settings.habits.weekStartsOn === day
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Streak Animations</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Show celebratory animations for streaks</p>
              </div>
              <button
                onClick={() => updateSetting('habits', 'showStreakAnimations', !settings.habits.showStreakAnimations)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.habits.showStreakAnimations ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.habits.showStreakAnimations ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Notes Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notes</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Auto Save</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Automatically save notes as you type</p>
              </div>
              <button
                onClick={() => updateSetting('notes', 'autoSave', !settings.notes.autoSave)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.notes.autoSave ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notes.autoSave ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <p className="font-medium text-gray-900 dark:text-white mb-2">Default Mood</p>
              <input
                type="range"
                min="1"
                max="5"
                value={settings.notes.defaultMood}
                onChange={(e) => updateSetting('notes', 'defaultMood', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mt-1">
                <span>😢</span>
                <span>😔</span>
                <span>😐</span>
                <span>😊</span>
                <span>😁</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Show Word Count</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Display word count while writing</p>
              </div>
              <button
                onClick={() => updateSetting('notes', 'showWordCount', !settings.notes.showWordCount)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.notes.showWordCount ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notes.showWordCount ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Privacy & Data</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Analytics</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Help improve the app with usage analytics</p>
              </div>
              <button
                onClick={() => updateSetting('privacy', 'analytics', !settings.privacy.analytics)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.privacy.analytics ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.privacy.analytics ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Auto Backup</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Automatically backup your data</p>
              </div>
              <button
                onClick={() => updateSetting('data', 'autoBackup', !settings.data.autoBackup)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.data.autoBackup ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.data.autoBackup ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <p className="font-medium text-gray-900 dark:text-white mb-2">Export Format</p>
              <div className="flex space-x-2">
                {['json', 'csv'].map((format) => (
                  <button
                    key={format}
                    onClick={() => updateSetting('data', 'exportFormat', format)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors uppercase ${
                      settings.data.exportFormat === format
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Data Management</h2>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={exportData}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <Download size={18} />
              <span>Export My Data</span>
            </button>

            <button
              onClick={resetSettings}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <Settings size={18} />
              <span>Reset Settings</span>
            </button>

            <button
              onClick={clearAllData}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <Trash2 size={18} />
              <span>Clear All Data</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your account and preferences</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
        <div className="flex items-center space-x-4 mb-6">
          {/* Profile Image Section */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-r from-blue-600 to-green-600 flex items-center justify-center">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-xl font-bold">
                  {user?.user_metadata?.full_name 
                    ? getInitials(user.user_metadata.full_name)
                    : <User className="w-10 h-10" />
                  }
                </span>
              )}
            </div>
            
            {/* Camera Button */}
            <button
              onClick={() => setShowImageOptions(!showImageOptions)}
              className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transition-colors"
              disabled={isUploadingImage}
            >
              {isUploadingImage ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera size={16} />
              )}
            </button>

            {/* Image Options Dropdown */}
            {showImageOptions && (
              <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-2 z-10 min-w-[160px]">
                <button
                  onClick={triggerFileInput}
                  className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center space-x-2"
                >
                  <Upload size={16} />
                  <span>Upload Image</span>
                </button>
                {profileImage && (
                  <button
                    onClick={handleRemoveImage}
                    className="w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                  >
                    <UserX size={16} />
                    <span>Remove Image</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <div className="flex-1">
            {isEditingName ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="text-xl font-semibold bg-transparent border-b-2 border-blue-500 focus:outline-none text-gray-900 dark:text-white"
                  placeholder="Enter your name"
                  disabled={isUpdating}
                />
                <button
                  onClick={handleSaveName}
                  disabled={isUpdating || !editedName.trim()}
                  className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50"
                >
                  <Check size={18} />
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                  className="p-1 text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {user?.user_metadata?.full_name || 'User'}
                </h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            )}
            <p className="text-gray-600 dark:text-gray-300">{user?.email || 'No email available'}</p>
          </div>
        </div>

        {/* Click outside to close image options */}
        {showImageOptions && (
          <div
            className="fixed inset-0 z-5"
            onClick={() => setShowImageOptions(false)}
          />
        )}

        <div className="space-y-4">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl transition-colors duration-300">
            <div className="flex items-center space-x-3">
              {isDark ? <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Theme</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {isDark ? 'Dark mode' : 'Light mode'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isDark ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDark ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Spotify Connection */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl transition-colors duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Music className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Spotify Integration</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {isSupabaseConfigured && user ? (
                      spotifyToken ? 'Connected' : 'Not connected'
                    ) : (
                      'Requires account and database'
                    )}
                  </p>
                </div>
              </div>
              
              {isSupabaseConfigured && user ? (
                spotifyToken ? (
                  <button
                    onClick={disconnectSpotify}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={handleSpotifyConnect}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    Connect
                  </button>
                )
              ) : (
                <span className="text-gray-400 dark:text-gray-500 text-sm">Unavailable</span>
              )}
            </div>

            {/* Error message */}
            {spotifyError && (
              <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm">{spotifyError}</p>
              </div>
            )}

            {/* Info message */}
            {(!isSupabaseConfigured || !user) && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-blue-600 dark:text-blue-400 text-sm">
                  {!isSupabaseConfigured 
                    ? 'Spotify integration requires Supabase to be configured for data storage.'
                    : 'Please sign in to connect your Spotify account.'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Account Actions */}
          <div className="space-y-2">
            <button 
              onClick={() => setShowSettings(true)}
              className="w-full flex items-center justify-between p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5" />
                <span>App Settings</span>
              </div>
              <ChevronRight className="w-5 h-5" />
            </button>
            
            {/* Only show sign out if Supabase is configured */}
            {isSupabaseConfigured && user && (
              <button
                onClick={signOut}
                className="w-full flex items-center space-x-3 p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>

          {/* App Info */}
          {!isSupabaseConfigured && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl transition-colors duration-300">
              <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Local Mode</h3>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                You're using MindFlow in local mode. Your data is stored locally in your browser. 
                To sync across devices and enable cloud features like Spotify integration, configure Supabase.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}