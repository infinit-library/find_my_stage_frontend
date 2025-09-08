// Google OAuth 2.0 Authentication Utility
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

  // Initialize Google OAuth flow
  public async signIn(): Promise<void> {
    const authUrl = this.buildAuthUrl();
    window.location.href = authUrl;
  }

  // Build the OAuth authorization URL
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

  // Generate a random state parameter for security
  private generateState(): string {
    const state = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('google_oauth_state', state);
    return state;
  }

  // Handle the OAuth callback and exchange code for tokens
  public async handleCallback(code: string, state: string): Promise<GoogleUser> {
    // Verify state parameter
    const savedState = sessionStorage.getItem('google_oauth_state');
    if (state !== savedState) {
      throw new Error('Invalid state parameter');
    }
    sessionStorage.removeItem('google_oauth_state');

    try {
      // Exchange authorization code for access token
      const tokenResponse = await this.exchangeCodeForToken(code);
      
      // Get user information using the access token
      const userInfo = await this.getUserInfo(tokenResponse.access_token);
      
      // Store tokens securely (you might want to use httpOnly cookies in production)
      this.storeTokens(tokenResponse);
      
      return userInfo;
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      throw error;
    }
  }

  // Exchange authorization code for access token
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

  // Get user information from Google
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

  // Store tokens securely
  private storeTokens(tokenResponse: any): void {
    // In production, use httpOnly cookies or secure storage
    // For now, we'll use sessionStorage (not recommended for production)
    sessionStorage.setItem('google_access_token', tokenResponse.access_token);
    if (tokenResponse.refresh_token) {
      sessionStorage.setItem('google_refresh_token', tokenResponse.refresh_token);
    }
  }

  // Get stored access token
  public getAccessToken(): string | null {
    return sessionStorage.getItem('google_access_token');
  }

  // Refresh access token using refresh token
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

  // Sign out user
  public signOut(): void {
    sessionStorage.removeItem('google_access_token');
    sessionStorage.removeItem('google_refresh_token');
    sessionStorage.removeItem('google_oauth_state');
    
    // Redirect to Google's logout URL
    const logoutUrl = `https://accounts.google.com/logout`;
    window.open(logoutUrl, '_blank');
  }

  // Check if user is authenticated
  public isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

// Create and export a default instance
export const googleAuth = new GoogleAuth({
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id',
  redirectUri: `${window.location.origin}/auth/callback`,
  scope: 'openid email profile',
});

export default googleAuth;
