export interface Habit {
  id: string;
  name: string;
  description: string;
  category: 'physical' | 'mental' | 'social' | 'spiritual' | 'creative';
  color: string;
  icon: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  streak: number;
  completions: { date: string; completed: boolean }[];
  createdAt: string;
  user_id?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'voice';
  mediaUrl?: string;
  tags: string[];
  stickers: string[]; // Array of sticker IDs
  mood?: number; // 1-5 scale
  createdAt: string;
  updatedAt: string;
  user_id?: string;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  spotifyUrl: string;
  imageUrl: string;
  category: 'meditation' | 'focus' | 'relaxation' | 'motivation' | 'sleep';
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: number; // 1-5 scale
  notes: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  spotify_access_token?: string;
  spotify_refresh_token?: string;
  spotify_connected_at?: string;
  created_at: string;
  updated_at: string;
}

// Database types to match Supabase schema
export interface DatabaseHabit {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  category: string | null;
  color: string | null;
  icon: string | null;
  frequency: string | null;
  streak: number;
  completions: any; // jsonb
  created_at: string;
}

export interface DatabaseNote {
  id: string;
  user_id: string;
  title: string;
  content: string;
  type: string | null;
  mediaurl: string | null;
  tags: string[];
  stickers: string[]; // Array of sticker IDs
  mood: number | null;
  created_at: string;
  updated_at: string;
}