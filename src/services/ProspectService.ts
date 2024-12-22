import { supabase } from '@/lib/supabaseClient';

export interface Prospect {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  source: string;
  status: 'cold' | 'warm' | 'hot' | 'converted' | 'lost';
  score: number;
  last_contact_date: Date;
  notes?: string;
  created_at: Date;
  user_id: string;
}

export class ProspectService {
  static async createProspect(prospectData: Omit<Prospect, 'id' | 'created_at' | 'user_id'>) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('leads')
      .insert([{ ...prospectData, user_id: userData.user.id }])
      .select()
      .single();

    if (error) throw error;

    // Calculer le score initial
    await this.updateProspectScore(data.id);

    return data;
  }

  static async updateProspect(id: string, updates: Partial<Prospect>) {
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Recalculer le score si des données importantes sont modifiées
    if (updates.email || updates.phone || updates.source || updates.notes || updates.status) {
      await this.updateProspectScore(id);
    }

    return data;
  }

  static async updateProspectScore(id: string) {
    const { data: lead, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    const response = await supabase.functions.invoke('lead-scoring', {
      body: { lead }
    });

    if (response.error) throw response.error;

    return response.data;
  }

  static async getProspects() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('score', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getProspectById(id: string) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
}