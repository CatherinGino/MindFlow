# MindFlow - Mental Health & Wellness Application

created using @bolt.new

A comprehensive mental health and wellness application built with React, TypeScript, and Tailwind CSS. MindFlow helps users track habits, keep personal notes, listen to curated wellness music, and monitor their mental health journey through insights and achievements.

## 🌟 Features

### 🎯 Habit Tracking
- Create and manage daily, weekly, or monthly habits
- Visual streak tracking with fire icons
- Category-based organization (Mental, Physical, Social, Spiritual, Creative)
- Interactive 7-day completion grid
- Automatic streak calculation

### 📝 Notes & Journaling
- Rich text note-taking with mood tracking
- Customizable stickers and emoji reactions
- Tag-based organization system
- Search functionality across all notes
- Mood scale from 1-5 with visual indicators

### 🎵 Wellness Music
- Curated Spotify playlists for different moods
- Categories: Meditation, Focus, Relaxation, Motivation, Sleep
- Direct integration with Spotify (optional)
- Beautiful playlist cards with cover images

### 📊 Insights & Analytics
- Personal dashboard with key metrics
- Weekly progress visualization
- Habit category breakdown
- Mood tracking over time
- Achievement progress monitoring

### 🏆 Achievement System
- 25+ unique achievements to unlock
- Rarity system: Common, Rare, Epic, Legendary
- Progress tracking for each achievement
- Celebration animations when unlocked
- Achievement collection gallery

### 🎨 User Experience
- Beautiful, modern UI with dark/light theme support
- Responsive design for all devices
- Smooth animations and micro-interactions
- Comprehensive settings and customization
- Profile management with avatar support

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- (Optional) Supabase account for cloud sync
- (Optional) Spotify Developer account for music integration

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mindflow-app.git
   cd mindflow-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase Configuration (Optional - for cloud sync)
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Spotify Configuration (Optional - for music integration)
   VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
   VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🗄️ Database Setup (Optional)

MindFlow works in two modes:

### Local Mode (Default)
- All data stored in browser localStorage
- No account required
- Perfect for trying out the app
- Data stays on your device

### Cloud Mode (with Supabase)
- User authentication and profiles
- Cross-device synchronization
- Spotify integration support
- Secure cloud storage

To enable cloud mode:

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Run the database migrations**
   ```bash
   # Install Supabase CLI
   npm install -g @supabase/cli
   
   # Initialize Supabase
   supabase init
   
   # Link to your project
   supabase link --project-ref your-project-ref
   
   # Push migrations
   supabase db push
   ```

3. **Update your `.env` file** with your Supabase credentials

## 🎵 Spotify Integration (Optional)

To enable Spotify music features:

1. **Create a Spotify App** at [developer.spotify.com](https://developer.spotify.com)

2. **Configure redirect URI**: `http://localhost:5173/spotify-callback`

3. **Add credentials to `.env`**:
   ```env
   VITE_SPOTIFY_CLIENT_ID=your_client_id
   VITE_SPOTIFY_CLIENT_SECRET=your_client_secret
   ```

4. **Users can connect their Spotify accounts** in the Profile section

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── Auth/            # Authentication components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── HabitsTracker.tsx
│   ├── NotesKeeper.tsx
│   ├── MusicPlayer.tsx
│   ├── Insights.tsx
│   └── UserProfile.tsx
├── contexts/            # React contexts
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── hooks/               # Custom React hooks
│   ├── useSupabaseHabits.ts
│   ├── useSupabaseNotes.ts
│   ├── useAchievements.ts
│   └── useLocalStorage.ts
├── data/                # Static data and configurations
│   ├── achievements.ts
│   ├── spotifyPlaylists.ts
│   └── stickers.ts
├── types/               # TypeScript type definitions
└── lib/                 # Utility libraries
    └── supabase.ts
```

## 🛠️ Built With

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Supabase** - Backend and authentication
- **React Router** - Navigation
- **Lucide React** - Icons
- **Spotify Web API** - Music integration

## 🎨 Design Philosophy

MindFlow follows Apple-level design aesthetics with:
- Clean, minimalist interface
- Thoughtful micro-interactions
- Consistent spacing and typography
- Accessible color schemes
- Responsive design patterns
- Smooth animations and transitions

## 🔒 Privacy & Security

- **Local-first approach**: Works completely offline
- **Optional cloud sync**: Users choose what to sync
- **Secure authentication**: Powered by Supabase Auth
- **Row-level security**: Database policies protect user data
- **No tracking**: No analytics or user tracking by default

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev)
- Images from [Pexels](https://pexels.com)
- Inspiration from modern wellness apps
- Mental health advocacy community

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/mindflow-app/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Made with ❤️ for mental health and wellness**
