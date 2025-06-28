export interface Sticker {
  id: string;
  emoji: string;
  name: string;
  category: 'emotions' | 'nature' | 'activities' | 'food' | 'animals' | 'objects';
}

export const stickers: Sticker[] = [
  // Emotions
  { id: 'happy', emoji: '😊', name: 'Happy', category: 'emotions' },
  { id: 'love', emoji: '🥰', name: 'Love', category: 'emotions' },
  { id: 'excited', emoji: '🤩', name: 'Excited', category: 'emotions' },
  { id: 'peaceful', emoji: '😌', name: 'Peaceful', category: 'emotions' },
  { id: 'grateful', emoji: '🙏', name: 'Grateful', category: 'emotions' },
  { id: 'proud', emoji: '😎', name: 'Proud', category: 'emotions' },
  { id: 'thinking', emoji: '🤔', name: 'Thinking', category: 'emotions' },
  { id: 'sleepy', emoji: '😴', name: 'Sleepy', category: 'emotions' },

  // Nature
  { id: 'sun', emoji: '☀️', name: 'Sunny', category: 'nature' },
  { id: 'rainbow', emoji: '🌈', name: 'Rainbow', category: 'nature' },
  { id: 'flower', emoji: '🌸', name: 'Flower', category: 'nature' },
  { id: 'tree', emoji: '🌳', name: 'Tree', category: 'nature' },
  { id: 'star', emoji: '⭐', name: 'Star', category: 'nature' },
  { id: 'moon', emoji: '🌙', name: 'Moon', category: 'nature' },
  { id: 'cloud', emoji: '☁️', name: 'Cloud', category: 'nature' },
  { id: 'leaf', emoji: '🍃', name: 'Leaf', category: 'nature' },

  // Activities
  { id: 'meditation', emoji: '🧘', name: 'Meditation', category: 'activities' },
  { id: 'exercise', emoji: '🏃', name: 'Exercise', category: 'activities' },
  { id: 'reading', emoji: '📚', name: 'Reading', category: 'activities' },
  { id: 'music', emoji: '🎵', name: 'Music', category: 'activities' },
  { id: 'art', emoji: '🎨', name: 'Art', category: 'activities' },
  { id: 'writing', emoji: '✍️', name: 'Writing', category: 'activities' },
  { id: 'travel', emoji: '✈️', name: 'Travel', category: 'activities' },
  { id: 'celebration', emoji: '🎉', name: 'Celebration', category: 'activities' },

  // Food
  { id: 'coffee', emoji: '☕', name: 'Coffee', category: 'food' },
  { id: 'tea', emoji: '🍵', name: 'Tea', category: 'food' },
  { id: 'cake', emoji: '🍰', name: 'Cake', category: 'food' },
  { id: 'pizza', emoji: '🍕', name: 'Pizza', category: 'food' },
  { id: 'apple', emoji: '🍎', name: 'Apple', category: 'food' },
  { id: 'avocado', emoji: '🥑', name: 'Avocado', category: 'food' },
  { id: 'ice-cream', emoji: '🍦', name: 'Ice Cream', category: 'food' },
  { id: 'donut', emoji: '🍩', name: 'Donut', category: 'food' },

  // Animals
  { id: 'cat', emoji: '🐱', name: 'Cat', category: 'animals' },
  { id: 'dog', emoji: '🐶', name: 'Dog', category: 'animals' },
  { id: 'butterfly', emoji: '🦋', name: 'Butterfly', category: 'animals' },
  { id: 'bird', emoji: '🐦', name: 'Bird', category: 'animals' },
  { id: 'bear', emoji: '🐻', name: 'Bear', category: 'animals' },
  { id: 'panda', emoji: '🐼', name: 'Panda', category: 'animals' },
  { id: 'unicorn', emoji: '🦄', name: 'Unicorn', category: 'animals' },
  { id: 'turtle', emoji: '🐢', name: 'Turtle', category: 'animals' },

  // Objects
  { id: 'heart', emoji: '💖', name: 'Heart', category: 'objects' },
  { id: 'sparkles', emoji: '✨', name: 'Sparkles', category: 'objects' },
  { id: 'gift', emoji: '🎁', name: 'Gift', category: 'objects' },
  { id: 'balloon', emoji: '🎈', name: 'Balloon', category: 'objects' },
  { id: 'crown', emoji: '👑', name: 'Crown', category: 'objects' },
  { id: 'gem', emoji: '💎', name: 'Gem', category: 'objects' },
  { id: 'key', emoji: '🗝️', name: 'Key', category: 'objects' },
  { id: 'lightbulb', emoji: '💡', name: 'Idea', category: 'objects' },
];

export const stickerCategories = [
  { id: 'emotions', name: 'Emotions', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400' },
  { id: 'nature', name: 'Nature', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
  { id: 'activities', name: 'Activities', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
  { id: 'food', name: 'Food', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' },
  { id: 'animals', name: 'Animals', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' },
  { id: 'objects', name: 'Objects', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400' },
];