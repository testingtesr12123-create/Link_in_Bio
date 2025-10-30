import { supabase, Template } from '../lib/supabase';

export const templateService = {
  async getAllTemplates(): Promise<Template[]> {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getTemplateByName(name: string): Promise<Template | null> {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('name', name)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
};
