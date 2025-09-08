import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { EventResult } from "@/lib/search";
import { mockSearch } from "@/lib/search";
import { isSubscribed } from "@/lib/subscription";

type LocationState = {
    name: string
    email: string
    topic: string
    industry: string
}

const ResultsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = (location.state || {}) as Partial<LocationState>;
    const [top20, setTop20] = useState<EventResult[]>([]);
    const [more100, setMore100] = useState<EventResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [subscribed, setSubscribed] = useState<boolean>(isSubscribed());

    useEffect(() => {
        if (!params.topic || !params.industry || !params.email || !params.name) {
            navigate("/search");
            return;
        }
        setLoading(true);
        const payload = {
            name: params.name!,
            email: params.email!,
            topic: params.topic!,
            industry: params.industry!,
        };
        (async () => {
            const { top20, more100 } = await mockSearch(payload)
            setTop20(top20)
            setMore100(more100)
            setSubscribed(isSubscribed())
            setLoading(false)
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Searching opportunities…</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto p-6 space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Verified Opportunities</h1>
                    <p className="text-muted-foreground">Top 20 results include a verified speaker application link. Use the APPLY link on each card.</p>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {top20.map((ev) => (
                        <Card key={ev.id} className="shadow-card">
                            <CardHeader>
                                <CardTitle className="text-lg">{ev.name}</CardTitle>
                                <CardDescription className="truncate">{ev.organizer}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="text-sm">
                                    <a href={ev.mainUrl} className="text-primary hover:underline" target="_blank" rel="noreferrer">{ev.mainUrl}</a>
                                </div>
                                <div className="text-sm">
                                    <a href={ev.applicationUrl} className="text-primary hover:underline" target="_blank" rel="noreferrer">Apply to Speak</a>
                                </div>
                                {ev.contact && (
                                    <div className="text-sm text-muted-foreground truncate">{ev.contact}</div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">100+ more opportunities</h2>
                    <div className="relative border rounded-lg overflow-hidden">
                        <div className="divide-y">
                            {more100.map((ev) => (
                                <div key={ev.id} className="p-4 text-sm flex items-center justify-between">
                                    <div className="min-w-0">
                                        <div className="font-medium truncate">{ev.name}</div>
                                        <a href={ev.mainUrl} className="text-primary hover:underline truncate" target="_blank" rel="noreferrer">{ev.mainUrl}</a>
                                    </div>
                                    <div className="hidden sm:block text-muted-foreground truncate ml-4">{ev.organizer}</div>
                                </div>
                            ))}
                        </div>

                        {!subscribed && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                                <div className="space-y-3 max-w-md">
                                    <h3 className="text-xl font-semibold">For 100+ more opportunities, subscribe for only $97/mo</h3>
                                    <p className="text-muted-foreground">Unlock full access instantly and keep access for 30 days per billing period.</p>
                                    <Button variant="cta" size="lg" onClick={() => navigate("/subscribe", { state: params })}>Subscribe</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;

