import { supabase } from '@/lib/supabaseClient';

export interface Prospect {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  score: number;
  lastContact?: Date;
  notes?: string;
  propertyType?: string;
  budget?: number;
  location?: string;
}

export class ProspectService {
  static async createProspect(prospectData: Omit<Prospect, 'id'>) {
    const { data, error } = await supabase
      .from('prospects')
      .insert([prospectData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateProspect(id: string, updates: Partial<Prospect>) {
    const { data, error } = await supabase
      .from('prospects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getProspects() {
    const { data, error } = await supabase
      .from('prospects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getProspectById(id: string) {
    const { data, error } = await supabase
      .from('prospects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
}