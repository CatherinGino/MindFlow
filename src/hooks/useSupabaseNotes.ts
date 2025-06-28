import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useLocalStorage } from './useLocalStorage';
import { Note, DatabaseNote } from '../types';

// Transform database note to app note
const transformNote = (dbNote: DatabaseNote): Note => ({
  id: dbNote.id,
  title: dbNote.title,
  content: dbNote.content,
  type: (dbNote.type as any) || 'text',
  mediaUrl: dbNote.mediaurl || undefined,
  tags: Array.isArray(dbNote.tags) ? dbNote.tags : [],
  stickers: Array.isArray(dbNote.stickers) ? dbNote.stickers : [],
  mood: dbNote.mood || undefined,
  createdAt: dbNote.created_at,
  updatedAt: dbNote.updated_at,
  user_id: dbNote.user_id,
});

export function useSupabaseNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Local storage fallback
  const [localNotes, setLocalNotes] = useLocalStorage<Note[]>('mindflow-notes', []);

  // Memoize this to prevent unnecessary re-renders
  const useSupabase = useMemo(() => isSupabaseConfigured && user, [user]);

  // Fetch notes from Supabase or use local storage
  useEffect(() => {
    let mounted = true;

    const fetchNotes = async () => {
      if (!mounted) return;
      
      // If not using Supabase, load from local storage immediately
      if (!useSupabase) {
        setNotes(localNotes);
        setLoading(false);
        return;
      }

      try {
        // Increased timeout to 5 seconds for better reliability
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Fetch timeout')), 5000)
        );
        
        const fetchPromise = supabase
          .from('notes')
          .select('*')
          .eq('user_id', user!.id)
          .order('created_at', { ascending: false });

        const { data, error } = await Promise.race([
          fetchPromise,
          timeoutPromise
        ]) as any;

        if (mounted) {
          if (error) throw error;
          const transformedNotes = (data || []).map(transformNote);
          setNotes(transformedNotes);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
        if (mounted) {
          // Fallback to local storage on error
          setNotes(localNotes);
          setLoading(false);
        }
      }
    };

    fetchNotes();

    return () => {
      mounted = false;
    };
  }, [useSupabase, user?.id, localNotes]);

  const addNote = useCallback(async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'user_id'>) => {
    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(),
      stickers: note.stickers || [], // Ensure stickers array exists
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Always update local state first for immediate UI response
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    setLocalNotes(updatedNotes);

    if (!useSupabase) {
      return;
    }

    // Background sync to Supabase
    try {
      const noteWithUserId = {
        id: newNote.id,
        user_id: user!.id,
        title: newNote.title,
        content: newNote.content,
        type: newNote.type,
        mediaurl: newNote.mediaUrl || null,
        tags: newNote.tags,
        stickers: newNote.stickers,
        mood: newNote.mood || null,
        created_at: newNote.createdAt,
        updated_at: newNote.updatedAt,
      };

      const { data, error } = await supabase
        .from('notes')
        .insert([noteWithUserId])
        .select()
        .single();

      if (error) throw error;
      
      // Update with server response
      const transformedNote = transformNote(data);
      setNotes(prev => prev.map(n => n.id === newNote.id ? transformedNote : n));
    } catch (error) {
      console.error('Error adding note:', error);
      // Local storage already updated, so no need to do anything else
    }
  }, [user, useSupabase, notes, setLocalNotes]);

  const updateNote = useCallback(async (noteId: string, updates: Partial<Note>) => {
    const updatedNote = { ...updates, updatedAt: new Date().toISOString() };

    // Always update local state first for immediate UI response
    const updatedNotes = notes.map(note => 
      note.id === noteId ? { ...note, ...updatedNote } : note
    );
    setNotes(updatedNotes);
    setLocalNotes(updatedNotes);

    if (!useSupabase) {
      return;
    }

    // Background sync to Supabase
    try {
      const dbUpdates: any = {
        updated_at: new Date().toISOString()
      };

      // Map app fields to database fields
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.content !== undefined) dbUpdates.content = updates.content;
      if (updates.type !== undefined) dbUpdates.type = updates.type;
      if (updates.mediaUrl !== undefined) dbUpdates.mediaurl = updates.mediaUrl;
      if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
      if (updates.stickers !== undefined) dbUpdates.stickers = updates.stickers;
      if (updates.mood !== undefined) dbUpdates.mood = updates.mood;

      const { error } = await supabase
        .from('notes')
        .update(dbUpdates)
        .eq('id', noteId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating note:', error);
      // Local storage already updated, so no need to do anything else
    }
  }, [user, useSupabase, notes, setLocalNotes]);

  const deleteNote = useCallback(async (noteId: string) => {
    // Always update local state first for immediate UI response
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    setLocalNotes(updatedNotes);

    if (!useSupabase) {
      return;
    }

    // Background sync to Supabase
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting note:', error);
      // Local storage already updated, so no need to do anything else
    }
  }, [user, useSupabase, notes, setLocalNotes]);

  return {
    notes,
    loading,
    addNote,
    updateNote,
    deleteNote,
  };
}