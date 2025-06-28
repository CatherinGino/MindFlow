import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SignIn } from './SignIn';
import { Loader2 } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, loading, authError } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);

  // If Supabase isn't configured, skip authentication entirely
  if (!isSupabaseConfigured) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading MindFlow...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <SignIn 
        onToggleMode={() => setIsSignUp(!isSignUp)} 
        isSignUp={isSignUp}
        authErrorMessage={authError}
      />
    );
  }

  return <>{children}</>;
}