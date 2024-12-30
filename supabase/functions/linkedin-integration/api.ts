export class LinkedInApi {
  private auth: any;

  constructor(auth: any) {
    this.auth = auth;
  }

  async createPost(userId: string, content: string) {
    try {
      const connection = await this.auth.getConnection(userId);
      if (!connection) {
        throw new Error('Connexion LinkedIn non trouvée');
      }

      const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${connection.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author: `urn:li:person:${connection.linkedin_id}`,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: {
                text: content
              },
              shareMediaCategory: 'NONE'
            }
          },
          visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur LinkedIn API: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Post LinkedIn créé:', data);
      
      return data;
    } catch (error) {
      console.error('Erreur création post LinkedIn:', error);
      throw error;
    }
  }

  async getPostAnalytics(postId: string) {
    try {
      const response = await fetch(`https://api.linkedin.com/v2/socialActions/${postId}`, {
        headers: {
          'Authorization': `Bearer ${this.auth.accessToken}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur LinkedIn Analytics API: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Analytics LinkedIn récupérés:', data);
      
      return data;
    } catch (error) {
      console.error('Erreur récupération analytics LinkedIn:', error);
      throw error;
    }
  }
}