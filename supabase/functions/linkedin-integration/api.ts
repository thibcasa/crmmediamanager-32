export const linkedInApi = {
  async getAccessToken(code: string, redirectUri: string, clientId: string, clientSecret: string) {
    console.log('Exchanging code for access token with redirect URI:', redirectUri);
    
    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('LinkedIn token exchange error:', error);
      throw new Error(`Token exchange failed: ${error.error_description || 'Unknown error'}`);
    }

    return response.json();
  },

  async getProfile(accessToken: string) {
    const response = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('LinkedIn profile fetch error:', error);
      throw new Error(`Profile fetch failed: ${error.message || 'Unknown error'}`);
    }

    return response.json();
  },

  async createPost(accessToken: string, linkedinId: string, content: string) {
    console.log('Creating LinkedIn post for user:', linkedinId);
    
    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify({
        author: `urn:li:person:${linkedinId}`,
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
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('LinkedIn post creation error:', error);
      throw new Error(`Post creation failed: ${error.message || 'Unknown error'}`);
    }

    return response.json();
  }
};