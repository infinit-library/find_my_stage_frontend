import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchLoading } from "@/components/ui/search-loading";
import { Calendar, Building, User, ExternalLink, ArrowLeft } from "lucide-react";
import type { EventResult } from "@/lib/search";
import { ticketmasterSearch } from "@/lib/search";
import { isSubscribed } from "@/lib/subscription";
import { EventDetailsModal } from "@/components/EventDetailsModal";

type LocationState = {
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
    const [selectedEvent, setSelectedEvent] = useState<EventResult | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!params.topic || !params.industry) {
            navigate("/search");
            return;
        }
        setLoading(true);
        const payload = {
            name: "User", // Default name since we removed the field
            email: "user@example.com", // Default email since we removed the field
            topic: params.topic!,
            industry: params.industry!,
        };
        (async () => {
            console.log('🚀 Starting search with payload:', payload);
            const { top20, more100 } = await ticketmasterSearch(payload)
            console.log('📋 Search results:', { top20Count: top20.length, more100Count: more100.length });
            setTop20(top20)
            setMore100(more100)
            setSubscribed(isSubscribed())
            setLoading(false)
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleViewEvent = (event: EventResult) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    if (loading) {
        return (
            <SearchLoading 
                duration={5000}
                message="Searching opportunities..."
                onComplete={() => {
                    // This will be called when the loading animation completes
                    // The actual search results will be handled by the useEffect
                }}
            />
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto p-6 space-y-8">
                <div className="flex items-center justify-between">
                    <Button 
                        variant="outline" 
                        onClick={() => navigate("/search")}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Search
                    </Button>
                </div>
                
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Verified Opportunities</h1>
                    <p className="text-muted-foreground">Top 20 results include a verified speaker application link. Use the APPLY link on each card.</p>
                </div>
							
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {top20.map((ev) => (
                        <Card key={ev.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                            {/* Event Image */}
                            <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
                                <div className="absolute inset-0 bg-black/20"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center text-white">
                                        <div className="w-16 h-16 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
                                            <Calendar className="w-8 h-8" />
                                        </div>
                                        <p className="text-sm font-medium">Event</p>
                                    </div>
                                </div>
                            </div>
                            
                            <CardContent className="p-4 space-y-3">
                                {/* Event Details */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date().toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}</span>
                                    </div>
                                    
                                    <h3 className="font-bold text-lg leading-tight">{ev.name}</h3>
                                    
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Building className="w-4 h-4" />
                                        <span>{ev.organizer || 'Unknown'}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <User className="w-4 h-4" />
                                        <span>{ev.contact || 'Venue: TBD'}</span>
                                    </div>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="space-y-2 pt-2">
                                    <Button 
                                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                                        onClick={() => window.open(ev.applicationUrl || ev.mainUrl, '_blank')}
                                    >
                                        Apply to Speak
                                    </Button>
                                    
                                    <Button 
                                        variant="outline" 
                                        className="w-full"
                                        onClick={() => handleViewEvent(ev)}
                                    >
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        View Event
                                    </Button>
                                </div>
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
                                    <Button variant="cta" size="lg" onClick={() => navigate("/subscribe", { state: { topic: params.topic, industry: params.industry } })}>Subscribe</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Event Details Modal */}
            <EventDetailsModal
                event={selectedEvent}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default ResultsPage;

