import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, User, ExternalLink, Mail, Globe, Clock } from "lucide-react";
import type { EventResult } from "@/lib/search";

interface EventDetailsModalProps {
  event: EventResult | null;
  isOpen: boolean;
  onClose: () => void;
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

const getLocationCoordinates = (location: string): { lat: number; lng: number; name: string } => {const defaultLocation = { lat: 36.1627, lng: -86.7816, name: "Nashville, TN" };if (!location) return defaultLocation;
	const locationMap: { [key: string]: { lat: number; lng: number; name: string } } = {
		"belmont university": { lat: 36.1317, lng: -86.7928, name: "Belmont University" },
		"massey concert hall": { lat: 36.1317, lng: -86.7928, name: "Massey Concert Hall" },
		"nashville": { lat: 36.1627, lng: -86.7816, name: "Nashville, TN" },
		"convention center": { lat: 36.1627, lng: -86.7816, name: "Nashville Convention Center" },
		"chattanooga": { lat: 35.0456, lng: -85.3097, name: "Chattanooga, TN" },
		"tivoli theatre": { lat: 35.0456, lng: -85.3097, name: "Tivoli Theatre" },
		"walker theatre": { lat: 35.0456, lng: -85.3097, name: "The Walker Theatre" },
		"tedx": { lat: 35.0456, lng: -85.3097, name: "Chattanooga, TN" },
		"american airlines center": { lat: 32.7903, lng: -96.8103, name: "American Airlines Center" },
		"dallas": { lat: 32.7767, lng: -96.7970, name: "Dallas, TX" },
		"mantle conference": { lat: 32.7903, lng: -96.8103, name: "Dallas, TX" },
		"joshua giles": { lat: 32.7903, lng: -96.8103, name: "Dallas, TX" },
	};const locationLower = location.toLowerCase();
	const priorityOrder = [
		"american airlines center",
		"belmont university", 
		"massey concert hall",
		"tivoli theatre",
		"walker theatre",
		"mantle conference",
		"joshua giles",
		"tedx",
		"dallas",
		"chattanooga",
		"nashville",
		"convention center"
	];
	for (const key of priorityOrder) {
		if (locationLower.includes(key)) {
			return locationMap[key];
		}
	}
	for (const [key, coords] of Object.entries(locationMap)) {
		if (locationLower.includes(key)) {
			return coords;
		}
	}
	return defaultLocation;
}

const createGoogleMapsUrl = (event: EventResult): string => {
  const location = event.location || event.venue || event.contact || '';

  
  if (location && location !== 'Venue: TBD') {
    
    const cleanLocation = location.replace(/^Venue:\s*/, '').trim();
    const encodedLocation = encodeURIComponent(cleanLocation);
    return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  }

  
  return 'https://maps.app.goo.gl/jkJtUbtp9TM23JAy7';
}

export const EventDetailsModal = ({ event, isOpen, onClose }: EventDetailsModalProps) => {
  if (!event) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Date TBD";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "Date TBD";
    }
  };

  const formatDateRange = () => {
    
    const startDateValue = event.startDate || event.date;

    if (!startDateValue) {
      
      const defaultStartDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); 
      const defaultEndDate = new Date(defaultStartDate.getTime() + 2 * 24 * 60 * 60 * 1000); 
      return `${formatDate(defaultStartDate.toISOString())} - ${formatDate(defaultEndDate.toISOString())}`;
    }

    const startDate = formatDate(startDateValue);

    
    if (event.endDate) {
      const endDate = formatDate(event.endDate);
      return `${startDate} - ${endDate}`;
    }

    
    const startDateObj = new Date(startDateValue);
    const endDateObj = new Date(startDateObj.getTime() + 2 * 24 * 60 * 60 * 1000); 
    const endDate = formatDate(endDateObj.toISOString());

    return `${startDate} - ${endDate}`;
  };

  const eventImage = getEventImage(event);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] p-0 flex flex-col">
        <DialogHeader className="sticky top-0 z-10 bg-background border-b pb-8 px-8 pt-8">
          <div className="text-center space-y-4">
            <DialogTitle className="text-3xl font-bold leading-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {event.name}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8">

          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="w-full max-w-2xl h-64 relative overflow-hidden rounded-2xl shadow-2xl">
                {eventImage ? (
                  <>
                    <img
                      src={eventImage}
                      alt={event.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center hidden">
                      <div className="text-center text-white">
                        <div className="w-20 h-20 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
                          <Calendar className="w-10 h-10" />
                        </div>
                        <p className="text-lg font-medium">Event Details</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-20 h-20 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
                        <Calendar className="w-10 h-10" />
                      </div>
                      <p className="text-lg font-medium">Event Details</p>
                    </div>
                  </div>
                )}
              </div>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground border-b-2 border-blue-200 pb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    Event Information
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium text-sm text-muted-foreground">Date & Time</p>
                        <p className="text-foreground text-[12px] ">{formatDateRange()}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-muted-foreground">Location</p>
                        <p className="text-foreground">
                          {event.location || event.venue || "Location TBD"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium text-sm text-muted-foreground">Organizer</p>
                        <p className="text-foreground">{event.organizer || "Unknown"}</p>
                      </div>
                    </div>

                    {event.contact && (
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium text-sm text-muted-foreground">Contact Information</p>
                          <p className="text-foreground">
                            {event.contact.startsWith('mailto:') ? (
                              <a
                                href={event.contact}
                                className="text-primary hover:underline"
                              >
                                {event.contact.replace('mailto:', '')}
                              </a>
                            ) : (
                              event.contact
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground border-b-2 border-purple-200 pb-3 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-purple-500" />
                    Event Details
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium text-sm text-muted-foreground">Website</p>
                        <button
                          onClick={() => {
                            if (event.mainUrl && event.mainUrl !== '#' && event.mainUrl.startsWith('http')) {
                              window.open(event.mainUrl, '_blank', 'noopener,noreferrer');
                            } else {
                              console.warn('Invalid or missing URL for event:', event.name, event.mainUrl);
                            }
                          }}
                          className="text-primary hover:underline cursor-pointer bg-transparent border-none p-0 text-left"
                          disabled={!event.mainUrl || event.mainUrl === '#' || !event.mainUrl.startsWith('http')}
                        >
                          {event.mainUrl && event.mainUrl !== '#' && event.mainUrl.startsWith('http') 
                            ? 'visit website...' 
                            : 'website unavailable'}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium text-sm text-muted-foreground">Event Type</p>
                        <p className="text-foreground">Conference / Speaking Opportunity</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-foreground border-b border-orange-200 pb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    Event Location
                  </h4>
                  {(() => {
                    const location = event.location || event.venue || event.contact || '';
                    const eventName = event.name || '';
                    const combinedLocation = `${location} ${eventName}`.toLowerCase();
                    
                    const coords = getLocationCoordinates(combinedLocation);
                    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.01}%2C${coords.lat - 0.01}%2C${coords.lng + 0.01}%2C${coords.lat + 0.01}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`;
                    const fullMapUrl = `https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}#map=15/${coords.lat}/${coords.lng}`;
                    
                    return (
                      <>
                        <div className="w-full h-32 rounded-lg overflow-hidden border shadow-sm">
                          <iframe
                            src={mapUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={`Event Location Map - ${coords.name}`}
                          />
                        </div>
                        <div className="text-center space-y-1">
                          <p className="text-xs text-muted-foreground font-medium">{coords.name}</p>
                          <button
                            onClick={() => {
                              window.open(fullMapUrl, '_blank', 'noopener,noreferrer');
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 underline cursor-pointer bg-transparent border-none p-0"
                          >
                            View larger map
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground border-b-2 border-green-200 pb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-green-500" />
                About This Event
              </h3>
              <div className="bg-muted/50 rounded-lg p-4">
                {event.description ? (
                  <p className="text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                ) : (
                  <p className="text-muted-foreground leading-relaxed">
                    This is a speaking opportunity in your selected field. The event organizer is looking for qualified speakers to present on relevant topics.
                    {event.verifiedApplyLink
                      ? " We have verified the speaker application process for this event."
                      : " Please visit the event website for more information about speaking opportunities."
                    }
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
