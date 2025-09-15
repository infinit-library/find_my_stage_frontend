import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Mic, Users, Star, TrendingUp, Play, ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import heroImage from "@/assets/hero-speakers.jpg";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, signOut, user } = useAuth();
  const [email, setEmail] = useState("");


  console.log("isAuthenticated", isAuthenticated);
  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/auth", { state: { email, activeTab: "signup" } });
    }
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      signOut();
    } else {
      navigate("/auth");
    }
  };

  const handleEarlyAccess = () => {
    if (email) {
      navigate("/auth", { state: { email } });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <img src="../public/FMS Logo line.png" alt="Find My Stage" className="h-20 w-auto" />
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleAuthAction}>
            {isAuthenticated ? "Sign Out" : "Sign In"}
          </Button>
          <Button variant="cta" onClick={handleGetStarted}>
            {isAuthenticated ? "Go to Dashboard" : "Sign Up"}
          </Button>
        </div>
      </nav>

      {isAuthenticated && user && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-6 max-w-7xl mx-auto mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-green-700">
                <strong>Welcome back, {user.email || user.email}! 🎉</strong> You are successfully signed in. 
                Notice the "Sign Out" button in the top right corner.
              </p>
            </div>
          </div>
        </div>
      )}

      <section className="relative py-20 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-gradient-primary text-primary-foreground">
                🚀 Now in Beta
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Discover Your Next
                <span className="bg-gradient-primary bg-clip-text text-transparent block">
                  Speaking Stage
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Connect with event organizers, showcase your expertise, and grow your speaking career.
                Find My Stage makes it easy to discover speaking opportunities that match your profile.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                />
                <Button variant="hero" onClick={handleEarlyAccess}>
                  Get Early Access
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Free to start
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                No setup fees
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Expert matching
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src={heroImage}
              alt="Professional speakers presenting at conferences"
              className="rounded-2xl shadow-elegant w-full"
            />
            <div className="absolute inset-0 bg-gradient-hero opacity-20 rounded-2xl"></div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-primary">500+</div>
            <div className="text-muted-foreground">Speaking Opportunities</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-primary">1,200+</div>
            <div className="text-muted-foreground">Active Speakers</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-primary">150+</div>
            <div className="text-muted-foreground">Event Partners</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-primary">98%</div>
            <div className="text-muted-foreground">Match Success Rate</div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold">Why Choose Find My Stage?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform connects speakers with the perfect opportunities, streamlining the entire process.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="shadow-card hover:shadow-elegant transition-smooth">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Smart Matching</CardTitle>
              <CardDescription>
                AI-powered algorithm matches your expertise with relevant speaking opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Topic-based matching
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Location preferences
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Fee requirements
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-smooth">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Career Growth</CardTitle>
              <CardDescription>
                Track your speaking journey and build your professional reputation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Performance analytics
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Speaker ratings
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Portfolio building
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-smooth">
            <CardHeader>
              <Star className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Premium Events</CardTitle>
              <CardDescription>
                Access exclusive high-paying speaking opportunities from top organizations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Corporate events
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Industry conferences
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  VIP networking
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-20 px-6 max-w-7xl mx-auto">
        <Card className="bg-gradient-hero text-primary-foreground shadow-glow">
          <CardContent className="p-12 text-center space-y-8">
            <h2 className="text-4xl font-bold">Ready to Find Your Stage?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join thousands of speakers who have already discovered their perfect speaking opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                size="lg"
                onClick={handleGetStarted}
                className="font-semibold"
              >
                Start Free Trial
                <Play className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                View Pricing
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <footer className="py-12 px-6 max-w-7xl mx-auto border-t">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Mic className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Find My Stage</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 Find My Stage. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;