// Environment Configuration for Google OAuth
// This file helps you set up your environment variables correctly

export const ENV_CONFIG = {
  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: process.env.VITE_GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.VITE_GOOGLE_CLIENT_SECRET || '',
  
  // API Configuration
  API_BASE_URL: process.env.VITE_API_BASE_URL || 'http://localhost:5000',
  
  // App Configuration
  APP_NAME: process.env.VITE_APP_NAME || 'Find My Stage',
  APP_VERSION: process.env.VITE_APP_VERSION || '1.0.0',
};

// Validation function to check if required environment variables are set
export const validateEnvironment = (): { isValid: boolean; missing: string[] } => {
  const required = [
    'VITE_GOOGLE_CLIENT_ID',
    'VITE_GOOGLE_CLIENT_SECRET',
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  return {
    isValid: missing.length === 0,
    missing
  };
};

// Helper function to get environment variable with fallback
export const getEnvVar = (key: string, fallback: string = ''): string => {
  return process.env[key] || fallback;
};

// Development environment check
export const isDevelopment = process.env.NODE_ENV === 'development';

// Production environment check
export const isProduction = process.env.NODE_ENV === 'production';

export const ENV_SETUP_INSTRUCTIONS = `
🔧 Environment Variables Setup:

1. Create a .env file in your stage-spotter-ui directory
2. Add the following variables:

VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret_here
VITE_API_BASE_URL=http://localhost:5000

3. Replace 'your_google_client_id_here' with your actual Google OAuth Client ID
4. Replace 'your_google_client_secret_here' with your actual Google OAuth Client Secret
5. Restart your development server after making changes

⚠️  Important: Never commit .env files to version control!
`;
