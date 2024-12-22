import { supabase } from '@/lib/supabaseClient';

export class ApiKeyService {
  private static apiKey: string | null = null;

  static async getApiKey(): Promise<string> {
    if (this.apiKey) {
      return this.apiKey;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-api-key`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get API key');
      }

      const { apiKey } = await response.json();
      this.apiKey = apiKey;
      return apiKey;
    } catch (error) {
      console.error('Error getting API key:', error);
      throw error;
    }
  }

  static clearApiKey() {
    this.apiKey = null;
  }
}