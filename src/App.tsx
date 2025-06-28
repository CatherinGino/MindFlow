import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthWrapper } from './components/Auth/AuthWrapper';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { HabitsTracker } from './components/HabitsTracker';
import { NotesKeeper } from './components/NotesKeeper';
import { MusicPlayer } from './components/MusicPlayer';
import { Insights } from './components/Insights';
import { UserProfile } from './components/UserProfile';
import { SpotifyCallback } from './components/SpotifyCallback';
import { AchievementCelebration } from './components/AchievementCelebration';
import { useSupabaseHabits } from './hooks/useSupabaseHabits';
import { useSupabaseNotes } from './hooks/useSupabaseNotes';
import { useAchievements } from './hooks/useAchievements';

function AppContent() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  // Get habits and notes for achievement tracking
  const { habits } = useSupabaseHabits();
  const { notes } = useSupabaseNotes();
  const { newlyUnlocked, showCelebration, dismissCelebration } = useAchievements(habits, notes);

  // Memoize tab change handler to prevent unnecessary re-renders
  const handleTabChange = useCallback((tab: string) => {
    setCurrentTab(tab);
  }, []);

  // Handle note selection from dashboard
  const handleNoteSelect = useCallback((noteId: string) => {
    setSelectedNoteId(noteId);
  }, []);

  const renderCurrentTab = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard onTabChange={handleTabChange} onNoteSelect={handleNoteSelect} />;
      case 'habits':
        return <HabitsTracker />;
      case 'notes':
        return <NotesKeeper selectedNoteId={selectedNoteId} onNoteSelect={setSelectedNoteId} />;
      case 'music':
        return <MusicPlayer />;
      case 'insights':
        return <Insights />;
      case 'profile':
        return <UserProfile />;
      default:
        return <Dashboard onTabChange={handleTabChange} onNoteSelect={handleNoteSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Achievement Celebration - Global */}
      <AchievementCelebration
        achievements={newlyUnlocked}
        onDismiss={dismissCelebration}
        show={showCelebration}
      />

      <div className="flex flex-col md:flex-row">
        {/* Sidebar Navigation (Desktop) */}
        <div className="hidden md:block w-64 min-h-screen bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">MindFlow</h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Your mental wellness companion</p>
          </div>
          <Navigation currentTab={currentTab} onTabChange={handleTabChange} />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 pb-20 md:pb-6">
          <div className="max-w-6xl mx-auto">
            {renderCurrentTab()}
          </div>
        </div>

        {/* Bottom Navigation (Mobile) */}
        <div className="md:hidden">
          <Navigation currentTab={currentTab} onTabChange={handleTabChange} />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/spotify-callback" element={<SpotifyCallback />} />
            <Route path="/*" element={
              <AuthWrapper>
                <AppContent />
              </AuthWrapper>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;