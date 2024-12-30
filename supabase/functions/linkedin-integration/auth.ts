export class LinkedInAuth {
  private clientId: string;
  private clientSecret: string;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  async getConnection(userId: string) {
    try {
      const { data: connection, error } = await supabase
        .from('linkedin_connections')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (error) throw error;
      if (!connection) return null;

      // Vérifier si le token est expiré
      const now = new Date();
      const tokenExpiry = new Date(connection.created_at);
      tokenExpiry.setSeconds(tokenExpiry.getSeconds() + connection.expires_in);

      if (now > tokenExpiry) {
        // Rafraîchir le token
        const refreshedConnection = await this.refreshToken(connection.refresh_token);
        
        // Mettre à jour la connexion dans la base
        const { error: updateError } = await supabase
          .from('linkedin_connections')
          .update({
            access_token: refreshedConnection.access_token,
            refresh_token: refreshedConnection.refresh_token,
            expires_in: refreshedConnection.expires_in,
            updated_at: new Date().toISOString()
          })
          .eq('id', connection.id);

        if (updateError) throw updateError;
        return refreshedConnection;
      }

      return connection;
    } catch (error) {
      console.error('Erreur récupération connexion LinkedIn:', error);
      throw error;
    }
  }

  private async refreshToken(refreshToken: string) {
    try {
      const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur rafraîchissement token: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur rafraîchissement token LinkedIn:', error);
      throw error;
    }
  }
}