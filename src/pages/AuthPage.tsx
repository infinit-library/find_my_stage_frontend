import { useState, useEffect } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Mic, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { authApi, type LoginRequest, type SignupRequest, type SignupResponse } from "@/lib/api";


const decodeJwtCredential = (credential: string) => {
  try {
    
    const parts = credential.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }
    
    
    const payload = parts[1];
    
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    const decodedPayload = atob(paddedPayload);
    
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    throw new Error('Failed to decode credential');
  }
};

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, clearError, setUser } = useAuth();
  const prefilledEmail = location.state?.email || "";

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginData, setLoginData] = useState({
    email: prefilledEmail,
    password: "",
    rememberMe: false
  });
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: prefilledEmail,
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });
  const [activeTab, setActiveTab] = useState(prefilledEmail ? "signup" : "login");
  
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleGoogleAuth = async (isSignup: boolean = false) => {
    try {
      setIsSubmitting(true);
      await authApi.googleAuth();
    } catch (error) {
      console.error('Google auth error:', error);
      toast.error('Failed to start Google authentication');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLoginSuccess = async (userInfo: any, credential: string) => {
    try {
      console.log('Google User Info:', {
        email: userInfo.email,
        name: userInfo.name,
        given_name: userInfo.given_name,
        family_name: userInfo.family_name,
        picture: userInfo.picture,
        sub: userInfo.sub, 
        email_verified: userInfo.email_verified
      });

      const user = {
        id: userInfo.sub,
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        email: userInfo.email,
        picture: userInfo.picture
      };
      setUser(user, credential);
    } catch (error) {
      console.error('Error handling Google login success:', error);
      toast.error('Failed to process Google login');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      setIsSubmitting(true);
      const credentials: LoginRequest = {
        email: loginData.email,
        password: loginData.password
      };
      const data = await authApi.login(credentials);
      console.log('datalogin', data);
      setUser(data.user, data.token);
      toast.success('Login successful!');
      navigate("/", { replace: true });
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupData.firstName || !signupData.lastName || !signupData.email || !signupData.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }
    if (signupData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (!/(?=.*[a-z])/.test(signupData.password)) {
      toast.error("Password must contain at least one lowercase letter");
      return;
    }

    if (!/(?=.*[A-Z])/.test(signupData.password)) {
      toast.error("Password must contain at least one uppercase letter");
      return;
    }

    if (!/(?=.*\d)/.test(signupData.password)) {
      toast.error("Password must contain at least one number");
      return;
    }
    if (!signupData.agreeToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }
    try {
      setIsSubmitting(true);
      const userData: SignupRequest = {
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        email: signupData.email,
        password: signupData.password,
        confirmPassword: signupData.confirmPassword
      };
      const data = await authApi.signup(userData);
      toast.success('Account created successfully! Please sign in to continue.');
      // Clear the signup form
      setSignupData({
        firstName: "",
        lastName: "",
        email: signupData.email, // Keep the email for convenience
        password: "",
        confirmPassword: "",
        agreeToTerms: false
      });
      // Switch to sign-in tab and populate email
      setLoginData(prev => ({ ...prev, email: signupData.email }));
      setActiveTab("login");
    } catch (error: any) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Signup failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            className="text-white hover:text-white/80 mb-4"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Mic className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold text-white">
              Find My Stage
            </span>
          </div>
        </div>

        <Card className="shadow-glow bg-white/95 backdrop-blur">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>
                    Sign in to your Find My Stage account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Google Login Button */}
                  <div className="space-y-3">
                    <GoogleLogin
                      onSuccess={credentialResponse => {
                        try {
                          const userInfo = decodeJwtCredential(credentialResponse.credential);
                          handleGoogleLoginSuccess(userInfo, credentialResponse.credential);
                          toast.success('Login successful!');
                          navigate("/", { replace: true });
                        } catch (error) {
                          console.error('Error decoding credential:', error);
                          toast.error('Login failed - invalid response');
                        }
                      }}
                      onError={() => {
                        toast.error('Login Failed');
                        console.log('Login Failed');
                      }}
                      useOneTap={true}
                    />
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-muted-foreground">Or continue with email</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isSubmitting}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={loginData.rememberMe}
                        onCheckedChange={(checked) =>
                          setLoginData({ ...loginData, rememberMe: checked as boolean })
                        }
                        disabled={isSubmitting}
                      />
                      <Label htmlFor="remember" className="text-sm">
                        Remember me
                      </Label>
                    </div>
                    <Button variant="link" className="p-0 h-auto text-sm" disabled={isSubmitting}>
                      Forgot password?
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    variant="cta"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Signing in...
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup}>
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>
                    Start your speaking journey today
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Google Signup Button */}
                  <div className="space-y-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleGoogleAuth(true)}
                      disabled={isLoading || isSubmitting}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                          Signing up with Google...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                          </svg>
                          Continue with Google
                        </div>
                      )}
                    </Button>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-muted-foreground">Or continue with email</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={signupData.firstName}
                        onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={signupData.lastName}
                        onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        required
                        minLength={8}
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isSubmitting}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 8 characters long with lowercase, uppercase, and number
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={signupData.agreeToTerms}
                      onCheckedChange={(checked) =>
                        setSignupData({ ...signupData, agreeToTerms: checked as boolean })
                      }
                      required
                      disabled={isSubmitting}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the{" "}
                      <Button variant="link" className="p-0 h-auto text-sm" disabled={isSubmitting}>
                        Terms of Service
                      </Button>{" "}
                      and{" "}
                      <Button variant="link" className="p-0 h-auto text-sm" disabled={isSubmitting}>
                        Privacy Policy
                      </Button>
                    </Label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    variant="hero"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating account...
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <p className="text-center text-white/60 text-sm mt-6">
          Trusted by 1,200+ speakers worldwide
        </p>
      </div>
    </div>
  );
};

export default AuthPage;