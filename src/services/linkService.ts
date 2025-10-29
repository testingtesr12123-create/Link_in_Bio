import { supabase, Link } from '../lib/supabase';

export const linkService = {
  async getLinksByProfileId(profileId: string): Promise<Link[]> {
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', profileId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getActiveLinksByProfileId(profileId: string): Promise<Link[]> {
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', profileId)
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createLink(link: Omit<Link, 'id' | 'created_at' | 'updated_at' | 'click_count'>): Promise<Link> {
    const { data, error } = await supabase
      .from('links')
      .insert(link)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateLink(id: string, updates: Partial<Link>): Promise<Link> {
    const { data, error } = await supabase
      .from('links')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteLink(id: string): Promise<void> {
    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async reorderLinks(links: { id: string; order_index: number }[]): Promise<void> {
    const updates = links.map(link =>
      supabase
        .from('links')
        .update({ order_index: link.order_index, updated_at: new Date().toISOString() })
        .eq('id', link.id)
    );

    await Promise.all(updates);
  },

  async trackClick(linkId: string): Promise<void> {
    const userAgent = navigator.userAgent;
    const referrer = document.referrer;

    await supabase
      .from('link_clicks')
      .insert({ link_id: linkId, user_agent: userAgent, referrer: referrer });

    await supabase.rpc('increment_click_count', { link_id: linkId });
  },

  async getLinkAnalytics(linkId: string, days: number = 7): Promise<{ date: string; clicks: number }[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('link_clicks')
      .select('clicked_at')
      .eq('link_id', linkId)
      .gte('clicked_at', startDate.toISOString());

    if (error) throw error;

    const clicksByDate: Record<string, number> = {};
    data?.forEach((click) => {
      const date = new Date(click.clicked_at).toLocaleDateString();
      clicksByDate[date] = (clicksByDate[date] || 0) + 1;
    });

    return Object.entries(clicksByDate).map(([date, clicks]) => ({ date, clicks }));
  }
};
