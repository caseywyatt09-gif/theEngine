import { ImageSourcePropType } from 'react-native';

export interface Event {
    id: string;
    name: string;
    date: string;
    location: string;
    city: string;
    type: 'marathon' | 'triathlon' | 'ultramarathon' | '5k' | '10k' | 'half_marathon' | 'cycling' | 'crossfit';
    color: string; // Gradient color for placeholder
    attendees: number;
    athleteIds: string[]; // IDs of athletes attending
    distance?: string;
    description: string;
    emoji: string;
}

export const MOCK_EVENTS: Event[] = [
    {
        id: 'e1',
        name: 'Boston Marathon',
        date: 'Apr 21, 2025',
        location: 'Boston, MA',
        city: 'Boston',
        type: 'marathon',
        color: '#FFD700',
        attendees: 847,
        athleteIds: ['1', '13'],
        distance: '42.2 km',
        description: 'The world\'s oldest annual marathon',
        emoji: '🏃‍♂️',
    },
    {
        id: 'e2',
        name: 'NYC Marathon',
        date: 'Nov 2, 2025',
        location: 'New York, NY',
        city: 'New York',
        type: 'marathon',
        color: '#FF6B35',
        attendees: 1243,
        athleteIds: ['4', '9'],
        distance: '42.2 km',
        description: 'Run through all five boroughs',
        emoji: '🗽',
    },
    {
        id: 'e3',
        name: 'Ironman Arizona',
        date: 'Nov 17, 2025',
        location: 'Tempe, AZ',
        city: 'Tempe',
        type: 'triathlon',
        color: '#E53935',
        attendees: 312,
        athleteIds: ['2', '17'],
        distance: '226 km',
        description: '3.8km swim, 180km bike, 42.2km run',
        emoji: '🏊‍♂️',
    },
    {
        id: 'e4',
        name: 'Berlin Marathon',
        date: 'Sep 28, 2025',
        location: 'Berlin, Germany',
        city: 'Berlin',
        type: 'marathon',
        color: '#3F51B5',
        attendees: 562,
        athleteIds: ['13'],
        distance: '42.2 km',
        description: 'One of the World Marathon Majors',
        emoji: '🇩🇪',
    },
    {
        id: 'e5',
        name: 'CrossFit Games',
        date: 'Aug 1, 2025',
        location: 'Madison, WI',
        city: 'Madison',
        type: 'crossfit',
        color: '#00BCD4',
        attendees: 2150,
        athleteIds: ['8', '12'],
        description: 'The world\'s premier test of fitness',
        emoji: '🏋️',
    },
    {
        id: 'e6',
        name: 'Chicago Marathon',
        date: 'Oct 12, 2025',
        location: 'Chicago, IL',
        city: 'Chicago',
        type: 'marathon',
        color: '#4CAF50',
        attendees: 876,
        athleteIds: ['9'],
        distance: '42.2 km',
        description: 'Flat and fast through the Windy City',
        emoji: '🌬️',
    },
    {
        id: 'e7',
        name: 'Western States 100',
        date: 'Jun 28, 2025',
        location: 'Auburn, CA',
        city: 'Auburn',
        type: 'ultramarathon',
        color: '#795548',
        attendees: 125,
        athleteIds: ['3', '7'],
        distance: '161 km',
        description: 'The world\'s oldest 100-mile trail race',
        emoji: '⛰️',
    },
    {
        id: 'e8',
        name: 'Saturday Parkrun',
        date: 'Every Saturday',
        location: 'Central Park',
        city: 'Local',
        type: '5k',
        color: '#9C27B0',
        attendees: 89,
        athleteIds: ['5', '11', '14'],
        distance: '5 km',
        description: 'Free weekly timed run for everyone',
        emoji: '☀️',
    },
];

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
