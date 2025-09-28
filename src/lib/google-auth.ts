
export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  picture: string;
}

export interface GoogleAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string;
}

class GoogleAuth {
  private config: GoogleAuthConfig;
  private tokenEndpoint = 'https://oauth2.googleapis.com/token';
  private userInfoEndpoint = 'https://www.googleapis.com/oauth2/v2/userinfo';

  constructor(config: GoogleAuthConfig) {
    this.config = config;
  }

  public async signIn(): Promise<void> {
    const authUrl = this.buildAuthUrl();
    window.location.href = authUrl;
  }

  private buildAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scope,
      access_type: 'offline',
      prompt: 'consent',
      state: this.generateState()
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  private generateState(): string {
    const state = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('google_oauth_state', state);
    return state;
  }

  public async handleCallback(code: string, state: string): Promise<GoogleUser> {
    const savedState = sessionStorage.getItem('google_oauth_state');
    if (state !== savedState) {
      throw new Error('Invalid state parameter');
    }
    sessionStorage.removeItem('google_oauth_state');

    try {
      const tokenResponse = await this.exchangeCodeForToken(code);
      
      const userInfo = await this.getUserInfo(tokenResponse.access_token);
      
      this.storeTokens(tokenResponse);
      
      return userInfo;
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      throw error;
    }
  }

  private async exchangeCodeForToken(code: string): Promise<any> {
    const response = await fetch(this.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.config.redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    return response.json();
  }

  private async getUserInfo(accessToken: string): Promise<GoogleUser> {
    const response = await fetch(this.userInfoEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user info');
    }

    const userData = await response.json();
    
    return {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      firstName: userData.given_name,
      lastName: userData.family_name,
      picture: userData.picture,
    };
  }

  private storeTokens(tokenResponse: any): void {
    sessionStorage.setItem('google_access_token', tokenResponse.access_token);
    if (tokenResponse.refresh_token) {
      sessionStorage.setItem('google_refresh_token', tokenResponse.refresh_token);
    }
  }

  public getAccessToken(): string | null {
    return sessionStorage.getItem('google_access_token');
  }

  public async refreshAccessToken(): Promise<string> {
    const refreshToken = sessionStorage.getItem('google_refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(this.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh access token');
    }

    const tokenData = await response.json();
    sessionStorage.setItem('google_access_token', tokenData.access_token);
    
    return tokenData.access_token;
  }

  public signOut(): void {
    sessionStorage.removeItem('google_access_token');
    sessionStorage.removeItem('google_refresh_token');
    sessionStorage.removeItem('google_oauth_state');
    
    const logoutUrl = `https://accounts.google.com/logout`;
    window.open(logoutUrl, '_blank');
  }

  public isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}
export const googleAuth = new GoogleAuth({
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id',
  redirectUri: `${window.location.origin}/auth/callback`,
  scope: 'openid email profile',
});

export default googleAuth;
