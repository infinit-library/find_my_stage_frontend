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

  const getEventStatus = () => {
    // This could be enhanced based on actual event data
    return "Upcoming";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold leading-tight">
                {event.name}
              </DialogTitle>
              <DialogDescription className="text-base">
                Event Details and Information
              </DialogDescription>
            </div>
            <Badge variant="secondary" className="ml-4">
              {getEventStatus()}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Image/Header */}
          <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-20 h-20 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
                  <Calendar className="w-10 h-10" />
                </div>
                <p className="text-lg font-medium">Event Details</p>
              </div>
            </div>
          </div>

          {/* Event Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Event Information</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-muted-foreground">Date & Time</p>
                      <p className="text-foreground">{formatDate(event.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-muted-foreground">Location</p>
                      <p className="text-foreground">
                        {event.location || event.venue || event.contact || "Venue: TBD"}
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

                  {event.contact && event.contact.startsWith('mailto:') && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium text-sm text-muted-foreground">Contact</p>
                        <a 
                          href={event.contact} 
                          className="text-primary hover:underline"
                        >
                          {event.contact.replace('mailto:', '')}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Event Details</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-muted-foreground">Website</p>
                      <a 
                        href={event.mainUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline break-all"
                      >
                        {event.mainUrl}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-muted-foreground">Event Type</p>
                      <p className="text-foreground">Conference / Speaking Opportunity</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Badge variant={event.verifiedApplyLink ? "default" : "secondary"} className="mt-0.5">
                      {event.verifiedApplyLink ? "Verified" : "Unverified"}
                    </Badge>
                    <div>
                      <p className="font-medium text-sm text-muted-foreground">Application Status</p>
                      <p className="text-foreground">
                        {event.verifiedApplyLink ? "Verified speaker application link available" : "Standard event link"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">About This Event</h3>
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            {event.applicationUrl && event.verifiedApplyLink && (
              <Button 
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                onClick={() => window.open(event.applicationUrl, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Apply to Speak
              </Button>
            )}
            
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => window.open(event.mainUrl, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit Event Website
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
