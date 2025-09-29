import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchLoading } from "@/components/ui/search-loading";
import { ResultsSkeleton } from "@/components/ui/results-skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Calendar, Building, User, ExternalLink, ArrowLeft, MapPin, Mail, Heart } from "lucide-react";
import type { EventResult } from "@/lib/search";
import { combinedSearch } from "@/lib/search";
import { isSubscribed } from "@/lib/subscription";
import { EventDetailsModal } from "@/components/EventDetailsModal";
import EmptyResults from "@/components/EmptyResults";
import SearchHeader from "@/components/SearchHeader";

type LocationState = {
  topic: string
  industry: string
}


const getEventImage = (event: EventResult): string | null => {
  if (!event.images || event.images.length === 0) {
    return null;
  }


  const preferredRatios = ['16_9', '4_3'];

  for (const ratio of preferredRatios) {
    const image = event.images.find(img => img.ratio === ratio);
    if (image) {
      return image.url;
    }
  }


  return event.images[0].url;
}

const ResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = (location.state || {}) as Partial<LocationState>;
  const [top20, setTop20] = useState<EventResult[]>([]);
  const [more100, setMore100] = useState<EventResult[]>([]);
  const [displayedMore, setDisplayedMore] = useState<EventResult[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState<boolean>(isSubscribed());
  const [selectedEvent, setSelectedEvent] = useState<EventResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Load favorites from localStorage on component mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('eventFavorites');
      if (savedFavorites) {
        setFavorites(new Set(JSON.parse(savedFavorites)));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem('eventFavorites', JSON.stringify(Array.from(favorites)));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, [favorites]);

  // Toggle favorite status
  const toggleFavorite = (eventId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(eventId)) {
        newFavorites.delete(eventId);
        // Remove from localStorage
        try {
          const savedEvents = localStorage.getItem('favoriteEvents');
          if (savedEvents) {
            const events = JSON.parse(savedEvents);
            const updatedEvents = events.filter((event: EventResult) => event.id !== eventId);
            localStorage.setItem('favoriteEvents', JSON.stringify(updatedEvents));
          }
        } catch (error) {
          console.error('Error removing from favorites:', error);
        }
      } else {
        newFavorites.add(eventId);
        // Add to localStorage
        try {
          const allEvents = [...top20, ...more100];
          const eventToAdd = allEvents.find(event => event.id === eventId);
          if (eventToAdd) {
            const savedEvents = localStorage.getItem('favoriteEvents');
            const events = savedEvents ? JSON.parse(savedEvents) : [];
            const exists = events.some((event: EventResult) => event.id === eventId);
            if (!exists) {
              events.push(eventToAdd);
              localStorage.setItem('favoriteEvents', JSON.stringify(events));
            }
          }
        } catch (error) {
          console.error('Error adding to favorites:', error);
        }
      }
      return newFavorites;
    });
  };

  // Handle URL parameters and payment success
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const topic = urlParams.get('topic') || params.topic;
    const industry = urlParams.get('industry') || params.industry;
    const paymentSuccess = urlParams.get('payment') === 'success';

    if (!topic || !industry) {
      navigate("/search");
      return;
    }

    // If payment was successful, activate subscription
    if (paymentSuccess) {
      const activeUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      localStorage.setItem('subscriptionActiveUntil', activeUntil);
      setSubscribed(true);
    }

    const payload = {
      name: "User",
      email: "user@example.com",
      topic: topic,
      industry: industry,
    };

    console.log("payload+++++", payload);

    (async () => {
      console.log('🚀 Starting combined search (Ticketmaster + Eventbrite + Call for Data Speakers + Pretalx) with payload:', payload);
      const { top20, more100 } = await combinedSearch(payload)
      console.log('📋 Combined search results:', { top20Count: top20.length, more100Count: more100.length });
      setTop20(top20)
      setMore100(more100)
      setDisplayedMore(more100.slice(0, 20))
      setSubscribed(isSubscribed())
      setSearchCompleted(true)
    })()

  }, [location.search]);


  useEffect(() => {
    if (searchCompleted && showSkeleton && !loading) {

      setTimeout(() => {
        setShowSkeleton(false);
      }, 1500);
    }
  }, [searchCompleted, showSkeleton, loading]);

  const handleViewEvent = (event: EventResult) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  useEffect(() => {
    console.log("more100+++++", displayedMore);
  }, []);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    const startIndex = nextPage * 20;
    const endIndex = startIndex + 20;
    const nextBatch = more100.slice(startIndex, endIndex);

    console.log(`Loading page ${nextPage}: events ${startIndex} to ${endIndex - 1}, found ${nextBatch.length} events`);

    if (nextBatch.length > 0) {
      setDisplayedMore(prev => [...prev, ...nextBatch]);
      setCurrentPage(nextPage);
    }
  };

  const hasMoreEvents = displayedMore.length < more100.length;

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
    if (searchCompleted) {

      setShowSkeleton(true);
      setTimeout(() => {
        setShowSkeleton(false);
      }, 1500);
    } else {

      setShowSkeleton(true);
    }
  }, [searchCompleted]);


  if (loading) {
    return (
      <SearchLoading
        duration={5000}
        message="Searching opportunities from Ticketmaster, Eventbrite, Call for Data Speakers, and Pretalx..."
        onComplete={handleLoadingComplete}
      />
    );
  }

  if (showSkeleton) {
    return <ResultsSkeleton />;
  }

  // Show empty state if no events found
  if (!loading && !showSkeleton && top20.length === 0 && more100.length === 0) {
    return <EmptyResults industry={params.industry} topic={params.topic} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
            <Button
              variant="outline"
              onClick={() => navigate("/search")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Search
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate("/favorites")}
              className="flex items-center gap-2"
            >
              <Heart className="w-4 h-4" />
              My Favorites ({favorites.size})
            </Button>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Results Content */}
          <div className="flex-1 space-y-8">

            {/* Search Parameters Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-700">Industry:</span>
                  <span className="text-sm text-blue-900 font-semibold">{params.industry}</span>
                </div>
                <div className="w-px h-4 bg-blue-300"></div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span className="text-sm font-medium text-indigo-700">Topic:</span>
                  <span className="text-sm text-indigo-900 font-semibold">{params.topic}</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-blue-600">
                Searching for speaking opportunities in {params.industry?.toLowerCase()} related to {params.topic?.toLowerCase()}
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Verified Opportunities</h1>
              <p className="text-muted-foreground">Top 20 results include a verified speaker application link. Use the APPLY link on each card.</p>
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>✅ Expired events filtered out • Duplicates removed • Results sorted by date</span>
              </div>
            </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {top20
            .sort((a, b) => {
              // Sort events with contact information to the top
              const aHasContact = !!(a.contact && a.contact !== 'Contact TBD' && a.contact !== 'Contact: See event details');
              const bHasContact = !!(b.contact && b.contact !== 'Contact TBD' && b.contact !== 'Contact: See event details');
              
              if (aHasContact && !bHasContact) return -1;
              if (!aHasContact && bHasContact) return 1;
              return 0;
            })
            .map((ev) => {
            const eventImage = getEventImage(ev);
            const hasContact = !!(ev.contact && ev.contact !== 'Contact TBD' && ev.contact !== 'Contact: See event details');
            return (
              <Card 
                key={ev.id} 
                className={`overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full w-full max-w-sm ${
                  hasContact ? 'bg-yellow-50 border-yellow-200' : ''
                }`}
              >
                <div className="aspect-video relative overflow-hidden">
                  {eventImage ? (
                    <>
                      <img
                        src={eventImage}
                        alt={ev.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {

                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute inset-0 flex items-center justify-center hidden">
                        <div className="text-center text-white">
                          <div className="w-16 h-16 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
                            <Calendar className="w-8 h-8" />
                          </div>
                          <p className="text-sm font-medium">Event</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <div className="text-center text-gray-600">
                        <div className="w-16 h-16 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
                          <Calendar className="w-8 h-8" />
                        </div>
                        <p className="text-sm font-medium">Event</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Contact Information Badge */}
                  {hasContact && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-md">
                      <Mail className="w-3 h-3" />
                      Contact Available
                    </div>
                  )}
                  
                  {/* Favorite Heart Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(ev.id);
                    }}
                    className="absolute top-2 left-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors shadow-md"
                    aria-label={favorites.has(ev.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart 
                      className={`w-4 h-4 transition-colors ${
                        favorites.has(ev.id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-gray-600 hover:text-red-500'
                      }`} 
                    />
                  </button>
                </div>

                <CardContent className="p-4 flex flex-col flex-grow">
                  <div className="space-y-2 flex-grow">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{ev.startDate || ev.date ? new Date(ev.startDate || ev.date || '').toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Date TBD'}</span>
                    </div>

                    <h3 className="font-bold text-base leading-tight line-clamp-2">{ev.name}</h3>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="w-4 h-4" />
                      <span className="line-clamp-1">{ev.organizer || 'Unknown'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span className="line-clamp-1">
                        {ev.contact || 
                         (ev.venue ? `Venue: ${ev.venue}` : 
                          ev.organizer ? `Organizer: ${ev.organizer}` : 
                          'Contact: See event details')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">
                        {(() => {
                          // Check if it's a virtual event
                          if (ev.eventDetails?.isVirtual) {
                            return '🌐 Virtual Event';
                          }
                          
                          // Build location string from available fields
                          const locationParts = [];
                          
                          if (ev.eventDetails?.address) {
                            locationParts.push(ev.eventDetails.address);
                          } else if (ev.location) {
                            locationParts.push(ev.location);
                          } else if (ev.venue) {
                            locationParts.push(ev.venue);
                          }
                          
                          if (ev.eventDetails?.city) {
                            locationParts.push(ev.eventDetails.city);
                          }
                          
                          if (ev.eventDetails?.country) {
                            locationParts.push(ev.eventDetails.country);
                          }
                          
                          return locationParts.length > 0 
                            ? locationParts.join(', ') 
                            : 'Location TBD';
                        })()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 mt-auto">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleViewEvent(ev)}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Event
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">More opportunities</h2>
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>✅ All expired events filtered out • Duplicates removed • Results sorted by date</span>
            </div>
          </div>

          {/* {!subscribed ? ( */}
            <div className="relative border rounded-lg overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 justify-items-center">
                {displayedMore
                  .sort((a, b) => {
                    // Sort events with contact information to the top
                    const aHasContact = !!(a.contact && a.contact !== 'Contact TBD' && a.contact !== 'Contact: See event details');
                    const bHasContact = !!(b.contact && b.contact !== 'Contact TBD' && b.contact !== 'Contact: See event details');
                    
                    if (aHasContact && !bHasContact) return -1;
                    if (!aHasContact && bHasContact) return 1;
                    return 0;
                  })
                  .map((ev) => {
                  const eventImage = getEventImage(ev);
                  const hasContact = !!(ev.contact && ev.contact !== 'Contact TBD' && ev.contact !== 'Contact: See event details');
                  return (
                    <Card 
                      key={ev.id} 
                      className={`overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full w-full max-w-sm ${
                        hasContact ? 'bg-yellow-50 border-yellow-200' : ''
                      }`}
                    >
                      {/* Event Image */}
                      <div className="aspect-video relative overflow-hidden">
                        {eventImage ? (
                          <>
                            <img
                              src={eventImage}
                              alt={ev.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {

                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                            <div className="absolute inset-0 bg-black/20"></div>
                            <div className="absolute inset-0 flex items-center justify-center hidden">
                              <div className="text-center text-white">
                                <div className="w-16 h-16 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
                                  <Calendar className="w-8 h-8" />
                                </div>
                                <p className="text-sm font-medium">Event</p>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <div className="text-center text-gray-600">
                              <div className="w-16 h-16 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
                                <Calendar className="w-8 h-8" />
                              </div>
                              <p className="text-sm font-medium">Event</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Contact Information Badge */}
                        {hasContact && (
                          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-md">
                            <Mail className="w-3 h-3" />
                            Contact Available
                          </div>
                        )}
                        
                        {/* Favorite Heart Icon */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(ev.id);
                          }}
                          className="absolute top-2 left-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors shadow-md"
                          aria-label={favorites.has(ev.id) ? "Remove from favorites" : "Add to favorites"}
                        >
                          <Heart 
                            className={`w-4 h-4 transition-colors ${
                              favorites.has(ev.id) 
                                ? 'fill-red-500 text-red-500' 
                                : 'text-gray-600 hover:text-red-500'
                            }`} 
                          />
                        </button>
                      </div>

                      <CardContent className="p-4 flex flex-col flex-grow">
                        {/* Event Details */}
                        <div className="space-y-2 flex-grow">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{ev.startDate || ev.date ? new Date(ev.startDate || ev.date || '').toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : 'Date TBD'}</span>
                          </div>

                          <h3 className="font-bold text-base leading-tight line-clamp-2">{ev.name}</h3>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building className="w-4 h-4" />
                            <span className="line-clamp-1">{ev.organizer || 'Unknown'}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="w-4 h-4" />
                            <span className="line-clamp-1">{ev.contact || 'Venue: TBD'}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-4 mt-auto">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleViewEvent(ev)}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Event
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* View More Events Button */}
              {hasMoreEvents && (
                <div className="flex justify-center pt-6">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleLoadMore}
                    className="px-8"
                  >
                    Load 20 More Events ({more100.length - displayedMore.length} remaining)
                  </Button>
                </div>
              )}

              {/* Subscription Overlay */}
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center ">
                <div className="space-y-3 max-w-md border-2 border-blue-500 rounded-lg p-6 bg-white">
                  <h3 className="text-xl font-semibold">For 100+ more opportunities, subscribe for only $97/mo</h3>
                  <p className="text-muted-foreground">Unlock full access instantly and keep access for 30 days per billing period.</p>
                  <Button
                    variant="cta"
                    size="lg"
                    onClick={() => 
                      navigate("/subscribe", { 
                        state: { 
                          topic: params.topic, 
                          industry: params.industry 
                        }
                      })
                    }
                  >
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          {/* ) : ( */}
          {/* )} */}
          </div>
          </div>

          {/* Right Side - Search Header */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-6">
              <SearchHeader 
                currentIndustry={params.industry}
                currentTopic={params.topic}
              />
            </div>
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

