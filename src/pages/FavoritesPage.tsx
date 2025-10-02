import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Building, User, ExternalLink, ArrowLeft, MapPin, Mail, Heart } from "lucide-react";
import type { EventResult } from "@/lib/search";
import { EventDetailsModal } from "@/components/EventDetailsModal";

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

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favoriteEvents, setFavoriteEvents] = useState<EventResult[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedEvent, setSelectedEvent] = useState<EventResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('eventFavorites');
      const savedEvents = localStorage.getItem('favoriteEvents');
      
      if (savedFavorites) {
        setFavorites(new Set(JSON.parse(savedFavorites)));
      }
      
      if (savedEvents) {
        setFavoriteEvents(JSON.parse(savedEvents));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  
  const toggleFavorite = (eventId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(eventId)) {
        newFavorites.delete(eventId);
        
        try {
          const updatedEvents = favoriteEvents.filter(event => event.id !== eventId);
          setFavoriteEvents(updatedEvents);
          localStorage.setItem('favoriteEvents', JSON.stringify(updatedEvents));
        } catch (error) {
          console.error('Error removing from favorites:', error);
        }
      } else {
        newFavorites.add(eventId);
      }
      return newFavorites;
    });
  };

  const handleViewEvent = (event: EventResult) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  if (favoriteEvents.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>

          <div className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-semibold mb-2">No Favorites Yet</h2>
            <p className="text-muted-foreground mb-6">
              Start adding events to your favorites by clicking the heart icon on event cards.
            </p>
            <Button onClick={() => navigate("/search")}>
              Browse Events
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Favorites</h1>
            <p className="text-muted-foreground">{favoriteEvents.length} saved events</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {favoriteEvents.map((ev) => {
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
                    aria-label="Remove from favorites"
                  >
                    <Heart 
                      className="w-4 h-4 fill-red-500 text-red-500 transition-colors" 
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
                          
                          if (ev.eventDetails?.isVirtual) {
                            return '🌐 Virtual Event';
                          }
                          
                          
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

export default FavoritesPage;


