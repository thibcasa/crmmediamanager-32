export const linkedInAuth = {
  generateAuthUrl(clientId: string, redirectUri: string, state: string) {
    const scope = 'openid profile w_member_social email';
    
    return `https://www.linkedin.com/oauth/v2/authorization?` +
      `response_type=code&` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `state=${state}&` +
      `scope=${encodeURIComponent(scope)}`;
  }
};