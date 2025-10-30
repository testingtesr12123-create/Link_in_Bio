import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  profile_image_url: string | null;
  background_image_url: string | null;
  theme_id: number;
  custom_css: string | null;
  template_name: string;
  custom_colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    accent: string;
  };
  created_at: string;
  updated_at: string;
};

export type Link = {
  id: string;
  user_id: string;
  title: string;
  url: string;
  icon: string;
  order_index: number;
  click_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Theme = {
  id: number;
  name: string;
  background_color: string;
  button_color: string;
  button_text_color: string;
  text_color: string;
  font_family: string;
  button_style: string;
};

export type LinkClick = {
  id: string;
  link_id: string;
  clicked_at: string;
  user_agent: string | null;
  referrer: string | null;
};

export type Template = {
  id: string;
  name: string;
  display_name: string;
  description: string;
  preview_image_url: string | null;
  layout_type: string;
  default_colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    accent: string;
  };
  created_at: string;
};
