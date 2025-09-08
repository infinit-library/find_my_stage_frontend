import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiCreateCheckout } from "@/lib/api";
import { loadStripe } from "@stripe/stripe-js";
import { CardFooter } from "@/components/ui/card";
import { toast } from "sonner";

const pk = import.meta.env.VITE_STRIPE_PK as string | undefined
const stripePromise = pk ? loadStripe(pk) : null

const Subscribe = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = (location.state || {}) as Record<string, unknown>;
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubscribe = async () => {
        // Pure frontend mock for testing: show toast and simulate redirect
        setSubmitting(true)
        setError(null)
        toast.success('Redirecting to Stripe (mock)...')
        setTimeout(() => {
            setSubmitting(false)
            // Simulate landing on success and unlocking (local only)
            try { localStorage.setItem('subscriptionActiveUntil', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()) } catch { }
            navigate('/results', { state: params })
        }, 800)
    };


    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <Card className="w-full max-w-md shadow-card">
                <CardHeader>
                    <CardTitle>Subscribe</CardTitle>
                    <CardDescription>Get full access to 100+ additional opportunities for $97/month.</CardDescription>
                </CardHeader>
                <CardContent />
                <CardFooter className="flex flex-col gap-3">
                    <Button variant="hero" className="w-full" onClick={handleSubscribe} disabled={submitting}>
                        {submitting ? "Redirecting..." : "Subscribe for $97/mo"}
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => navigate(-1)}>Go Back</Button>
                    {error && (
                        <div className="text-sm text-destructive-foreground/90 text-center">{error}</div>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};

export default Subscribe;

