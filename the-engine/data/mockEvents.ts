import { ImageSourcePropType } from 'react-native';

// Hyrox-specific event interface
export interface HyroxEvent {
    id: string;
    name: string;
    city: string;
    country: string;
    venue: string;
    date: string;           // ISO date string
    registrationDeadline: string;
    categories: HyroxCategory[];
    priceRange: { min: number; max: number };
    spotsTotal: number;
    spotsRemaining: number;
    status: 'upcoming' | 'filling_fast' | 'sold_out' | 'registered' | 'completed';
    userRegistration?: {
        category: HyroxCategory;
        partner?: string;
        waveTime: string;
        confirmationCode: string;
    };
    description: string;
    color: string;
    emoji: string;
    highlights: string[];
}

export type HyroxCategory = 'Pro Men' | 'Pro Women' | 'Open Men' | 'Open Women' | 'Doubles Men' | 'Doubles Women' | 'Doubles Mixed' | 'Relay';

// Wave times for registration
export const WAVE_TIMES = [
    '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
];

// Category pricing
export const CATEGORY_PRICES: Record<HyroxCategory, number> = {
    'Pro Men': 149,
    'Pro Women': 149,
    'Open Men': 129,
    'Open Women': 129,
    'Doubles Men': 99,
    'Doubles Women': 99,
    'Doubles Mixed': 99,
    'Relay': 79,
};

// Hyrox 2025/2026 Season Events
export const HYROX_EVENTS: HyroxEvent[] = [
    {
        id: 'hx1',
        name: 'HYROX Miami',
        city: 'Miami',
        country: 'USA',
        venue: 'Miami Beach Convention Center',
        date: '2026-02-15',
        registrationDeadline: '2026-02-01',
        categories: ['Pro Men', 'Pro Women', 'Open Men', 'Open Women', 'Doubles Mixed'],
        priceRange: { min: 99, max: 149 },
        spotsTotal: 3000,
        spotsRemaining: 847,
        status: 'filling_fast',
        description: 'Kick off the season in sunny Miami! Experience the ultimate fitness race at the iconic Miami Beach Convention Center.',
        color: '#FF6B35',
        emoji: '🌴',
        highlights: ['Beachside venue', 'After-party included', 'Pro athlete appearances'],
    },
    {
        id: 'hx2',
        name: 'HYROX Chicago',
        city: 'Chicago',
        country: 'USA',
        venue: 'McCormick Place',
        date: '2026-03-08',
        registrationDeadline: '2026-02-22',
        categories: ['Pro Men', 'Pro Women', 'Open Men', 'Open Women', 'Doubles Men', 'Doubles Women', 'Doubles Mixed', 'Relay'],
        priceRange: { min: 79, max: 149 },
        spotsTotal: 5000,
        spotsRemaining: 2341,
        status: 'upcoming',
        description: 'Race through the Midwest\'s largest convention center. All categories available!',
        color: '#00BCD4',
        emoji: '🌬️',
        highlights: ['Full category lineup', 'Indoor heated venue', 'Chicago-style after-party'],
    },
    {
        id: 'hx3',
        name: 'HYROX Los Angeles',
        city: 'Los Angeles',
        country: 'USA',
        venue: 'Los Angeles Convention Center',
        date: '2026-04-19',
        registrationDeadline: '2026-04-05',
        categories: ['Pro Men', 'Pro Women', 'Open Men', 'Open Women', 'Doubles Mixed'],
        priceRange: { min: 99, max: 149 },
        spotsTotal: 4000,
        spotsRemaining: 3200,
        status: 'upcoming',
        description: 'West Coast vibes meet elite fitness competition. Train like the stars, race like a champion.',
        color: '#FFB800',
        emoji: '🎬',
        highlights: ['Celebrity sightings', 'VIP lounge access', 'Recovery zone'],
    },
    {
        id: 'hx4',
        name: 'HYROX London',
        city: 'London',
        country: 'UK',
        venue: 'ExCeL London',
        date: '2026-05-10',
        registrationDeadline: '2026-04-26',
        categories: ['Pro Men', 'Pro Women', 'Open Men', 'Open Women', 'Doubles Mixed', 'Relay'],
        priceRange: { min: 89, max: 159 },
        spotsTotal: 6000,
        spotsRemaining: 4521,
        status: 'upcoming',
        description: 'Europe\'s flagship HYROX event. Race in the heart of London at the world-class ExCeL venue.',
        color: '#E53935',
        emoji: '🇬🇧',
        highlights: ['Largest EU event', 'Elite pro field', 'Thames-side venue'],
    },
    {
        id: 'hx5',
        name: 'HYROX World Championship',
        city: 'Nice',
        country: 'France',
        venue: 'Palais des Expositions',
        date: '2026-06-14',
        registrationDeadline: '2026-05-01',
        categories: ['Pro Men', 'Pro Women'],
        priceRange: { min: 199, max: 249 },
        spotsTotal: 500,
        spotsRemaining: 0,
        status: 'sold_out',
        description: 'The pinnacle of HYROX competition. Qualification required. Watch the world\'s best battle for the title.',
        color: '#9C27B0',
        emoji: '🏆',
        highlights: ['World Championship', 'Elite pros only', 'Global broadcast'],
    },
    {
        id: 'hx6',
        name: 'HYROX Berlin',
        city: 'Berlin',
        country: 'Germany',
        venue: 'Messe Berlin',
        date: '2026-03-22',
        registrationDeadline: '2026-03-08',
        categories: ['Pro Men', 'Pro Women', 'Open Men', 'Open Women', 'Doubles Mixed'],
        priceRange: { min: 89, max: 149 },
        spotsTotal: 4500,
        spotsRemaining: 1890,
        status: 'filling_fast',
        description: 'HYROX was born in Germany. Experience the original at Messe Berlin.',
        color: '#3F51B5',
        emoji: '🇩🇪',
        highlights: ['HYROX birthplace', 'German engineering', 'Techno after-party'],
    },
    {
        id: 'hx7',
        name: 'HYROX Singapore',
        city: 'Singapore',
        country: 'Singapore',
        venue: 'Singapore EXPO',
        date: '2026-02-22',
        registrationDeadline: '2026-02-08',
        categories: ['Open Men', 'Open Women', 'Doubles Mixed'],
        priceRange: { min: 109, max: 139 },
        spotsTotal: 2500,
        spotsRemaining: 420,
        status: 'filling_fast',
        userRegistration: {
            category: 'Open Men',
            waveTime: '09:30',
            confirmationCode: 'HX-SG-2026-4521',
        },
        description: 'Asia\'s premier HYROX event. Air-conditioned venue in the heart of Singapore.',
        color: '#E91E63',
        emoji: '🇸🇬',
        highlights: ['AC venue', 'Asia Championship qualifier', 'Night race option'],
    },
    {
        id: 'hx8',
        name: 'HYROX Sydney',
        city: 'Sydney',
        country: 'Australia',
        venue: 'Sydney Olympic Park',
        date: '2026-04-05',
        registrationDeadline: '2026-03-22',
        categories: ['Pro Men', 'Pro Women', 'Open Men', 'Open Women', 'Doubles Mixed', 'Relay'],
        priceRange: { min: 99, max: 159 },
        spotsTotal: 3500,
        spotsRemaining: 2100,
        status: 'upcoming',
        description: 'Down under\'s biggest fitness race. Historic Olympic venue, legendary atmosphere.',
        color: '#00BCD4',
        emoji: '🦘',
        highlights: ['Olympic venue', 'Harbour views', 'Aussie BBQ after-party'],
    },
];

// Helper to calculate days until event
export function getDaysUntil(dateString: string): number {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Helper to format date nicely
export function formatEventDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

// Helper to get spots percentage
export function getSpotsPercentage(event: HyroxEvent): number {
    return Math.round((event.spotsRemaining / event.spotsTotal) * 100);
}

// Legacy event interface (keep for backward compatibility)
export interface Event {
    id: string;
    name: string;
    date: string;
    location: string;
    city: string;
    type: 'marathon' | 'triathlon' | 'ultramarathon' | '5k' | '10k' | 'half_marathon' | 'cycling' | 'crossfit' | 'hyrox';
    color: string;
    attendees: number;
    athleteIds: string[];
    distance?: string;
    description: string;
    emoji: string;
}

export const MOCK_EVENTS: Event[] = HYROX_EVENTS.map(e => ({
    id: e.id,
    name: e.name,
    date: formatEventDate(e.date),
    location: `${e.city}, ${e.country}`,
    city: e.city,
    type: 'hyrox' as const,
    color: e.color,
    attendees: e.spotsTotal - e.spotsRemaining,
    athleteIds: [],
    description: e.description,
    emoji: e.emoji,
}));

// Cities for exploration
export interface City {
    id: string;
    name: string;
    country: string;
    athleteCount: number;
    color: string;
    upcomingEvents: number;
    emoji: string;
}

export const POPULAR_CITIES: City[] = [
    {
        id: 'c1',
        name: 'New York',
        country: 'USA',
        athleteCount: 2450,
        color: '#FF6B35',
        upcomingEvents: 12,
        emoji: '🗽',
    },
    {
        id: 'c2',
        name: 'Los Angeles',
        country: 'USA',
        athleteCount: 1890,
        color: '#FFB800',
        upcomingEvents: 8,
        emoji: '🌴',
    },
    {
        id: 'c3',
        name: 'London',
        country: 'UK',
        athleteCount: 3200,
        color: '#E53935',
        upcomingEvents: 15,
        emoji: '🇬🇧',
    },
    {
        id: 'c4',
        name: 'Tokyo',
        country: 'Japan',
        athleteCount: 1560,
        color: '#E91E63',
        upcomingEvents: 6,
        emoji: '🗼',
    },
    {
        id: 'c5',
        name: 'Sydney',
        country: 'Australia',
        athleteCount: 980,
        color: '#00BCD4',
        upcomingEvents: 5,
        emoji: '🦘',
    },
];
