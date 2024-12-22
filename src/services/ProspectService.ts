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
    const { data, error } = await supabase
      .from('leads')
      .insert([{ ...prospectData, user_id: (await supabase.auth.getUser()).data.user?.id }])
      .select()
      .single();

    if (error) throw error;
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
    return data;
  }

  static async getProspects() {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

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