import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { googleAuth } from "@/lib/google-auth-enhanced";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, UserPlus, UserCheck } from "lucide-react";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setErrorMessage('Authentication was cancelled or failed');
          return;
        }

        if (!code || !state) {
          setStatus('error');
          setErrorMessage('Invalid OAuth response');
          return;
        }

        const response = await googleAuth.handleCallback(code, state);
        
        if (response.success) {
          console.log('Google OAuth successful:', response.user);
          setIsNewUser(response.isNewUser || false);
          setStatus('success');
          
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          if (response.code === 'NOT_IMPLEMENTED') {
            throw new Error('Google OAuth is not yet implemented on the backend. Please use email/password authentication for now.');
          } else {
            throw new Error(response.error || response.message || 'Authentication failed'); 
          }
        }

      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Authentication failed');
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  const handleRetry = () => {
    setStatus('loading');
    navigate('/auth');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-glow bg-white/95 backdrop-blur">
        <CardHeader className="text-center">
          <CardTitle>Authentication</CardTitle>
          <CardDescription>
            {status === 'loading' && 'Completing your sign-in...'}
            {status === 'success' && (isNewUser ? 'Welcome to Find My Stage!' : 'Welcome back!')}
            {status === 'error' && 'Sign-in failed'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === 'loading' && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <p className="text-muted-foreground">
                Please wait while we complete your authentication...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center gap-4">
              {isNewUser ? (
                <UserPlus className="h-12 w-12 text-green-600" />
              ) : (
                <UserCheck className="h-12 w-12 text-green-600" />
              )}
              <p className="text-green-600 font-medium">
                {isNewUser 
                  ? 'Account created successfully! Redirecting you to your dashboard...'
                  : 'Sign-in successful! Redirecting you to your dashboard...'
                }
              </p>
              <div className="text-sm text-muted-foreground">
                {isNewUser && (
                  <p>We've set up your account with the information from Google.</p>
                )}
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center gap-4">
              <XCircle className="h-12 w-12 text-red-600" />
              <p className="text-red-600 font-medium">
                {errorMessage}
              </p>
              <div className="flex gap-2">
                <Button onClick={handleRetry} variant="outline">
                  Try Again
                </Button>
                <Button onClick={handleGoHome}>
                  Go Home
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthCallback;
