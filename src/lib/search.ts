import { ticketmasterApi, eventbriteApi, callForDataSpeakersApi, pretalxApi, searchApi, serpApi } from './api';
import { convertToTicketmasterParams, generateSearchStrategies } from './ticketmaster-mapping';
import { aiSuggestionService } from './ai-suggestions';


function formatUrl(url: string | undefined, fallback: string): string {
    if (!url || url === '#' || url === '' || !url.startsWith('http')) {
        return fallback;
    }
    return url;
}

export type SearchInput = {
    name: string
    email: string
    topic: string
    industry: string
}

export type EventResult = {
    id: string
    name: string
    mainUrl: string
    applicationUrl?: string
    contact?: string
    organizer?: string
    verifiedApplyLink: boolean
    description?: string
    date?: string
    startDate?: string
    endDate?: string
    location?: string
    venue?: string
    images?: Array<{
        url: string
        width?: number
        height?: number
        ratio?: string
        fallback?: boolean
    }>
    
    eventDetails?: {
        eventType?: string
        eventCategory?: string
        format?: string
        duration?: string
        timezone?: string
        venue?: string
        address?: string
        city?: string
        country?: string
        isVirtual?: boolean
        pricing?: string[]
        isFree?: boolean
        registrationRequired?: boolean
        registrationDeadline?: string
        capacity?: number
        topics?: string[]
        targetAudience?: string[]
        speakers?: string[]
        agenda?: string[]
        language?: string
        cpdCredits?: number
        networkingOpportunities?: boolean
        hasExhibition?: boolean
        hasWorkshops?: boolean
        hasKeynotes?: boolean
        hasPanelDiscussion?: boolean
        accessibility?: string
        socialMedia?: string[]
        website?: string
        tags?: string[]
        keywords?: string[]
    } | null
}


function convertSerpApiEvent(event: any, index: number): EventResult {
    const fallbackStartDate = new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000);
    const fallbackEndDate = new Date(fallbackStartDate.getTime() + 2 * 24 * 60 * 60 * 1000);
    
    
    const startDate = event.date || event.startDate || fallbackStartDate.toISOString();
    const endDate = event.endDate || fallbackEndDate.toISOString();
    
    // Prioritize direct event website over aggregator links
    const getDirectEventUrl = () => {
        // Check for direct event website first
        if (event.eventDetails?.website && 
            !event.eventDetails.website.includes('eventbrite.com') &&
            !event.eventDetails.website.includes('ticketmaster.com') &&
            !event.eventDetails.website.includes('pretalx.com') &&
            event.eventDetails.website.startsWith('http')) {
            return event.eventDetails.website;
        }
        
        // Check for contact website
        if (event.contactInfo?.website && 
            !event.contactInfo.website.includes('eventbrite.com') &&
            !event.contactInfo.website.includes('ticketmaster.com') &&
            !event.contactInfo.website.includes('pretalx.com') &&
            event.contactInfo.website.startsWith('http')) {
            return event.contactInfo.website;
        }
        
        // Fall back to the main URL if it's not an aggregator
        if (event.url && 
            !event.url.includes('eventbrite.com') &&
            !event.url.includes('ticketmaster.com') &&
            !event.url.includes('pretalx.com') &&
            event.url.startsWith('http')) {
            return event.url;
        }
        
        // Last resort: use the main URL even if it's an aggregator
        return event.url || '#';
    };
    
    
    let enhancedDescription = event.description || '';
    if (event.eventDetails) {
        const details = event.eventDetails;
        
        
        if (details.pricing && details.pricing.length > 0) {
            enhancedDescription += `\n\n💰 Pricing: ${details.pricing.join(', ')}`;
        } else if (details.isFree) {
            enhancedDescription += '\n\n💰 Pricing: Free Event';
        }
        
        
        if (details.duration) {
            enhancedDescription += `\n\n⏱️ Duration: ${details.duration}`;
        }
        
        
        if (details.topics && details.topics.length > 0) {
            enhancedDescription += `\n\n📋 Topics: ${details.topics.join(', ')}`;
        }
        
        
        if (details.targetAudience && details.targetAudience.length > 0) {
            enhancedDescription += `\n\n👥 Target Audience: ${details.targetAudience.join(', ')}`;
        }
        
        
        const features = [];
        if (details.hasKeynotes) features.push('Keynotes');
        if (details.hasWorkshops) features.push('Workshops');
        if (details.hasPanelDiscussion) features.push('Panel Discussions');
        if (details.hasExhibition) features.push('Exhibition');
        if (details.networkingOpportunities) features.push('Networking');
        if (details.isVirtual) features.push('Virtual Event');
        
        if (features.length > 0) {
            enhancedDescription += `\n\n✨ Features: ${features.join(', ')}`;
        }
        
        
        if (details.registrationRequired) {
            enhancedDescription += '\n\n📝 Registration Required';
            if (details.registrationDeadline) {
                enhancedDescription += ` (Deadline: ${details.registrationDeadline})`;
            }
        }
        
        
        if (details.capacity) {
            enhancedDescription += `\n\n👥 Capacity: ${details.capacity} attendees`;
        }
        
        
        if (details.cpdCredits) {
            enhancedDescription += `\n\n🎓 CPD Credits: ${details.cpdCredits}`;
        }
    }
    
    return {
        id: event.id || `serpapi_${index}`,
        name: event.title || event.name || 'Untitled Event',
        mainUrl: formatUrl(getDirectEventUrl(), '#'),
        applicationUrl: getDirectEventUrl() !== '#' ? formatUrl(getDirectEventUrl(), '#') : undefined,
        contact: (() => {
            // Extract contact information from multiple possible fields
            const contactInfo = [];
            
            // Primary contact info from SerpAPI extraction
            if (event.contactInfo?.email) {
                contactInfo.push(`Email: ${event.contactInfo.email}`);
            }
            if (event.contactInfo?.phone) {
                contactInfo.push(`Phone: ${event.contactInfo.phone}`);
            }
            if (event.contactInfo?.website) {
                contactInfo.push(`Website: ${event.contactInfo.website}`);
            }
            
            // Additional contact fields
            if (event.contact_email) {
                contactInfo.push(`Email: ${event.contact_email}`);
            }
            if (event.contact_phone) {
                contactInfo.push(`Phone: ${event.contact_phone}`);
            }
            if (event.organizer_email) {
                contactInfo.push(`Email: ${event.organizer_email}`);
            }
            if (event.contact) {
                contactInfo.push(event.contact);
            }
            
            // Extract from description if no direct contact info
            if (contactInfo.length === 0 && event.description) {
                const emailMatch = event.description.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
                if (emailMatch) {
                    contactInfo.push(`Email: ${emailMatch[0]}`);
                }
                
                const phoneMatch = event.description.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/);
                if (phoneMatch) {
                    contactInfo.push(`Phone: ${phoneMatch[0]}`);
                }
            }
            
            return contactInfo.length > 0 ? contactInfo.join(' • ') : undefined;
        })(),
        organizer: event.organizer || event.organizer_name || event.publisher || 'Unknown Organizer',
        verifiedApplyLink: false, 
        description: enhancedDescription,
        date: event.date || startDate,
        startDate: startDate,
        endDate: endDate,
        location: (() => {
            // Extract location information from multiple possible fields
            const locationParts = [];
            
            // Check for virtual events first
            if (event.eventDetails?.isVirtual || event.isVirtual) {
                return '🌐 Virtual Event';
            }
            
            // Primary location from SerpAPI extraction
            if (event.location) {
                locationParts.push(event.location);
            }
            
            // Venue information
            if (event.venue?.name) {
                locationParts.push(event.venue.name);
            }
            if (event.venue?.address) {
                locationParts.push(event.venue.address);
            }
            if (event.venue?.city) {
                locationParts.push(event.venue.city);
            }
            if (event.venue?.state) {
                locationParts.push(event.venue.state);
            }
            if (event.venue?.country) {
                locationParts.push(event.venue.country);
            }
            
            // Additional location fields
            if (event.address) {
                locationParts.push(event.address);
            }
            if (event.city) {
                locationParts.push(event.city);
            }
            if (event.state) {
                locationParts.push(event.state);
            }
            if (event.country) {
                locationParts.push(event.country);
            }
            
            // Event details location
            if (event.eventDetails?.venue) {
                locationParts.push(event.eventDetails.venue);
            }
            if (event.eventDetails?.address) {
                locationParts.push(event.eventDetails.address);
            }
            if (event.eventDetails?.city) {
                locationParts.push(event.eventDetails.city);
            }
            if (event.eventDetails?.country) {
                locationParts.push(event.eventDetails.country);
            }
            
            // Extract from description if no direct location info
            if (locationParts.length === 0 && event.description) {
                // Look for location patterns in description
                const locationPatterns = [
                    /in\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
                    /at\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
                    /([A-Z][a-z]+,\s*[A-Z]{2})/g, // City, State
                    /([A-Z][a-z]+,\s*[A-Z][a-z]+)/g, // City, Country
                ];
                
                for (const pattern of locationPatterns) {
                    const match = event.description.match(pattern);
                    if (match) {
                        locationParts.push(match[1] || match[0]);
                        break;
                    }
                }
            }
            
            return locationParts.length > 0 ? locationParts.join(', ') : undefined;
        })(),
        venue: (() => {
            // Extract venue information
            if (event.venue?.name) return event.venue.name;
            if (event.venue) return event.venue;
            if (event.eventDetails?.venue) return event.eventDetails.venue;
            if (event.location) return event.location;
            return undefined;
        })(),
        images: event.metadata?.thumbnail ? [{ url: event.metadata.thumbnail, ratio: '16_9' }] : 
                event.metadata?.imageInfo?.thumbnail ? [{ url: event.metadata.imageInfo.thumbnail, ratio: '16_9' }] :
                event.images ? [{ url: event.images, ratio: '16_9' }] : 
                
                [{ url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=225&fit=crop&crop=center', ratio: '16_9' }],
        
        
        eventDetails: event.eventDetails || null
    };
}

function convertTicketmasterEvent(event: any, index: number): EventResult {
    
    const fallbackStartDate = new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000);
    const fallbackEndDate = new Date(fallbackStartDate.getTime() + 2 * 24 * 60 * 60 * 1000);
    
    const startDate = event.dates?.start?.dateTime || event.dates?.start?.localDate || fallbackStartDate.toISOString();
    const endDate = event.dates?.end?.dateTime || event.dates?.end?.localDate || fallbackEndDate.toISOString();
    
    return {
        id: `tm-${event.id || index}`,
        name: event.name || 'Untitled Event',
        mainUrl: formatUrl(event.url, `https://www.ticketmaster.com/event/${event.id}`),
        applicationUrl: event.url || undefined, 
        contact: event._embedded?.venues?.[0]?.name ? `Venue: ${event._embedded.venues[0].name}` : 
                 event.venue?.name ? `Venue: ${event.venue.name}` : 
                 event._embedded?.attractions?.[0]?.name ? `Organizer: ${event._embedded.attractions[0].name}` : 
                 event.organizer ? `Organizer: ${event.organizer}` : undefined,
        organizer: event.organizer || event._embedded?.attractions?.[0]?.name || 'Unknown Organizer',
        verifiedApplyLink: false, 
        description: event.description || event.info || undefined,
        date: startDate,
        startDate: startDate,
        endDate: endDate,
        location: (() => {
            const venue = event._embedded?.venues?.[0];
            if (venue) {
                const parts = [];
                if (venue.name) parts.push(venue.name);
                if (venue.city?.name) parts.push(venue.city.name);
                if (venue.state?.name) parts.push(venue.state.name);
                if (venue.country?.name) parts.push(venue.country.name);
                return parts.join(', ');
            }
            return event._embedded?.venues?.[0]?.city?.name || event._embedded?.venues?.[0]?.name || undefined;
        })(),
        venue: event._embedded?.venues?.[0]?.name || undefined,
        images: event.images ? event.images.map((img: any) => ({
            url: img.url,
            width: img.width,
            height: img.height,
            ratio: img.ratio,
            fallback: img.fallback
        })) : undefined,
    };
}

function convertEventbriteEvent(event: any, index: number): EventResult {
    const fallbackStartDate = new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000);
    const fallbackEndDate = new Date(fallbackStartDate.getTime() + 2 * 24 * 60 * 60 * 1000);
    
    const startDate = event.startDate || event.dateTime || fallbackStartDate.toISOString();
    const endDate = event.endDate || fallbackEndDate.toISOString();
    
    // Try to find direct event website instead of Eventbrite link
    const getDirectEventUrl = () => {
        // Check for organizer website first
        if (event.organizer?.website && 
            !event.organizer.website.includes('eventbrite.com') &&
            event.organizer.website.startsWith('http')) {
            return event.organizer.website;
        }
        
        // Check for venue website
        if (event.venue?.website && 
            !event.venue.website.includes('eventbrite.com') &&
            event.venue.website.startsWith('http')) {
            return event.venue.website;
        }
        
        // Check for custom event URL
        if (event.eventUrl && 
            !event.eventUrl.includes('eventbrite.com') &&
            event.eventUrl.startsWith('http')) {
            return event.eventUrl;
        }
        
        // Fall back to Eventbrite URL
        return event.eventUrl || event.url || `https://www.eventbrite.com/e/${event.id}`;
    };
    
    return {
        id: `eb-${event.sourceId || event.id || index}`,
        name: event.title || event.name || 'Untitled Event',
        mainUrl: formatUrl(getDirectEventUrl(), `https://www.eventbrite.com/e/${event.id}`),
        applicationUrl: getDirectEventUrl() !== `https://www.eventbrite.com/e/${event.id}` ? getDirectEventUrl() : undefined,
        contact: event.organizer?.email ? `Email: ${event.organizer.email}` : 
                 event.organizer?.name ? `Organizer: ${event.organizer.name}` : 
                 event.contact_email ? `Email: ${event.contact_email}` : undefined,
        organizer: event.organizer?.name || 'Unknown Organizer',
        verifiedApplyLink: false,
        description: event.description || undefined,
        date: startDate,
        startDate: startDate,
        endDate: endDate,
        location: (() => {
            const parts = [];
            if (event.venue?.name) parts.push(event.venue.name);
            if (event.venue?.address) parts.push(event.venue.address);
            if (event.venue?.city) parts.push(event.venue.city);
            if (event.venue?.state) parts.push(event.venue.state);
            if (event.venue?.country) parts.push(event.venue.country);
            
            if (parts.length > 0) {
                return parts.join(', ');
            }
            
            return event.location || event.venue || undefined;
        })(),
        venue: event.venue?.name || event.venue || undefined,
        images: event.imageUrl ? [{
            url: event.imageUrl,
            width: undefined,
            height: undefined,
            ratio: undefined,
            fallback: false
        }] : undefined,
    };
}

function convertCallForDataSpeakersEvent(event: any, index: number): EventResult {
    const fallbackStartDate = new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000);
    const fallbackEndDate = new Date(fallbackStartDate.getTime() + 2 * 24 * 60 * 60 * 1000);
    
    const startDate = event.event_date || event.start_date || fallbackStartDate.toISOString();
    const endDate = event.end_date || fallbackEndDate.toISOString();
    
    // Call for Data Speakers events should already have direct website links
    const getDirectEventUrl = () => {
        // Prioritize the website field as it should be the direct event site
        if (event.website && 
            !event.website.includes('callfordataspeakers.com') &&
            event.website.startsWith('http')) {
            return event.website;
        }
        
        // Fall back to the URL field
        if (event.url && 
            !event.url.includes('callfordataspeakers.com') &&
            event.url.startsWith('http')) {
            return event.url;
        }
        
        // Last resort: use the website field even if it's from callfordataspeakers.com
        return event.website || event.url || `https://callfordataspeakers.com/event/${event.id}`;
    };
    
    return {
        id: `cfds-${event.id || index}`,
        name: event.title || event.name || 'Untitled Event',
        mainUrl: formatUrl(getDirectEventUrl(), `https://callfordataspeakers.com/event/${event.id}`),
        applicationUrl: getDirectEventUrl() !== `https://callfordataspeakers.com/event/${event.id}` ? getDirectEventUrl() : undefined,
        contact: event.contact_email ? `Email: ${event.contact_email}` : 
                 event.contact_phone ? `Phone: ${event.contact_phone}` : 
                 event.organization ? `Organization: ${event.organization}` : 
                 event.organizer ? `Organizer: ${event.organizer}` : undefined,
        organizer: event.organization || event.organizer || 'Unknown Organizer',
        verifiedApplyLink: true, 
        description: event.description || undefined,
        date: startDate,
        startDate: startDate,
        endDate: endDate,
        location: (() => {
            const parts = [];
            if (event.venue) parts.push(event.venue);
            if (event.location) parts.push(event.location);
            if (event.city) parts.push(event.city);
            if (event.country) parts.push(event.country);
            
            return parts.length > 0 ? parts.join(', ') : undefined;
        })(),
        venue: event.venue || event.location || undefined,
        images: undefined, 
    };
}

function convertPretalxEvent(event: any, index: number): EventResult {
    const fallbackStartDate = new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000);
    const fallbackEndDate = new Date(fallbackStartDate.getTime() + 2 * 24 * 60 * 60 * 1000);
    
    const startDate = event.dateTime || event.eventStartDate || event.pageDetails?.date || fallbackStartDate.toISOString();
    const endDate = event.eventEndDate || fallbackEndDate.toISOString();
    
    // Try to find direct event website instead of Pretalx link
    const getDirectEventUrl = () => {
        // Check for organizer website first
        if (event.pageDetails?.organizerWebsite && 
            !event.pageDetails.organizerWebsite.includes('pretalx.com') &&
            event.pageDetails.organizerWebsite.startsWith('http')) {
            return event.pageDetails.organizerWebsite;
        }
        
        // Check for custom event URL
        if (event.eventUrl && 
            !event.eventUrl.includes('pretalx.com') &&
            event.eventUrl.startsWith('http')) {
            return event.eventUrl;
        }
        
        // Fall back to Pretalx URL
        return event.eventUrl || `https://pretalx.com/event/${event.slug}`;
    };
    
    return {
        id: `pretalx-${event.slug || index}`,
        name: event.title || event.pageDetails?.title || event.slug || 'Untitled Event',
        mainUrl: formatUrl(getDirectEventUrl(), `https://pretalx.com/event/${event.slug}`),
        applicationUrl: getDirectEventUrl() !== `https://pretalx.com/event/${event.slug}` ? getDirectEventUrl() : undefined,
        contact: event.contactEmail ? `Email: ${event.contactEmail}` : 
                 event.pageDetails?.contactEmail ? `Email: ${event.pageDetails.contactEmail}` : 
                 event.organizer ? `Organizer: ${event.organizer}` : 
                 event.pageDetails?.organizer ? `Organizer: ${event.pageDetails.organizer}` : undefined,
        organizer: event.organizer || event.pageDetails?.organizer || 'Unknown Organizer',
        verifiedApplyLink: true, 
        description: event.description || event.pageDetails?.description || `Pretalx event: ${event.slug}`,
        date: startDate,
        startDate: startDate,
        endDate: endDate,
        location: (() => {
            const parts = [];
            if (event.pageDetails?.location) parts.push(event.pageDetails.location);
            if (event.location) parts.push(event.location);
            if (event.pageDetails?.city) parts.push(event.pageDetails.city);
            if (event.pageDetails?.country) parts.push(event.pageDetails.country);
            
            return parts.length > 0 ? parts.join(', ') : undefined;
        })(),
        venue: event.pageDetails?.location || event.location || undefined,
        images: undefined, 
    };
}

function convertOpenWebNinjaEvent(event: any, index: number): EventResult {
    const fallbackStartDate = new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000);
    const fallbackEndDate = new Date(fallbackStartDate.getTime() + 2 * 24 * 60 * 60 * 1000);
    
    const startDate = event.start_time || event.start_date || event.date || event.event_date || fallbackStartDate.toISOString();
    const endDate = event.end_time || event.end_date || fallbackEndDate.toISOString();
    
    // Try to find direct event website instead of OpenWebNinja link
    const getDirectEventUrl = () => {
        // Check for direct event website first
        if (event.website && 
            !event.website.includes('openwebninja.com') &&
            event.website.startsWith('http')) {
            return event.website;
        }
        
        // Check for event URL
        if (event.event_url && 
            !event.event_url.includes('openwebninja.com') &&
            event.event_url.startsWith('http')) {
            return event.event_url;
        }
        
        // Check for link field
        if (event.link && 
            !event.link.includes('openwebninja.com') &&
            event.link.startsWith('http')) {
            return event.link;
        }
        
        // Fall back to OpenWebNinja URL
        return event.link || event.url || event.event_url || event.website || `https://openwebninja.com/event/${event.event_id || event.id}`;
    };
    
    return {
        id: `own-${event.event_id || event.id || index}`,
        name: event.name || event.title || event.event_name || 'Untitled Event',
        mainUrl: formatUrl(getDirectEventUrl(), `https://openwebninja.com/event/${event.event_id || event.id}`),
        applicationUrl: getDirectEventUrl() !== `https://openwebninja.com/event/${event.event_id || event.id}` ? getDirectEventUrl() : undefined,
        contact: event.contact_email ? `Email: ${event.contact_email}` : 
                 event.organizer_email ? `Email: ${event.organizer_email}` : 
                 event.contact_phone ? `Phone: ${event.contact_phone}` : 
                 event.publisher ? `Publisher: ${event.publisher}` : 
                 event.organizer ? `Organizer: ${event.organizer}` : undefined,
        organizer: event.publisher || event.organizer || event.organizer_name || 'Unknown Organizer',
        verifiedApplyLink: true, 
        description: event.description || event.summary || `OpenWebNinja event: ${event.name || event.title}`,
        date: startDate,
        startDate: startDate,
        endDate: endDate,
        location: (() => {
            const parts = [];
            if (event.venue?.name) parts.push(event.venue.name);
            if (event.venue?.full_address) parts.push(event.venue.full_address);
            else {
                if (event.venue?.address) parts.push(event.venue.address);
                if (event.venue?.city) parts.push(event.venue.city);
                if (event.venue?.state) parts.push(event.venue.state);
                if (event.venue?.country) parts.push(event.venue.country);
            }
            if (event.location) parts.push(event.location);
            
            return parts.length > 0 ? parts.join(', ') : undefined;
        })(),
        venue: event.venue?.name || event.venue || event.location || undefined,
        images: event.thumbnail ? [{
            url: event.thumbnail,
            width: undefined,
            height: undefined,
            ratio: undefined,
            fallback: false
        }] : undefined,
    };
}


export async function eventbriteSearch(input: SearchInput): Promise<{ top20: EventResult[]; more100: EventResult[] }> {
    try {
        console.log('🔍 Starting Eventbrite search with input:', input);
        
        const response = await eventbriteApi.searchEvents({
            industry: input.industry, 
            topic: input.topic, 
            num: 120, 
            country: 'US'
        });
        console.log('📡 Eventbrite API response:', response);
        
        if (!response.success) {
            console.log('🔄 Eventbrite search failed, returning empty results...');
            return { top20: [], more100: [] };
        }
        
        const events = response.data.events || [];
        console.log(`📊 Found ${events.length} events from Eventbrite`);
        
        if (events.length === 0) {
            console.log('📊 No events found from Eventbrite, returning empty results');
            return { top20: [], more100: [] };
        }
        
        const convertedEvents = events.map((event: any, index: number) => 
            convertEventbriteEvent(event, index)
        );
        const top20 = convertedEvents.slice(0, 20);
        const more100 = convertedEvents.slice(20, 120);
        console.log(`✅ Returning ${top20.length} top20 events and ${more100.length} more100 events`);
        return { top20, more100 };
    } catch (error) {
        console.error('❌ Eventbrite search error:', error);
        console.log('🔄 Returning empty results due to error...');
        return { top20: [], more100: [] };
    }
}

export async function callForDataSpeakersSearch(input: SearchInput): Promise<{ top20: EventResult[]; more100: EventResult[] }> {
    try {
        console.log('🔍 Starting Call for Data Speakers search with input:', input);
        
        const response = await callForDataSpeakersApi.searchEvents({
            q: `${input.topic} ${input.industry}`, 
            industry: input.industry, 
            topic: input.topic, 
            limit: 120
        });
        console.log('📡 Call for Data Speakers API response:', response);
        
        if (!response.success) {
            console.log('🔄 Call for Data Speakers search failed, returning empty results...');
            return { top20: [], more100: [] };
        }
        
        const events = response.data.events || [];
        console.log(`📊 Found ${events.length} events from Call for Data Speakers`);
        
        if (events.length === 0) {
            console.log('📊 No events found from Call for Data Speakers, returning empty results');
            return { top20: [], more100: [] };
        }
        
        const convertedEvents = events.map((event: any, index: number) => 
            convertCallForDataSpeakersEvent(event, index)
        );
        const top20 = convertedEvents.slice(0, 20);
        const more100 = convertedEvents.slice(20, 120);
        console.log(`✅ Returning ${top20.length} top20 events and ${more100.length} more100 events`);
        return { top20, more100 };
    } catch (error) {
        console.error('❌ Call for Data Speakers search error:', error);
        console.log('🔄 Returning empty results due to error...');
        return { top20: [], more100: [] };
    }
}

export async function pretalxSearch(input: SearchInput): Promise<{ top20: EventResult[]; more100: EventResult[] }> {
    try {
        console.log('🔍 Starting Pretalx search with input:', input);
        
        const response = await pretalxApi.searchEvents({
            maxEvents: 50, 
            saveToDatabase: false, 
            headless: true,
            delay: 500, 
            includePageDetails: false, 
            topic: input.topic,
            industry: input.industry
        });
        console.log('📡 Pretalx API response:', response);
        
        if (!response.success) {
            console.log('🔄 Pretalx search failed, returning empty results...');
            return { top20: [], more100: [] };
        }
        
        const allEvents = response.data.allEvents || [];
        console.log(`📊 Found ${allEvents.length} filtered events from Pretalx (already filtered by backend)`);
        
        if (allEvents.length === 0) {
            console.log('📊 No events found from Pretalx, returning empty results');
            return { top20: [], more100: [] };
        }
        
        const convertedEvents = allEvents.map((event: any, index: number) => 
            convertPretalxEvent(event, index)
        );
        const top20 = convertedEvents.slice(0, 20);
        const more100 = convertedEvents.slice(20, 50);
        console.log(`✅ Returning ${top20.length} top20 events and ${more100.length} more100 events`);
        return { top20, more100 };
    } catch (error) {
        console.error('❌ Pretalx search error:', error);
        console.log('🔄 Returning empty results due to error...');
        return { top20: [], more100: [] };
    }
}

async function serpApiSearch(input: SearchInput): Promise<{ top20: EventResult[]; more100: EventResult[] }> {
    try {
        console.log('🔍 Starting SerpAPI search with input:', input);
        
        const optimizedTopic = await aiSuggestionService.optimizeTopicForSerpApi(input.topic, input.industry);
        console.log(`🤖 AI optimized topic: "${input.topic}" → "${optimizedTopic}"`);
        
        const response = await serpApi.searchEvents({
            industry: input.industry,
            topic: optimizedTopic
        });
        
        console.log('📡 SerpAPI response received:', {
            success: response?.success,
            message: response?.message,
            hasData: !!response?.data,
            eventsCount: response?.data?.events?.length || 0
        });
        
        if (!response) {
            console.log('❌ SerpAPI returned null/undefined response');
            return { top20: [], more100: [] };
        }
        
        if (!response.success) {
            console.log('❌ SerpAPI returned unsuccessful response:', response.message);
            return { top20: [], more100: [] };
        }
        
        if (!response.data || !response.data.events) {
            console.log('❌ SerpAPI returned invalid data structure');
            console.log('Response structure:', response);
            return { top20: [], more100: [] };
        }
        
        const events = response.data.events;
        console.log(`📊 SerpAPI returned ${events.length} events with optimized topic`);
        
        
        if (!Array.isArray(events)) {
            console.log('❌ SerpAPI events is not an array:', typeof events);
            return { top20: [], more100: [] };
        }
        
        
        const convertedEvents = events.map((event: any, index: number) => convertSerpApiEvent(event, index));
        
        
        
        
        const top20 = convertedEvents.slice(0, 20); 
        const more100 = convertedEvents.slice(20); 
        
        console.log(`✅ SerpAPI search completed: ${top20.length} top20 + ${more100.length} more100 events`);
        console.log(`🔍 SerpAPI top20 sample:`, top20.slice(0, 3).map(e => ({ id: e.id, name: e.name, hasImage: !!e.images?.[0]?.url })));
        console.log(`🔍 SerpAPI more100 sample:`, more100.slice(0, 3).map(e => ({ id: e.id, name: e.name, hasImage: !!e.images?.[0]?.url })));
        console.log(`🖼️ Events with images: ${convertedEvents.filter(e => e.images?.[0]?.url).length}/${convertedEvents.length}`);
        return { top20, more100 };
        
    } catch (error) {
        console.error('❌ SerpAPI search failed:', error);
        return { top20: [], more100: [] };
    }
}

export async function openWebNinjaSearch(input: SearchInput): Promise<{ top20: EventResult[]; more100: EventResult[] }> {
    try {
        console.log('🔍 Starting OpenWebNinja search with input:', input);
        
        const result = await searchApi.ninjaSearch(input.topic, input.industry);
        console.log('📡 OpenWebNinja API response:', result);
        
        if (!result || !result.top20 || !result.more100) {
            console.log('❌ OpenWebNinja returned invalid result structure');
            return { top20: [], more100: [] };
        }
        
        console.log(`✅ OpenWebNinja search completed: ${result.top20.length} top20, ${result.more100.length} more100`);
        return result;
    } catch (error) {
        console.error('❌ OpenWebNinja search error:', error);
        console.log('🔄 Returning empty results due to error...');
        return { top20: [], more100: [] };
    }
}


export async function ticketmasterSearch(input: SearchInput): Promise<{ top20: EventResult[]; more100: EventResult[] }> {
    try {
        console.log('🔍 Starting Ticketmaster search with input:', input);
        
        const ticketmasterParams = convertToTicketmasterParams(input.industry, input.topic);
        console.log('🎯 Converted to Ticketmaster params:', ticketmasterParams);
        
        const searchStrategies = generateSearchStrategies(input.industry, input.topic);
        console.log('📋 Generated search strategies:', searchStrategies);
        
        console.log('⏳ Adding 5-second delay for loading animation...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        
        const response = await ticketmasterApi.searchEvents({
            industry: input.industry, 
            topic: input.topic, 
            num: 120, 
            country: 'US'
        });
        console.log('📡 Ticketmaster API response:', response);
        
        if (!response.success) {
            console.log('🔄 Primary Ticketmaster search failed, trying alternative strategies...');
            
            for (const strategy of searchStrategies.slice(1)) {
                console.log(`🔄 Trying alternative strategy: ${strategy.keyword}`);
                const altResponse = await ticketmasterApi.searchEvents({
                    q: strategy.keyword, 
                    num: 120,
                    country: 'US'
                });
                
                if (altResponse.success) {
                    console.log('✅ Alternative strategy succeeded!');
                    const events = altResponse.data.events || [];
                    console.log(`📊 Found ${events.length} events from Ticketmaster`);
                    
                    const convertedEvents = events.map((event: any, index: number) => 
                        convertTicketmasterEvent(event, index)
                    );
                    const top20 = convertedEvents.slice(0, 20);
                    const more100 = convertedEvents.slice(20, 120);
                    console.log(`✅ Returning ${top20.length} top20 events and ${more100.length} more100 events`);
                    return { top20, more100 };
                } else {
                    console.log(`❌ Strategy failed: ${altResponse.message}`);
                }
            }
            
            console.log('🔄 All Ticketmaster strategies failed, returning empty results...');
            return { top20: [], more100: [] };
        }
        
        const events = response.data.events || [];
        console.log(`📊 Found ${events.length} events from Ticketmaster`);
        
        const convertedEvents = events.map((event: any, index: number) => 
            convertTicketmasterEvent(event, index)
        );
        const top20 = convertedEvents.slice(0, 20);
        const more100 = convertedEvents.slice(20, 120);
        console.log(`✅ Returning ${top20.length} top20 events and ${more100.length} more100 events`);
        return { top20, more100 };
    } catch (error) {
        console.error('❌ Ticketmaster search error:', error);
        console.log('🔄 Returning empty results due to error...');
        return { top20: [], more100: [] };
    }
}


export async function mockSearch(input: SearchInput): Promise<{ top20: EventResult[]; more100: EventResult[] }> {
    const seed = `${input.topic}-${input.industry}`.length
    const make = (i: number, verified: boolean): EventResult => {
        const startDate = new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000);
        const endDate = new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000); 
        
        return {
            id: `${verified ? 'v' : 'u'}-${i}`,
            name: `${input.topic} ${verified ? 'Summit' : 'Conference'} ${i + 1}`,
            mainUrl: `https://example${i}.org`,
            applicationUrl: verified ? `https://example${i}.org/apply` : undefined,
            contact: `mailto:contact${i}@example.org`,
            organizer: `Org ${((seed + i) % 50) + 1}`,
            verifiedApplyLink: verified,
            description: `Join us for an exciting ${input.topic} ${verified ? 'Summit' : 'Conference'} featuring industry leaders, networking opportunities, and cutting-edge insights. This event brings together professionals from ${input.industry} to share knowledge and build connections.`,
            date: startDate.toISOString(),
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            location: `City ${((seed + i) % 20) + 1}`,
            venue: `Convention Center ${((seed + i) % 10) + 1}`,
        };
    }

    const top20 = Array.from({ length: 20 }, (_, i) => make(i, true))
    const more100 = Array.from({ length: 100 }, (_, i) => make(i + 20, false))
    await new Promise((r) => setTimeout(r, 400))
    return { top20, more100 }
}

function isEventExpired(event: EventResult): boolean {
    if (!event.startDate && !event.date) {
        return false; 
    }
    
    const eventDate = new Date(event.startDate || event.date || '');
    const now = new Date();
    
    const oneDayInMs = 24 * 60 * 60 * 1000;
    return eventDate.getTime() < (now.getTime() - oneDayInMs);
}

function deduplicateEvents(events: EventResult[]): EventResult[] {
    const seen = new Set<string>();
    return events.filter(event => {
        const key = `${event.name.toLowerCase().trim()}-${event.startDate || event.date || ''}`;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

function filterExpiredEvents(events: EventResult[]): EventResult[] {
    return events.filter(event => !isEventExpired(event));
}

export async function combinedSearch(input: SearchInput): Promise<{ top20: EventResult[]; more100: EventResult[] }> {
    try {
        console.log('🚀 Starting combined search (Ticketmaster + Eventbrite + Call for Data Speakers + Pretalx + SerpAPI + OpenWebNinja) with input:', input);
        
        const [ticketmasterResult, eventbriteResult, callForDataSpeakersResult, pretalxResult, serpApiResult, openWebNinjaResult] = await Promise.allSettled([
            ticketmasterSearch(input),
            eventbriteSearch(input),
            callForDataSpeakersSearch(input),
            pretalxSearch(input),
            serpApiSearch(input),
            openWebNinjaSearch(input)
        ]);
        
        let combinedTop20: EventResult[] = [];
        let combinedMore100: EventResult[] = [];
        
        
        if (ticketmasterResult.status === 'fulfilled') {
            const tmResult = ticketmasterResult.value;
            combinedTop20 = [...combinedTop20, ...tmResult.top20];
            combinedMore100 = [...combinedMore100, ...tmResult.more100];
            console.log(`✅ Added ${tmResult.top20.length} Ticketmaster top20 and ${tmResult.more100.length} more100 events`);
        } else {
            console.error('❌ Ticketmaster search failed:', ticketmasterResult.reason);
        }
        
        
        if (eventbriteResult.status === 'fulfilled') {
            const ebResult = eventbriteResult.value;
            combinedTop20 = [...combinedTop20, ...ebResult.top20];
            combinedMore100 = [...combinedMore100, ...ebResult.more100];
            console.log(`✅ Added ${ebResult.top20.length} Eventbrite top20 and ${ebResult.more100.length} more100 events`);
        } else {
            console.error('❌ Eventbrite search failed:', eventbriteResult.reason);
        }
        
        
        if (callForDataSpeakersResult.status === 'fulfilled') {
            const cfdsResult = callForDataSpeakersResult.value;
            combinedTop20 = [...combinedTop20, ...cfdsResult.top20];
            combinedMore100 = [...combinedMore100, ...cfdsResult.more100];
            console.log(`✅ Added ${cfdsResult.top20.length} Call for Data Speakers top20 and ${cfdsResult.more100.length} more100 events`);
        } else {
            console.error('❌ Call for Data Speakers search failed:', callForDataSpeakersResult.reason);
        }
        
        
        if (pretalxResult.status === 'fulfilled') {
            const pretalxSearchResult = pretalxResult.value;
            combinedTop20 = [...combinedTop20, ...pretalxSearchResult.top20];
            combinedMore100 = [...combinedMore100, ...pretalxSearchResult.more100];
            console.log(`✅ Added ${pretalxSearchResult.top20.length} Pretalx top20 and ${pretalxSearchResult.more100.length} more100 events`);
        } else {
            console.error('❌ Pretalx search failed:', pretalxResult.reason);
        }
        
        
        if (serpApiResult.status === 'fulfilled') {
            const serpSearchResult = serpApiResult.value;
            combinedTop20 = [...combinedTop20, ...serpSearchResult.top20];
            combinedMore100 = [...combinedMore100, ...serpSearchResult.more100];
            console.log(`✅ Added ${serpSearchResult.top20.length} SerpAPI top20 events (immediately visible) and ${serpSearchResult.more100.length} SerpAPI more100 events (21st onwards)`);
        } else {
            console.error('❌ SerpAPI search failed:', serpApiResult.reason);
        }
        
        
        if (openWebNinjaResult.status === 'fulfilled') {
            const ownResult = openWebNinjaResult.value;
            combinedTop20 = [...combinedTop20, ...ownResult.top20];
            combinedMore100 = [...combinedMore100, ...ownResult.more100];
            console.log(`✅ Added ${ownResult.top20.length} OpenWebNinja top20 and ${ownResult.more100.length} more100 events`);
        } else {
            console.error('❌ OpenWebNinja search failed:', openWebNinjaResult.reason);
        }
        
        
        const hasTicketmasterResults = ticketmasterResult.status === 'fulfilled' && 
            (ticketmasterResult.value.top20.length > 0 || ticketmasterResult.value.more100.length > 0);
        const hasEventbriteResults = eventbriteResult.status === 'fulfilled' && 
            (eventbriteResult.value.top20.length > 0 || eventbriteResult.value.more100.length > 0);
        const hasCallForDataSpeakersResults = callForDataSpeakersResult.status === 'fulfilled' && 
            (callForDataSpeakersResult.value.top20.length > 0 || callForDataSpeakersResult.value.more100.length > 0);
        const hasPretalxResults = pretalxResult.status === 'fulfilled' && 
            (pretalxResult.value.top20.length > 0 || pretalxResult.value.more100.length > 0);
        const hasOpenWebNinjaResults = openWebNinjaResult.status === 'fulfilled' && 
            (openWebNinjaResult.value.top20.length > 0 || openWebNinjaResult.value.more100.length > 0);
            
        if (!hasTicketmasterResults && !hasEventbriteResults && !hasCallForDataSpeakersResults && !hasPretalxResults && !hasOpenWebNinjaResults) {
            console.log('🔄 No results from any API, falling back to mock search...');
            return mockSearch(input);
        }
        
        
        console.log('🔍 Filtering expired events and deduplicating...');
        const filteredTop20 = filterExpiredEvents(combinedTop20);
        const filteredMore100 = filterExpiredEvents(combinedMore100);
        
        const deduplicatedTop20 = deduplicateEvents(filteredTop20);
        const deduplicatedMore100 = deduplicateEvents(filteredMore100);
        
        console.log(`📊 After filtering: ${deduplicatedTop20.length} top20 (was ${combinedTop20.length}), ${deduplicatedMore100.length} more100 (was ${combinedMore100.length})`);
        
        
        // Custom ranking function based on user priorities
        const rankEvent = (event: EventResult): number => {
            let priority = 0;
            
            // Check event date
            const eventDate = new Date(event.startDate || event.date || '');
            const now = new Date();
            const monthsUntilEvent = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);
            
            // Priority 1: Call for speakers or sponsorship events (highest priority)
            const eventText = `${event.name} ${event.description || ''}`.toLowerCase();
            const isCallForSpeakers = eventText.includes('call for speakers') || 
                                    eventText.includes('call for papers') ||
                                    eventText.includes('cfp') ||
                                    eventText.includes('speaker submission') ||
                                    eventText.includes('speaker application') ||
                                    eventText.includes('speaking opportunity') ||
                                    event.verifiedApplyLink;
                                    
            const isSponsorship = eventText.includes('sponsorship') ||
                                eventText.includes('sponsor') ||
                                eventText.includes('sponsor opportunity') ||
                                eventText.includes('sponsor application');
            
            if (isCallForSpeakers || isSponsorship) {
                priority += 1000;
            } else {
                // Still show events without explicit call for speakers, but with lower priority
                priority += 100;
            }
            
            // Priority 2: Events 3+ months in advance get highest priority
            if (monthsUntilEvent >= 3) {
                priority += 500;
            } else if (monthsUntilEvent >= 1) {
                priority += 200;
            } else if (monthsUntilEvent >= 0) {
                priority += 50;
            } else {
                // Past events get very low priority
                priority -= 100;
            }
            
            // Priority 3: Events with direct website links (not aggregators)
            if (event.mainUrl && 
                !event.mainUrl.includes('eventbrite.com') &&
                !event.mainUrl.includes('ticketmaster.com') &&
                !event.mainUrl.includes('pretalx.com') &&
                !event.mainUrl.includes('callfordataspeakers.com') &&
                !event.mainUrl.includes('openwebninja.com') &&
                event.mainUrl.startsWith('http') &&
                event.mainUrl !== '#') {
                priority += 300;
            } else {
                // Aggregator links get lower priority but still shown
                priority += 50;
            }
            
            // Priority 4: Events with contact information
            if (event.contact && 
                event.contact !== 'Contact TBD' && 
                event.contact !== 'Contact: See event details' &&
                event.contact.includes('@')) {
                priority += 200;
            }
            
            // Priority 5: Further in the future gets higher priority
            if (monthsUntilEvent >= 6) {
                priority += 100;
            } else if (monthsUntilEvent >= 4) {
                priority += 50;
            }
            
            return priority;
        };
        
        // Filter out only past events (keep all future events)
        const futureFilteredTop20 = deduplicatedTop20.filter(event => {
            const eventDate = new Date(event.startDate || event.date || '');
            const now = new Date();
            const oneDayInMs = 24 * 60 * 60 * 1000;
            return eventDate.getTime() >= (now.getTime() - oneDayInMs); // Keep events from yesterday onwards
        });
        
        const futureFilteredMore100 = deduplicatedMore100.filter(event => {
            const eventDate = new Date(event.startDate || event.date || '');
            const now = new Date();
            const oneDayInMs = 24 * 60 * 60 * 1000;
            return eventDate.getTime() >= (now.getTime() - oneDayInMs); // Keep events from yesterday onwards
        });
        
        console.log(`🎯 After future filtering: ${futureFilteredTop20.length} top20 (was ${deduplicatedTop20.length}), ${futureFilteredMore100.length} more100 (was ${deduplicatedMore100.length})`);
        
        const sortedTop20 = futureFilteredTop20
            .sort((a, b) => {
                const priorityA = rankEvent(a);
                const priorityB = rankEvent(b);
                
                // First sort by priority (highest first)
                if (priorityA !== priorityB) {
                    return priorityB - priorityA;
                }
                
                // Then by date (furthest in future first for same priority)
                const dateA = new Date(a.startDate || a.date || '');
                const dateB = new Date(b.startDate || b.date || '');
                return dateB.getTime() - dateA.getTime();
            })
            .slice(0, 20);
            
        const sortedMore100 = futureFilteredMore100
            .sort((a, b) => {
                const priorityA = rankEvent(a);
                const priorityB = rankEvent(b);
                
                // First sort by priority (highest first)
                if (priorityA !== priorityB) {
                    return priorityB - priorityA;
                }
                
                // Then by date (furthest in future first for same priority)
                const dateA = new Date(a.startDate || a.date || '');
                const dateB = new Date(b.startDate || b.date || '');
                return dateB.getTime() - dateA.getTime();
            })
            .slice(0, 100);
        
        console.log(`🎯 Final combined results: ${sortedTop20.length} top20, ${sortedMore100.length} more100`);
        console.log('✅ All expired events filtered out and duplicates removed');
        
        return {
            top20: sortedTop20,
            more100: sortedMore100
        };
        
    } catch (error) {
        console.error('❌ Combined search error:', error);
        console.log('🔄 Falling back to mock search...');
        return mockSearch(input);
    }
}