import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiGetSubscription } from "@/lib/api";
import { setSubscriptionActiveUntil } from "@/lib/subscription";

const SubscribeCancel = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = (location.state || {}) as Record<string, unknown>;
    const urlEmail = new URLSearchParams(location.search).get('email')
    const email = (params?.email as string) || urlEmail || ''

    const refreshSub = async () => {
        if (!email) return
        try {
            const sub = await apiGetSubscription(email)
            if (sub.activeUntil) setSubscriptionActiveUntil(sub.activeUntil)
        } catch { }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <Card className="w-full max-w-md shadow-card">
                <CardHeader>
                    <CardTitle>Checkout Canceled</CardTitle>
                    <CardDescription>You can try again anytime. Your results are saved for now.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full" onClick={() => navigate('/subscribe', { state: params })}>Try Again</Button>
                    <Button variant="hero" className="w-full" onClick={() => navigate('/results', { state: params })}>Back to Results</Button>
                    <Button variant="secondary" className="w-full" onClick={refreshSub}>Refresh Access</Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default SubscribeCancel;

