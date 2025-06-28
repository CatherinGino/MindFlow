/*
  # Add stickers column to notes table

  1. Changes
    - Add `stickers` column to `notes` table as text array
    - Set default value to empty array
    - Update existing rows to have empty array for stickers

  2. Security
    - No changes to RLS policies needed as this is just adding a column
*/

-- Add stickers column to notes table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notes' AND column_name = 'stickers'
  ) THEN
    ALTER TABLE notes ADD COLUMN stickers text[] DEFAULT '{}';
  END IF;
END $$;

-- Update existing rows to have empty array for stickers if they are null
UPDATE notes SET stickers = '{}' WHERE stickers IS NULL;