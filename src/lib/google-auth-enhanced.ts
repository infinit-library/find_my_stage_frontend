import { config } from './config';

// Interfaces for Google OAuth
export interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export interface GoogleTokens {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export interface GoogleAuthResponse {
  success: boolean;
  user: any;
  token: string;
  isNewUser: boolean;
  message?: string;
  error?: string;
  code?: string;
}

export interface GoogleAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: GoogleUser | null;
  tokens: GoogleTokens | null;
  error: string | null;
}

class GoogleAuthEnhanced {
  private state: GoogleAuthState = {
    isAuthenticated: false,
    isLoading: false,
    user: null,
    tokens: null,
    error: null
  };

  private listeners: ((state: GoogleAuthState) => void)[] = [];

  constructor() {
    // Initialize from localStorage if available
    this.loadFromStorage();
  }

  public subscribe(listener: (state: GoogleAuthState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  private updateState(updates: Partial<GoogleAuthState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  public async signIn(): Promise<void> {
    try {
      this.updateState({ isLoading: true, error: null });
      
      const state = this.generateState();
      const authUrl = this.buildAuthUrl(state);
      
      // Store state for verification
      localStorage.setItem(config.storage.googleState, state);
      
      // Redirect to Google OAuth
      window.location.href = authUrl;
    } catch (error) {
      this.updateState({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Sign in failed' 
      });
    }
  }

  private buildAuthUrl(state: string): string {
    console.log('Building auth URL with config:', {
      clientId: config.google.clientId,
      redirectUri: config.google.redirectUri,
      scope: config.google.scope
    });
    
    const params = new URLSearchParams({
      client_id: config.google.clientId,
      redirect_uri: config.google.redirectUri,
      scope: config.google.scope,
      response_type: 'code',
      state: state,
      access_type: 'offline',
      prompt: 'consent'
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    console.log('Generated auth URL:', authUrl);
    
    return authUrl;
  }

  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  public async handleCallback(code: string, state: string): Promise<GoogleAuthResponse> {
    try {
      this.updateState({ isLoading: true, error: null });

      // Verify state parameter
      const storedState = localStorage.getItem(config.storage.googleState);
      if (!storedState || storedState !== state) {
        throw new Error('Invalid state parameter');
      }

      // Exchange code for tokens
      const tokens = await this.exchangeCodeForTokens(code);
      
      // Get user info from Google
      const user = await this.getUserInfo(tokens.access_token);
      
      // Authenticate with backend
      const authResponse = await this.authenticateWithBackend(user, tokens);
      
      // Store tokens and user data
      this.storeTokens(tokens);
      this.storeUser(user);
      
      // Update state
      this.updateState({
        isAuthenticated: true,
        isLoading: false,
        user,
        tokens,
        error: null
      });

      // Clear stored state
      localStorage.removeItem(config.storage.googleState);
      
      return authResponse;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      this.updateState({ 
        isLoading: false, 
        error: errorMessage 
      });
      throw error;
    }
  }

  private async exchangeCodeForTokens(code: string): Promise<GoogleTokens> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: config.google.clientId,
        client_secret: config.google.clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: config.google.redirectUri,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Token exchange failed: ${errorData.error_description || errorData.error}`);
    }

    return response.json();
  }

  private async getUserInfo(accessToken: string): Promise<GoogleUser> {
    const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
    
    if (!response.ok) {
      throw new Error('Failed to get user info from Google');
    }

    return response.json();
  }

  private async authenticateWithBackend(user: GoogleUser, tokens: GoogleTokens): Promise<GoogleAuthResponse> {
    const response = await fetch(`${config.api.baseUrl}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        googleId: user.id,
        email: user.email,
        firstName: user.given_name,
        lastName: user.family_name,
        profilePicture: user.picture,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Backend authentication failed');
    }

    const authResponse = await response.json();
    
    // Store the JWT token from backend
    if (authResponse.token) {
      localStorage.setItem(config.storage.accessToken, authResponse.token);
    }

    return authResponse;
  }

  private storeTokens(tokens: GoogleTokens): void {
    localStorage.setItem(config.storage.accessToken, tokens.access_token);
    if (tokens.refresh_token) {
      localStorage.setItem(config.storage.refreshToken, tokens.refresh_token);
    }
  }

  private storeUser(user: GoogleUser): void {
    localStorage.setItem(config.storage.user, JSON.stringify(user));
  }

  public async signOut(): Promise<void> {
    try {
      // Revoke Google tokens if available
      const accessToken = this.getAccessToken();
      if (accessToken) {
        await this.revokeGoogleTokens(accessToken);
      }

      // Clear storage
      this.clearStorage();
      
      // Update state
      this.updateState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        tokens: null,
        error: null
      });
    } catch (error) {
      console.error('Sign out error:', error);
      // Still clear local state even if Google revocation fails
      this.clearStorage();
      this.updateState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        tokens: null,
        error: null
      });
    }
  }

  private async revokeGoogleTokens(accessToken: string): Promise<void> {
    try {
      await fetch(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Failed to revoke Google tokens:', error);
    }
  }

  private clearStorage(): void {
    localStorage.removeItem(config.storage.accessToken);
    localStorage.removeItem(config.storage.refreshToken);
    localStorage.removeItem(config.storage.user);
    localStorage.removeItem(config.storage.googleState);
  }

  private loadFromStorage(): void {
    try {
      const accessToken = localStorage.getItem(config.storage.accessToken);
      const user = localStorage.getItem(config.storage.user);
      
      if (accessToken && user) {
        const userData = JSON.parse(user);
        this.updateState({
          isAuthenticated: true,
          user: userData,
          tokens: { access_token: accessToken } as GoogleTokens
        });
      }
    } catch (error) {
      console.error('Failed to load from storage:', error);
      this.clearStorage();
    }
  }

  public getState(): GoogleAuthState {
    return { ...this.state };
  }

  public isAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }

  public getCurrentUser(): GoogleUser | null {
    return this.state.user;
  }

  public getAccessToken(): string | null {
    return localStorage.getItem(config.storage.accessToken);
  }

  public async refreshAccessToken(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem(config.storage.refreshToken);
      if (!refreshToken) {
        return null;
      }

      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: config.google.clientId,
          client_secret: config.google.clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const tokens = await response.json();
      localStorage.setItem(config.storage.accessToken, tokens.access_token);
      
      return tokens.access_token;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      return null;
    }
  }
}

export const googleAuth = new GoogleAuthEnhanced();
export default googleAuth;
