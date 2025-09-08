import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AuthRedirectProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Component that redirects authenticated users away from auth pages
 * This prevents users from accessing login/signup pages when already logged in
 */
const AuthRedirect: React.FC<AuthRedirectProps> = ({ 
  children, 
  redirectTo = '/' 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if we're not loading and user is authenticated
    if (!isLoading && isAuthenticated) {
      // Use replace to prevent back button from going to auth page
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo]);

  // Don't render children if user is authenticated
  if (!isLoading && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default AuthRedirect;
