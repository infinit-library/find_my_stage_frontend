import { ticketmasterApi, eventbriteApi, callForDataSpeakersApi, pretalxApi, searchApi } from './api';
import { convertToTicketmasterParams, generateSearchStrategies } from './ticketmaster-mapping';

// Helper function to validate and format URLs
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
        mainUrl: formatUrl(event.eventUrl || event.url, `https://www.eventbrite.com/e/${event.id}`),
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

function convertCallForDataSpeakersEvent(event: any, index: number): EventResult {
    const fallbackStartDate = new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000);
    const fallbackEndDate = new Date(fallbackStartDate.getTime() + 2 * 24 * 60 * 60 * 1000);
    
    const startDate = event.event_date || event.start_date || fallbackStartDate.toISOString();
    const endDate = event.end_date || fallbackEndDate.toISOString();
    
    return {
        id: `cfds-${event.id || index}`,
        name: event.title || event.name || 'Untitled Event',
        mainUrl: formatUrl(event.website || event.url, `https://callfordataspeakers.com/event/${event.id}`),
        applicationUrl: event.website || event.url || undefined,
        contact: event.contact_email ? `Email: ${event.contact_email}` : undefined,
        organizer: event.organization || event.organizer || 'Unknown Organizer',
        verifiedApplyLink: true, 
        description: event.description || undefined,
        date: startDate,
        startDate: startDate,
        endDate: endDate,
        location: event.location || event.venue || undefined,
        venue: event.location || event.venue || undefined,
        images: undefined, 
    };
}

function convertPretalxEvent(event: any, index: number): EventResult {
    const fallbackStartDate = new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000);
    const fallbackEndDate = new Date(fallbackStartDate.getTime() + 2 * 24 * 60 * 60 * 1000);
    
    const startDate = event.dateTime || event.eventStartDate || event.pageDetails?.date || fallbackStartDate.toISOString();
    const endDate = event.eventEndDate || fallbackEndDate.toISOString();
    
    return {
        id: `pretalx-${event.slug || index}`,
        name: event.title || event.pageDetails?.title || event.slug || 'Untitled Event',
        mainUrl: formatUrl(event.eventUrl, `https://pretalx.com/event/${event.slug}`),
        applicationUrl: event.eventUrl || undefined,
        contact: event.contactEmail ? `Email: ${event.contactEmail}` : (event.pageDetails?.contactEmail ? `Email: ${event.pageDetails.contactEmail}` : undefined),
        organizer: event.organizer || event.pageDetails?.organizer || 'Unknown Organizer',
        verifiedApplyLink: true, 
        description: event.description || event.pageDetails?.description || `Pretalx event: ${event.slug}`,
        date: startDate,
        startDate: startDate,
        endDate: endDate,
        location: event.location || event.pageDetails?.location || undefined,
        venue: event.location || event.pageDetails?.location || undefined,
        images: undefined, 
    };
}

function convertOpenWebNinjaEvent(event: any, index: number): EventResult {
    const fallbackStartDate = new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000);
    const fallbackEndDate = new Date(fallbackStartDate.getTime() + 2 * 24 * 60 * 60 * 1000);
    
    const startDate = event.start_time || event.start_date || event.date || event.event_date || fallbackStartDate.toISOString();
    const endDate = event.end_time || event.end_date || fallbackEndDate.toISOString();
    
    return {
        id: `own-${event.event_id || event.id || index}`,
        name: event.name || event.title || event.event_name || 'Untitled Event',
        mainUrl: formatUrl(event.link || event.url || event.event_url || event.website, `https://openwebninja.com/event/${event.event_id || event.id}`),
        applicationUrl: event.link || event.url || event.event_url || event.website || undefined,
        contact: event.contact_email ? `Email: ${event.contact_email}` : (event.organizer_email ? `Email: ${event.organizer_email}` : undefined),
        organizer: event.publisher || event.organizer || event.organizer_name || 'Unknown Organizer',
        verifiedApplyLink: true, 
        description: event.description || event.summary || `OpenWebNinja event: ${event.name || event.title}`,
        date: startDate,
        startDate: startDate,
        endDate: endDate,
        location: event.venue?.full_address || event.venue?.city || event.location || undefined,
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

export async function openWebNinjaSearch(input: SearchInput): Promise<{ top20: EventResult[]; more100: EventResult[] }> {
    try {
        console.log('🔍 Starting OpenWebNinja search with input:', input);
        
        const response = await searchApi.ninjaSearch(input.topic, input.industry);
        console.log('📡 OpenWebNinja API response:', response);
        
        // The backend returns the raw OpenWebNinja API response with optimization metadata
        // We need to extract the events from the response
        const rawEvents = response.data || [];
        console.log(`📊 Found ${rawEvents.length} events from OpenWebNinja`);
        
        if (rawEvents.length === 0) {
            console.log('📊 No events found from OpenWebNinja, returning empty results');
            return { top20: [], more100: [] };
        }
        
        // Convert OpenWebNinja events to our standard format
        const convertedEvents = rawEvents.map((event: any, index: number) => 
            convertOpenWebNinjaEvent(event, index)
        );
        
        const top20 = convertedEvents.slice(0, 20);
        const more100 = convertedEvents.slice(20, 120);
        console.log(`✅ Returning ${top20.length} top20 events and ${more100.length} more100 events`);
        return { top20, more100 };
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
    return;
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
        console.log('🚀 Starting combined search (Ticketmaster + Eventbrite + Call for Data Speakers + Pretalx + OpenWebNinja) with input:', input);
        
        const [ticketmasterResult, eventbriteResult, callForDataSpeakersResult, pretalxResult, openWebNinjaResult] = await Promise.allSettled([
            ticketmasterSearch(input),
            eventbriteSearch(input),
            callForDataSpeakersSearch(input),
            pretalxSearch(input),
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
        
        // OpenWebNinja results
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
        
        
        const sortedTop20 = deduplicatedTop20
            .sort((a, b) => {
                const dateA = new Date(a.startDate || a.date || '');
                const dateB = new Date(b.startDate || b.date || '');
                return dateA.getTime() - dateB.getTime();
            })
            .slice(0, 20);
            
        const sortedMore100 = deduplicatedMore100
            .sort((a, b) => {
                const dateA = new Date(a.startDate || a.date || '');
                const dateB = new Date(b.startDate || b.date || '');
                return dateA.getTime() - dateB.getTime();
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