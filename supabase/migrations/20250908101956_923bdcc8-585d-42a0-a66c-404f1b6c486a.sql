-- Update ai_suggestions table to include all required fields for theme generation
ALTER TABLE ai_suggestions 
ADD COLUMN IF NOT EXISTS type text DEFAULT 'layout',
ADD COLUMN IF NOT EXISTS title text DEFAULT '',
ADD COLUMN IF NOT EXISTS description text DEFAULT '',
ADD COLUMN IF NOT EXISTS impact text DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS effort text DEFAULT 'easy',
ADD COLUMN IF NOT EXISTS confidence numeric DEFAULT 0.8,
ADD COLUMN IF NOT EXISTS changes jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS reasoning text DEFAULT '',
ADD COLUMN IF NOT EXISTS examples jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS before text DEFAULT '',
ADD COLUMN IF NOT EXISTS after text DEFAULT '',
ADD COLUMN IF NOT EXISTS liked boolean DEFAULT NULL,
ADD COLUMN IF NOT EXISTS feedback text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS preview_data jsonb DEFAULT NULL;