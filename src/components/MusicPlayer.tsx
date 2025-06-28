import React from 'react';
import { ExternalLink, Play, Headphones } from 'lucide-react';
import { spotifyPlaylists } from '../data/spotifyPlaylists';

export function MusicPlayer() {
  const categories = {
    meditation: { name: 'Meditation', color: 'from-purple-500 to-purple-600' },
    focus: { name: 'Focus', color: 'from-blue-500 to-blue-600' },
    relaxation: { name: 'Relaxation', color: 'from-green-500 to-green-600' },
    motivation: { name: 'Motivation', color: 'from-orange-500 to-orange-600' },
    sleep: { name: 'Sleep', color: 'from-indigo-500 to-indigo-600' },
  };

  const groupedPlaylists = spotifyPlaylists.reduce((acc, playlist) => {
    if (!acc[playlist.category]) {
      acc[playlist.category] = [];
    }
    acc[playlist.category].push(playlist);
    return acc;
  }, {} as Record<string, typeof spotifyPlaylists>);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Wellness Music</h1>
        <p className="text-gray-600">Curated playlists to support your mental health journey</p>
      </div>

      {/* Featured Playlist */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Featured: Peaceful Mind</h2>
            <p className="text-indigo-100 mb-4">
              Start your mindfulness journey with our most popular meditation playlist
            </p>
            <a
              href={spotifyPlaylists[0].spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              <Play size={20} />
              <span>Listen on Spotify</span>
              <ExternalLink size={16} />
            </a>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
              <Headphones size={48} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Playlist Categories */}
      {Object.entries(groupedPlaylists).map(([category, playlists]) => (
        <div key={category} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 capitalize">
            {categories[category as keyof typeof categories].name}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-9 relative">
                  <img
                    src={playlist.imageUrl}
                    alt={playlist.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${categories[category as keyof typeof categories].color} opacity-60`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white bg-opacity-20 rounded-full p-4">
                      <Play size={24} className="text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{playlist.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {playlist.description}
                  </p>
                  
                  <a
                    href={playlist.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium"
                  >
                    <span>Listen on Spotify</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Spotify Integration Info */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
        <div className="flex items-start space-x-4">
          <div className="bg-green-500 rounded-full p-2">
            <Headphones size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-green-900 mb-2">About Our Playlists</h3>
            <p className="text-green-700 text-sm mb-3">
              Our curated playlists are designed to support different aspects of mental wellness. 
              Each playlist is carefully selected to help you focus, relax, meditate, or find motivation 
              throughout your day.
            </p>
            <p className="text-green-700 text-sm">
              <strong>Note:</strong> You'll need a Spotify account to access these playlists. 
              Free accounts can listen with ads, while Premium accounts enjoy uninterrupted listening.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}