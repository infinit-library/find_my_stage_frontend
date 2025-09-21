import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiGetSubscription } from "@/lib/api";
import { setSubscriptionActiveUntil } from "@/lib/subscription";

const SubscribeSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = (location.state || {}) as Record<string, unknown>;
    const urlEmail = new URLSearchParams(location.search).get('email')

    useEffect(() => {
        const email = (params?.email as string) || urlEmail || ''
        if (!email) return
            ; (async () => {
                try {
                    const sub = await apiGetSubscription(email)
                    if (sub.activeUntil) setSubscriptionActiveUntil(sub.activeUntil)
                } catch { }
            })()
    }, [])

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <Card className="w-full max-w-md shadow-card">
                <CardHeader>
                    <CardTitle>Subscription Successful</CardTitle>
                    <CardDescription>Your access will be granted shortly. You can return to your results now.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button variant="hero" className="w-full" onClick={() => navigate('/results', { state: params })}>Back to Results</Button>
                    <Button variant="outline" className="w-full" onClick={() => {
                        try {
                            const saved = localStorage.getItem('lastSearchParams')
                            if (saved) navigate('/results', { state: JSON.parse(saved) })
                            else navigate('/results', { state: params })
                        } catch {
                            navigate('/results', { state: params })
                        }
                    }}>Restore Results</Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default SubscribeSuccess;

