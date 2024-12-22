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
  qualification: 'lead' | 'prospect' | 'client';
}

export class ProspectService {
  static async getProspects() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        lead_interactions (
          type,
          content,
          metadata
        )
      `)
      .eq('user_id', userData.user.id)
      .order('score', { ascending: false });

    if (error) {
      console.error('Error fetching prospects:', error);
      throw new Error('Failed to fetch prospects');
    }

    return data;
  }

  static async getSuccessfulStrategies(qualification: 'lead' | 'prospect' | 'client') {
    const { data, error } = await supabase
      .from('lead_interactions')
      .select(`
        *,
        leads!inner (qualification)
      `)
      .eq('type', 'ai_strategy')
      .eq('leads.qualification', qualification)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching successful strategies:', error);
      throw new Error('Failed to fetch successful strategies');
    }

    return data;
  }

  static async createProspect(prospectData: Omit<Prospect, 'id' | 'created_at' | 'user_id'>) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('leads')
      .insert([{ ...prospectData, user_id: userData.user.id }])
      .select()
      .single();

    if (error) {
      console.error('Error creating prospect:', error);
      throw new Error('Failed to create prospect');
    }

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

    if (error) {
      console.error('Error updating prospect:', error);
      throw new Error('Failed to update prospect');
    }

    if (updates.email || updates.phone || updates.source || updates.notes || updates.status) {
      await this.updateProspectScore(id);
    }

    return data;
  }

  static async updateProspectScore(id: string) {
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (leadError) {
      console.error('Error fetching lead for scoring:', leadError);
      throw new Error('Failed to fetch lead for scoring');
    }

    try {
      const response = await supabase.functions.invoke('lead-scoring', {
        body: { lead }
      });

      if (response.error) {
        console.error('Error calculating lead score:', response.error);
        throw new Error('Failed to calculate lead score');
      }

      return response.data;
    } catch (error) {
      console.error('Error in lead scoring function:', error);
      throw new Error('Failed to process lead scoring');
    }
  }

  static async getProspectById(id: string) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching prospect:', error);
      throw new Error('Failed to fetch prospect');
    }

    return data;
  }

  static async deleteProspect(id: string) {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting prospect:', error);
      throw new Error('Failed to delete prospect');
    }
  }
}
