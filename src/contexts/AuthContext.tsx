import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  authError: string | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  spotifyToken: string | null;
  connectSpotify: () => void;
  disconnectSpotify: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);

  // Memoized callbacks to prevent unnecessary re-renders
  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: { message: 'Supabase not configured' } };
    }

    try {
      // Clear any previous auth errors
      setAuthError(null);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    if (!isSupabaseConfigured) {
      return { error: { message: 'Supabase not configured' } };
    }

    try {
      // Clear any previous auth errors
      setAuthError(null);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      return { error };
    } catch (error) {
      return { error };
    }
  }, []);

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) {
      try {
        // Clear auth error when signing out
        setAuthError(null);
        await supabase.auth.signOut();
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const connectSpotify = useCallback(() => {
    if (!user || !isSupabaseConfigured) {
      console.error('Cannot connect Spotify: user not authenticated or Supabase not configured');
      return;
    }

    const spotifyClientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    if (!spotifyClientId) {
      console.error('Spotify client ID not configured');
      return;
    }
    
    const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
      response_type: 'code',
      client_id: spotifyClientId,
      scope: 'user-read-private user-read-email playlist-read-private playlist-read-collaborative user-library-read user-top-read user-read-recently-played',
      redirect_uri: `${window.location.origin}/spotify-callback`,
      state: user.id || ''
    }).toString()}`;
    
    window.location.href = authUrl;
  }, [user]);

  const disconnectSpotify = useCallback(async () => {
    if (user && isSupabaseConfigured) {
      try {
        await supabase
          .from('user_profiles')
          .update({ 
            spotify_access_token: null,
            spotify_refresh_token: null 
          })
          .eq('id', user.id);
        
        setSpotifyToken(null);
      } catch (error) {
        console.error('Error disconnecting Spotify:', error);
      }
    }
  }, [user]);

  useEffect(() => {
    // If Supabase isn't configured, set loading to false immediately
    if (!isSupabaseConfigured) {
      setLoading(false);
      setUser(null);
      setSession(null);
      return;
    }

    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Reduced timeout for faster response
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Auth timeout')), 3000)
        );
        
        const sessionPromise = supabase.auth.getSession();
        
        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
        if (mounted) {
          if (error) {
            console.error('Error getting session:', error);
            
            // Check if it's a refresh token error
            if (error.message && error.message.includes('Invalid Refresh Token')) {
              // Clear stale tokens and set user-friendly error message
              try {
                await supabase.auth.signOut();
              } catch (signOutError) {
                console.error('Error signing out after invalid refresh token:', signOutError);
              }
              setAuthError('Your session has expired or is invalid. Please log in again.');
            }
          }
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error: any) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          // Check if it's a refresh token error in the catch block as well
          if (error.message && error.message.includes('Invalid Refresh Token')) {
            try {
              await supabase.auth.signOut();
            } catch (signOutError) {
              console.error('Error signing out after invalid refresh token:', signOutError);
            }
            setAuthError('Your session has expired or is invalid. Please log in again.');
          }
          setLoading(false);
          setUser(null);
          setSession(null);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        // Clear auth error on successful auth state changes
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setAuthError(null);
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Only fetch Spotify token if user exists and we don't already have it
        if (session?.user && !spotifyToken) {
          try {
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Spotify check timeout')), 2000)
            );
            
            const spotifyPromise = supabase
              .from('user_profiles')
              .select('spotify_access_token')
              .eq('id', session.user.id)
              .maybeSingle();
            
            const { data } = await Promise.race([
              spotifyPromise,
              timeoutPromise
            ]) as any;
            
            if (mounted) {
              setSpotifyToken(data?.spotify_access_token || null);
            }
          } catch (error) {
            // Silently fail for Spotify token fetch to not block the app
            if (mounted) {
              setSpotifyToken(null);
            }
          }
        } else if (!session?.user) {
          if (mounted) {
            setSpotifyToken(null);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [spotifyToken]);

  const value = {
    user,
    session,
    loading,
    authError,
    signIn,
    signUp,
    signOut,
    spotifyToken,
    connectSpotify,
    disconnectSpotify,
    clearAuthError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}