/*
  # Add Template System

  ## Overview
  Adds template/layout support to the application, allowing users to choose
  different visual layouts and customize them with their own colors.

  ## Changes

  ### 1. Add template column to profiles
  - `template_name` (text) - The selected template layout name
  - `custom_colors` (jsonb) - User's custom color overrides

  ### 2. Add templates table
  - `id` (uuid, primary key)
  - `name` (text, unique) - Template identifier
  - `display_name` (text) - Human-readable name
  - `description` (text) - Template description
  - `preview_image_url` (text) - Preview image URL
  - `layout_type` (text) - Layout structure (simple, classic, card, minimal)
  - `default_colors` (jsonb) - Default color scheme
  - `created_at` (timestamptz)

  ## Template Layouts
  - Simple: Clean layout with social icons at top
  - Classic: Traditional centered design
  - Card: Links displayed as cards with images
  - Minimal: Minimalist design with focus on content

  ## Security
  - Templates table is publicly readable
  - Users can select any template and customize colors
*/

-- Add template columns to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'template_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN template_name text DEFAULT 'simple';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'custom_colors'
  ) THEN
    ALTER TABLE profiles ADD COLUMN custom_colors jsonb DEFAULT '{
      "background": "#f3f4f6",
      "text": "#1f2937",
      "primary": "#3b82f6",
      "secondary": "#ffffff",
      "accent": "#10b981"
    }'::jsonb;
  END IF;
END $$;

-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_name text NOT NULL,
  description text DEFAULT '',
  preview_image_url text,
  layout_type text NOT NULL,
  default_colors jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Templates are publicly readable
CREATE POLICY "Templates are publicly readable"
  ON templates FOR SELECT
  USING (true);

-- Insert default templates
INSERT INTO templates (name, display_name, description, layout_type, default_colors) VALUES
  (
    'simple',
    'Simple',
    'Clean layout with social icons and centered links',
    'simple',
    '{
      "background": "#f3f4f6",
      "text": "#1f2937",
      "primary": "#3b82f6",
      "secondary": "#ffffff",
      "accent": "#10b981"
    }'::jsonb
  ),
  (
    'classic',
    'Classic',
    'Traditional centered design with elegant styling',
    'classic',
    '{
      "background": "#e5e7eb",
      "text": "#374151",
      "primary": "#6366f1",
      "secondary": "#ffffff",
      "accent": "#8b5cf6"
    }'::jsonb
  ),
  (
    'card',
    'Card Style',
    'Modern card-based layout with image support',
    'card',
    '{
      "background": "#92400e",
      "text": "#fef3c7",
      "primary": "#fbbf24",
      "secondary": "#78350f",
      "accent": "#f59e0b"
    }'::jsonb
  ),
  (
    'minimal',
    'Minimal',
    'Minimalist design with bold colors',
    'minimal',
    '{
      "background": "#fef9c3",
      "text": "#713f12",
      "primary": "#facc15",
      "secondary": "#fef3c7",
      "accent": "#eab308"
    }'::jsonb
  )
ON CONFLICT (name) DO NOTHING;