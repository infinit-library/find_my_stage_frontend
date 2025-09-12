import { ticketmasterApi } from './api';

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
}

// Convert Ticketmaster event to EventResult format
function convertTicketmasterEvent(event: any, index: number): EventResult {
    return {
        id: `tm-${event.id || index}`,
        name: event.name || 'Untitled Event',
        mainUrl: event.url || '#',
        applicationUrl: event.url || undefined, // Ticketmaster events don't have separate application URLs
        contact: event.venue?.name ? `Venue: ${event.venue.name}` : undefined,
        organizer: event.organizer || event._embedded?.attractions?.[0]?.name || 'Unknown Organizer',
        verifiedApplyLink: false, // Ticketmaster events are not verified application links
    };
}

// Search using Ticketmaster API
export async function ticketmasterSearch(input: SearchInput): Promise<{ top20: EventResult[]; more100: EventResult[] }> {
    try {
        console.log('🔍 Starting Ticketmaster search with input:', input);
        
        // Add 5-second delay for loading animation
        console.log('⏳ Adding 5-second delay for loading animation...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Search for events using the industry field as the keyword
        const response = await ticketmasterApi.searchEvents({
            q: input.industry, // Use industry as the search keyword
            num: 120, // Get 120 events to have enough for both top20 and more100
            country: 'US'
        });

        console.log('📡 Ticketmaster API response:', response);

        if (!response.success) {
            console.error('❌ Ticketmaster API error:', response.message);
            console.log('🔄 Falling back to mock search...');
            // Fallback to mock search if API fails
            return mockSearch(input);
        }

        const events = response.data.events || [];
        console.log(`📊 Found ${events.length} events from Ticketmaster`);
        
        // Convert Ticketmaster events to our format
        const convertedEvents = events.map((event: any, index: number) => 
            convertTicketmasterEvent(event, index)
        );

        // Split into top20 and more100
        const top20 = convertedEvents.slice(0, 20);
        const more100 = convertedEvents.slice(20, 120);

        console.log(`✅ Returning ${top20.length} top20 events and ${more100.length} more100 events`);
        return { top20, more100 };
    } catch (error) {
        console.error('❌ Ticketmaster search error:', error);
        console.log('🔄 Falling back to mock search...');
        // Fallback to mock search if there's an error
        return mockSearch(input);
    }
}

// Mocked search for MVP demo. Replace with API-backed implementation later.
export async function mockSearch(input: SearchInput): Promise<{ top20: EventResult[]; more100: EventResult[] }> {
    const seed = `${input.topic}-${input.industry}`.length
    const make = (i: number, verified: boolean): EventResult => ({
        id: `${verified ? 'v' : 'u'}-${i}`,
        name: `${input.topic} ${verified ? 'Summit' : 'Conference'} ${i + 1}`,
        mainUrl: `https://example${i}.org`,
        applicationUrl: verified ? `https://example${i}.org/apply` : undefined,
        contact: `mailto:contact${i}@example.org`,
        organizer: `Org ${((seed + i) % 50) + 1}`,
        verifiedApplyLink: verified,
    })

    const top20 = Array.from({ length: 20 }, (_, i) => make(i, true))
    const more100 = Array.from({ length: 100 }, (_, i) => make(i + 20, false))

    // Small delay to simulate network
    await new Promise((r) => setTimeout(r, 400))
    return { top20, more100 }
}

