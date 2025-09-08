// Debug environment variables
console.log('Environment variables:', {
  VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  VITE_GOOGLE_CLIENT_SECRET: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
});

// Application Configuration
export const config = {
  // Google OAuth Configuration
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
    redirectUri: `${window.location.origin}/auth/callback`,
    scope: 'openid email profile',
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/oauth2/v2/rest'],
  },
  
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    endpoints: {
      auth: {
        google: '/api/auth/google',
        login: '/api/auth/signin',
        signup: '/api/auth/signup',
        refresh: '/api/auth/refresh',
        logout: '/api/auth/logout',
      },
      user: {
        profile: '/api/user/profile',
        update: '/api/user/update',
      },
    },
  },
  
  // App Configuration
  app: {
    name: 'Find My Stage',
    version: '1.0.0',
    defaultRedirect: '/dashboard',
    authRedirect: '/auth',
  },
  
  // Storage Keys
  storage: {
    accessToken: 'fms_access_token',
    refreshToken: 'fms_refresh_token',
    user: 'fms_user',
    googleState: 'google_oauth_state',
  },
};

// Validate required environment variables
export const validateConfig = () => {
  const required = [
    'VITE_GOOGLE_CLIENT_ID',
    'VITE_API_BASE_URL',
  ];
  
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    return false;
  }
  
  return true;
};
