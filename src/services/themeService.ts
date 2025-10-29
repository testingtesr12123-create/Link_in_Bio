import { supabase, Theme } from '../lib/supabase';

export const themeService = {
  async getAllThemes(): Promise<Theme[]> {
    const { data, error } = await supabase
      .from('themes')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getThemeById(id: number): Promise<Theme | null> {
    const { data, error } = await supabase
      .from('themes')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
};
