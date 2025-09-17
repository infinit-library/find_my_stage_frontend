import { ticketmasterApi, eventbriteApi } from './api';
import { convertToTicketmasterParams, generateSearchStrategies } from './ticketmaster-mapping';

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
}

function convertTicketmasterEvent(event: any, index: number): EventResult {
    
    const fallbackStartDate = new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000);
    const fallbackEndDate = new Date(fallbackStartDate.getTime() + 2 * 24 * 60 * 60 * 1000);
    
    const startDate = event.dates?.start?.dateTime || event.dates?.start?.localDate || fallbackStartDate.toISOString();
    const endDate = event.dates?.end?.dateTime || event.dates?.end?.localDate || fallbackEndDate.toISOString();
    
    return {
        id: `tm-${event.id || index}`,
        name: event.name || 'Untitled Event',
        mainUrl: event.url || '#',
        applicationUrl: event.url || undefined, 
        contact: event.venue?.name ? `Venue: ${event.venue.name}` : undefined,
        organizer: event.organizer || event._embedded?.attractions?.[0]?.name || 'Unknown Organizer',
        verifiedApplyLink: false, 
        description: event.description || event.info || undefined,
        date: startDate,
        startDate: startDate,
        endDate: endDate,
        location: event._embedded?.venues?.[0]?.city?.name || event._embedded?.venues?.[0]?.name || undefined,
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
    
    return {
        id: `eb-${event.sourceId || event.id || index}`,
        name: event.title || event.name || 'Untitled Event',
        mainUrl: event.eventUrl || event.url || '#',
        applicationUrl: event.eventUrl || event.url || undefined,
        contact: event.organizer?.name ? `Organizer: ${event.organizer.name}` : undefined,
        organizer: event.organizer?.name || 'Unknown Organizer',
        verifiedApplyLink: false,
        description: event.description || undefined,
        date: startDate,
        startDate: startDate,
        endDate: endDate,
        location: event.location || event.venue || undefined,
        venue: event.venue || undefined,
        images: event.imageUrl ? [{
            url: event.imageUrl,
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

export async function combinedSearch(input: SearchInput): Promise<{ top20: EventResult[]; more100: EventResult[] }> {
    try {
        console.log('🚀 Starting combined search (Ticketmaster + Eventbrite) with input:', input);
        
        // Make simultaneous requests to both APIs
        const [ticketmasterResult, eventbriteResult] = await Promise.allSettled([
            ticketmasterSearch(input),
            eventbriteSearch(input)
        ]);
        
        console.log('📊 Ticketmaster result:', ticketmasterResult.status);
        console.log('📊 Eventbrite result:', eventbriteResult.status);
        
        let combinedTop20: EventResult[] = [];
        let combinedMore100: EventResult[] = [];
        
        // Process Ticketmaster results
        if (ticketmasterResult.status === 'fulfilled') {
            const tmResult = ticketmasterResult.value;
            combinedTop20 = [...combinedTop20, ...tmResult.top20];
            combinedMore100 = [...combinedMore100, ...tmResult.more100];
            console.log(`✅ Added ${tmResult.top20.length} Ticketmaster top20 and ${tmResult.more100.length} more100 events`);
        } else {
            console.error('❌ Ticketmaster search failed:', ticketmasterResult.reason);
        }
        
        // Process Eventbrite results
        if (eventbriteResult.status === 'fulfilled') {
            const ebResult = eventbriteResult.value;
            combinedTop20 = [...combinedTop20, ...ebResult.top20];
            combinedMore100 = [...combinedMore100, ...ebResult.more100];
            console.log(`✅ Added ${ebResult.top20.length} Eventbrite top20 and ${ebResult.more100.length} more100 events`);
        } else {
            console.error('❌ Eventbrite search failed:', eventbriteResult.reason);
        }
        
        // If both APIs failed or returned no results, fall back to mock search
        const hasTicketmasterResults = ticketmasterResult.status === 'fulfilled' && 
            (ticketmasterResult.value.top20.length > 0 || ticketmasterResult.value.more100.length > 0);
        const hasEventbriteResults = eventbriteResult.status === 'fulfilled' && 
            (eventbriteResult.value.top20.length > 0 || eventbriteResult.value.more100.length > 0);
            
        if (!hasTicketmasterResults && !hasEventbriteResults) {
            console.log('🔄 No results from either API, falling back to mock search...');
            return mockSearch(input);
        }
        
        // Shuffle and limit results to maintain variety
        const shuffledTop20 = combinedTop20.sort(() => Math.random() - 0.5).slice(0, 20);
        const shuffledMore100 = combinedMore100.sort(() => Math.random() - 0.5).slice(0, 100);
        
        console.log(`🎯 Final combined results: ${shuffledTop20.length} top20, ${shuffledMore100.length} more100`);
        
        return {
            top20: shuffledTop20,
            more100: shuffledMore100
        };
        
    } catch (error) {
        console.error('❌ Combined search error:', error);
        console.log('🔄 Falling back to mock search...');
        return mockSearch(input);
    }
}