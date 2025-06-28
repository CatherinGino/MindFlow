/*
  # Create habits table

  1. New Tables
    - `habits`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text, required)
      - `description` (text)
      - `category` (text)
      - `color` (text)
      - `icon` (text)
      - `frequency` (text)
      - `streak` (integer, default 0)
      - `completions` (jsonb, default empty array)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `habits` table
    - Add policies for users to manage their own habits
*/

CREATE TABLE IF NOT EXISTS public.habits (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    category text,
    color text,
    icon text,
    frequency text,
    streak integer DEFAULT 0,
    completions jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own habits"
    ON public.habits
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habits"
    ON public.habits
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits"
    ON public.habits
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits"
    ON public.habits
    FOR DELETE
    USING (auth.uid() = user_id);