import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Note } from '../types';

export function useNotes() {
  const [notes, setNotes] = useLocalStorage<Note[]>('mindflow-notes', []);

  const addNote = useCallback((note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(),
      stickers: note.stickers || [], // Ensure stickers array exists
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev]);
  }, [setNotes]);

  const updateNote = useCallback((noteId: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { ...note, ...updates, updatedAt: new Date().toISOString() }
        : note
    ));
  }, [setNotes]);

  const deleteNote = useCallback((noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  }, [setNotes]);

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
  };
}