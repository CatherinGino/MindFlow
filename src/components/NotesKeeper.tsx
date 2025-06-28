import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, Trash2, Tag, Loader2, Smile, X } from 'lucide-react';
import { useSupabaseNotes } from '../hooks/useSupabaseNotes';
import { Note } from '../types';
import { stickers, stickerCategories, Sticker } from '../data/stickers';

interface NotesKeeperProps {
  selectedNoteId?: string | null;
  onNoteSelect?: (noteId: string | null) => void;
}

export function NotesKeeper({ selectedNoteId, onNoteSelect }: NotesKeeperProps) {
  const { notes, loading, addNote, updateNote, deleteNote } = useSupabaseNotes();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showStickers, setShowStickers] = useState(false);
  const [selectedStickerCategory, setSelectedStickerCategory] = useState<string>('emotions');
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    stickers: [] as string[],
    mood: 3,
  });

  // Handle note selection from dashboard
  useEffect(() => {
    if (selectedNoteId && notes.length > 0) {
      const note = notes.find(n => n.id === selectedNoteId);
      if (note) {
        setSelectedNote(note);
        // Clear the selected note ID after opening
        onNoteSelect?.(null);
      }
    }
  }, [selectedNoteId, notes, onNoteSelect]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.title.trim() && newNote.content.trim()) {
      addNote({
        ...newNote,
        type: 'text', // Always set to text since we removed the option
      });
      setNewNote({
        title: '',
        content: '',
        tags: [],
        stickers: [],
        mood: 3,
      });
      setShowAddForm(false);
      setShowStickers(false);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>, isEdit = false) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      const tag = e.currentTarget.value.trim();
      
      if (isEdit && selectedNote) {
        const updatedTags = [...selectedNote.tags, tag];
        updateNote(selectedNote.id, { tags: updatedTags });
        setSelectedNote({ ...selectedNote, tags: updatedTags });
      } else {
        setNewNote({
          ...newNote,
          tags: [...newNote.tags, tag]
        });
      }
      
      e.currentTarget.value = '';
    }
  };

  const removeTag = (tagToRemove: string, isEdit = false) => {
    if (isEdit && selectedNote) {
      const updatedTags = selectedNote.tags.filter(tag => tag !== tagToRemove);
      updateNote(selectedNote.id, { tags: updatedTags });
      setSelectedNote({ ...selectedNote, tags: updatedTags });
    } else {
      setNewNote({
        ...newNote,
        tags: newNote.tags.filter(tag => tag !== tagToRemove)
      });
    }
  };

  const addSticker = (stickerId: string, isEdit = false) => {
    if (isEdit && selectedNote) {
      if (!selectedNote.stickers?.includes(stickerId)) {
        const updatedStickers = [...(selectedNote.stickers || []), stickerId];
        updateNote(selectedNote.id, { stickers: updatedStickers });
        setSelectedNote({ ...selectedNote, stickers: updatedStickers });
      }
    } else {
      if (!newNote.stickers.includes(stickerId)) {
        setNewNote({
          ...newNote,
          stickers: [...newNote.stickers, stickerId]
        });
      }
    }
  };

  const removeSticker = (stickerToRemove: string, isEdit = false) => {
    if (isEdit && selectedNote) {
      const updatedStickers = (selectedNote.stickers || []).filter(sticker => sticker !== stickerToRemove);
      updateNote(selectedNote.id, { stickers: updatedStickers });
      setSelectedNote({ ...selectedNote, stickers: updatedStickers });
    } else {
      setNewNote({
        ...newNote,
        stickers: newNote.stickers.filter(sticker => sticker !== stickerToRemove)
      });
    }
  };

  const getStickerById = (id: string): Sticker | undefined => {
    return stickers.find(sticker => sticker.id === id);
  };

  const getMoodEmoji = (mood: number) => {
    const emojis = ['😢', '😔', '😐', '😊', '😁'];
    return emojis[mood - 1] || '😐';
  };

  const filteredStickers = stickers.filter(sticker => sticker.category === selectedStickerCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-300">Loading notes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notes Keeper</h1>
          <p className="text-gray-600 dark:text-gray-300">Capture your thoughts and memories</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 shadow-md hover:shadow-lg"
        >
          <Plus size={20} />
          <span>Add Note</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
        />
      </div>

      {/* Add Note Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <form onSubmit={handleAddNote} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                placeholder="Enter note title..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content
              </label>
              <textarea
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                placeholder="Write your thoughts..."
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mood {getMoodEmoji(newNote.mood)}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={newNote.mood}
                onChange={(e) => setNewNote({ ...newNote, mood: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>😢</span>
                <span>😔</span>
                <span>😐</span>
                <span>😊</span>
                <span>😁</span>
              </div>
            </div>

            {/* Stickers Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Stickers
                </label>
                <button
                  type="button"
                  onClick={() => setShowStickers(!showStickers)}
                  className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm flex items-center space-x-1"
                >
                  <Smile size={16} />
                  <span>{showStickers ? 'Hide' : 'Add'} Stickers</span>
                </button>
              </div>

              {/* Selected Stickers */}
              {newNote.stickers.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {newNote.stickers.map((stickerId) => {
                    const sticker = getStickerById(stickerId);
                    return sticker ? (
                      <button
                        key={stickerId}
                        type="button"
                        onClick={() => removeSticker(stickerId)}
                        className="text-2xl hover:scale-110 transition-transform bg-gray-100 dark:bg-gray-700 rounded-lg p-1 hover:bg-gray-200 dark:hover:bg-gray-600"
                        title={`Remove ${sticker.name}`}
                      >
                        {sticker.emoji}
                      </button>
                    ) : null;
                  })}
                </div>
              )}

              {/* Sticker Picker */}
              {showStickers && (
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                  {/* Category Tabs */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {stickerCategories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setSelectedStickerCategory(category.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          selectedStickerCategory === category.id
                            ? category.color
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>

                  {/* Stickers Grid */}
                  <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto">
                    {filteredStickers.map((sticker) => (
                      <button
                        key={sticker.id}
                        type="button"
                        onClick={() => addSticker(sticker.id)}
                        className={`text-2xl p-2 rounded-lg hover:scale-110 transition-transform ${
                          newNote.stickers.includes(sticker.id)
                            ? 'bg-green-100 dark:bg-green-900/20 ring-2 ring-green-500'
                            : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        title={sticker.name}
                      >
                        {sticker.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {newNote.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-2 py-1 rounded-full text-xs flex items-center space-x-1"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add tags (press Enter)..."
                onKeyDown={handleTagInput}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
              >
                Add Note
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setShowStickers(false);
                }}
                className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedNote(note)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <FileText size={16} className="text-gray-500 dark:text-gray-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{note.title}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getMoodEmoji(note.mood || 3)}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                  className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3">{note.content}</p>

            {/* Stickers Display */}
            {note.stickers && note.stickers.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {note.stickers.slice(0, 6).map((stickerId) => {
                  const sticker = getStickerById(stickerId);
                  return sticker ? (
                    <span key={stickerId} className="text-lg" title={sticker.name}>
                      {sticker.emoji}
                    </span>
                  ) : null;
                })}
                {note.stickers.length > 6 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 self-center">+{note.stickers.length - 6}</span>
                )}
              </div>
            )}

            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {note.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {note.tags.length > 3 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">+{note.tags.length - 3} more</span>
                )}
              </div>
            )}

            <div className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(note.createdAt).toLocaleDateString()} • {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileText size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No notes found</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {searchTerm 
              ? 'Try adjusting your search criteria' 
              : 'Start documenting your journey!'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
            >
              Create Your First Note
            </button>
          )}
        </div>
      )}

      {/* Note Detail Modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <FileText size={20} className="text-gray-500 dark:text-gray-400" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedNote.title}</h2>
                  <span className="text-2xl">{getMoodEmoji(selectedNote.mood || 3)}</span>
                </div>
                <button
                  onClick={() => setSelectedNote(null)}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="prose max-w-none mb-4">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedNote.content}</p>
              </div>

              {/* Stickers in Modal */}
              {selectedNote.stickers && selectedNote.stickers.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Stickers</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedNote.stickers.map((stickerId) => {
                      const sticker = getStickerById(stickerId);
                      return sticker ? (
                        <span
                          key={stickerId}
                          className="text-2xl bg-gray-100 dark:bg-gray-700 rounded-lg p-2"
                          title={sticker.name}
                        >
                          {sticker.emoji}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {selectedNote.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedNote.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-2 py-1 rounded-full text-sm flex items-center space-x-1"
                    >
                      <Tag size={12} />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              )}

              <div className="text-sm text-gray-500 dark:text-gray-400 border-t dark:border-gray-600 pt-4">
                <p>Created: {new Date(selectedNote.createdAt).toLocaleString()}</p>
                <p>Updated: {new Date(selectedNote.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}