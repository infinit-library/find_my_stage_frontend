import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiCreateCheckout } from "@/lib/api";
import { loadStripe } from "@stripe/stripe-js";
import { CardFooter } from "@/components/ui/card";
import { toast } from "sonner";

const Subscribe = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = (location.state || {}) as Record<string, unknown>;
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string>((params?.email as string) || '');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        
        try {
            if (!email || !email.includes('@')) {
                throw new Error('Please enter a valid email address');
            }

            console.log('Creating checkout session with:', { 
                email, 
                topic: params?.topic, 
                industry: params?.industry 
            });

            // Create Stripe Checkout session with search parameters
            const { url } = await apiCreateCheckout(email, {
                topic: params?.topic as string,
                industry: params?.industry as string
            });
            
            console.log('Checkout session created:', { url });
            
            if (!url) {
                throw new Error('Failed to create checkout session');
            }

            // Redirect to Stripe Checkout
            window.location.href = url;
            
        } catch (err) {
            console.error('Checkout error:', err);
            setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
            toast.error('Payment failed. Please try again.');
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <Card className="w-full max-w-md shadow-card">
                <CardHeader>
                    <CardTitle>Subscribe</CardTitle>
                    <CardDescription>Get full access to 100+ additional opportunities for $97/month.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubscribe} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={submitting}
                            />
                        </div>
                        {error && (
                            <div className="text-sm text-destructive-foreground/90 text-center p-2 bg-destructive/10 rounded">
                                {error}
                            </div>
                        )}
                        <Button 
                            type="submit"
                            variant="hero" 
                            className="w-full" 
                            disabled={submitting || !email}
                        >
                            {submitting ? "Redirecting to Payment..." : "Subscribe for $97/mo"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    <Button variant="outline" className="w-full" onClick={() => navigate(-1)}>Go Back</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Subscribe;

