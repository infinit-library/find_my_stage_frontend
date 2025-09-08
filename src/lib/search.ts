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

