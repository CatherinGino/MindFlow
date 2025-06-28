import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Loader2, AlertCircle } from 'lucide-react';

export function SpotifyCallback() {
  const { user } = useAuth();

  useEffect(() => {
    const handleSpotifyCallback = async () => {
      if (!isSupabaseConfigured) {
        window.location.href = '/?error=supabase_not_configured';
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');

      // Handle Spotify authorization errors
      if (error) {
        console.error('Spotify authorization error:', error);
        window.location.href = `/?error=spotify_auth_${error}`;
        return;
      }

      if (code && state && user && state === user.id) {
        try {
          const spotifyClientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
          const spotifyClientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

          if (!spotifyClientId || !spotifyClientSecret) {
            throw new Error('Spotify credentials not configured');
          }

          // Exchange code for access token
          const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${btoa(`${spotifyClientId}:${spotifyClientSecret}`)}`,
            },
            body: new URLSearchParams({
              grant_type: 'authorization_code',
              code,
              redirect_uri: `${window.location.origin}/spotify-callback`,
            }),
          });

          if (!response.ok) {
            const errorData = await response.text();
            console.error('Spotify token exchange failed:', response.status, errorData);
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const tokenData = await response.json();

          if (tokenData.access_token) {
            // Store tokens in Supabase
            const { error: dbError } = await supabase
              .from('user_profiles')
              .upsert({
                id: user.id,
                spotify_access_token: tokenData.access_token,
                spotify_refresh_token: tokenData.refresh_token,
                spotify_connected_at: new Date().toISOString(),
              });

            if (dbError) {
              console.error('Error storing Spotify tokens:', dbError);
              throw dbError;
            }

            // Redirect back to the app with success
            window.location.href = '/?spotify=connected';
          } else {
            console.error('No access token received from Spotify');
            window.location.href = '/?error=spotify_token_failed';
          }
        } catch (error) {
          console.error('Error connecting Spotify:', error);
          window.location.href = '/?error=spotify_connection_failed';
        }
      } else {
        console.error('Invalid callback parameters:', { code: !!code, state, userId: user?.id });
        window.location.href = '/?error=invalid_spotify_callback';
      }
    };

    // Add a small delay to ensure user is loaded
    const timer = setTimeout(handleSpotifyCallback, 1000);
    return () => clearTimeout(timer);
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center transition-colors duration-300">
      <div className="text-center max-w-md mx-auto p-6">
        {!isSupabaseConfigured ? (
          <div className="space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Configuration Error</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Supabase is not configured. Spotify integration requires a database connection.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to App
            </button>
          </div>
        ) : !user ? (
          <div className="space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Waiting for Authentication</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Please wait while we verify your account...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Connecting Spotify</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Please wait while we connect your Spotify account...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}