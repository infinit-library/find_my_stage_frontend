import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { googleAuth, GoogleAuthState, GoogleUser } from '@/lib/google-auth-enhanced';
import { useNavigate } from 'react-router-dom';
import { config } from '@/lib/config';

interface User {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  picture: string;
  verified_email: boolean;
  locale: string;
}

interface AuthContextType {
  // Auth state
  isAuthenticated: boolean;
  user: GoogleUser | User | null;
  isLoading: boolean;
  error: string | null;
  
  // Auth actions
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
  
  // Utility functions
  getAccessToken: () => string | null;
  clearError: () => void;
  setUser: (user: User, token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<GoogleAuthState>({
    isAuthenticated: false,
    user: null,
    tokens: null,
    isLoading: false,
    error: null,
  });
  
  const [emailAuthUser, setEmailAuthUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Check for existing email/password authentication on mount
  useEffect(() => {
    const token = localStorage.getItem(config.storage.accessToken);
    const userData = localStorage.getItem(config.storage.user);
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setEmailAuthUser(user);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        // Clear invalid data
        localStorage.removeItem(config.storage.accessToken);
        localStorage.removeItem(config.storage.user);
      }
    }
  }, []);

  // Subscribe to Google auth state changes
  useEffect(() => {
    const unsubscribe = googleAuth.subscribe((state) => {
      setAuthState(state);
      
      // Auto-navigate based on auth state
      if (state.isAuthenticated && state.user) {
        // Check if we're on an auth page and redirect to landing page to show the updated button
        if (window.location.pathname.includes('/auth') || 
            window.location.pathname.includes('/login') || 
            window.location.pathname.includes('/signup')) {
          navigate('/', { replace: true });
        }
        // If user is on landing page after successful auth, they can stay there to see the updated button
      } else if (!state.isAuthenticated) {
        // If not authenticated and on protected route, redirect to auth
        const protectedRoutes = ['/dashboard', '/profile', '/subscribe'];
        if (protectedRoutes.some(route => window.location.pathname.startsWith(route))) {
          navigate('/auth', { replace: true });
        }
      }
    });

    return unsubscribe;
  }, [navigate]);

  // Handle sign in
  const handleSignIn = async (): Promise<void> => {
    try {
      await googleAuth.signIn();
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  // Handle sign out
  const handleSignOut = async (): Promise<void> => {
    try {
      // Sign out from Google if authenticated via Google
      if (authState.isAuthenticated) {
        await googleAuth.signOut();
      }
      
      // Clear email/password authentication
      setEmailAuthUser(null);
      localStorage.removeItem(config.storage.accessToken);
      localStorage.removeItem(config.storage.user);
      
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Refresh access token
  const handleRefreshToken = async (): Promise<string | null> => {
    try {
      return await googleAuth.refreshAccessToken();
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  };

  // Get access token
  const getAccessToken = (): string | null => {
    // Check email/password auth first, then Google auth
    const emailToken = localStorage.getItem(config.storage.accessToken);
    if (emailToken) {
      return emailToken;
    }
    return googleAuth.getAccessToken();
  };

  // Set user for email/password authentication
  const setUser = (user: User, token: string): void => {
    setEmailAuthUser(user);
    localStorage.setItem(config.storage.accessToken, token);
    localStorage.setItem(config.storage.user, JSON.stringify(user));
  };

  // Clear error
  const clearError = (): void => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  // Determine current authentication state
  const isAuthenticated = authState.isAuthenticated || !!emailAuthUser;
  const currentUser = emailAuthUser || authState.user;
  const isLoading = authState.isLoading;

  const value: AuthContextType = {
    isAuthenticated,
    user: currentUser,
    isLoading,
    error: authState.error,
    signIn: handleSignIn,
    signOut: handleSignOut,
    refreshToken: handleRefreshToken,
    getAccessToken,
    clearError,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Hook for protected routes
export const useRequireAuth = (): GoogleUser | User => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  if (isLoading) {
    throw new Promise(() => {}); // This will be caught by Suspense
  }
  
  if (!isAuthenticated || !user) {
    throw new Error('Authentication required');
  }
  
  return user;
};
