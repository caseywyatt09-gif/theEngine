import { ImageSourcePropType } from 'react-native';

export interface Partner {
    id: number;
    name: string;
    age: number;
    division: string;
    pace: string;
    location: string;
    distance: string; // Mock location distance
    bio: string;
    verified: boolean;
    stats: {
        run: string;
        sled: string;
    };
    avatar: any; // Using any for require() assets
}

// Helper to get random avatar from available assets
// In a real app these would be URLs.
export const getAvatar = (id: number, gender: 'male' | 'female'): any => {
    // We will map these in the main file to avoid require cycles or context issues
    // This function acts as a placeholder for logic distribution
    return null;
};

export const MOCK_PARTNERS: Omit<Partner, 'avatar'>[] = [
    {
        id: 1, name: "Sarah", age: 29, division: "Women's Pro", pace: "60-65m", location: "Los Angeles, CA", distance: "2 miles away",
        bio: "Training for World Championships. Need a partner who can push the pace on the runs. No egos, just work.",
        verified: true, stats: { run: "3:45", sled: "105kg" }
    },
    {
        id: 2, name: "Kyle", age: 34, division: "Men's Open", pace: "70-75m", location: "Venice Beach, CA", distance: "5 miles away",
        bio: "First timer looking for a doubles partner. CrossFit background. Lets get after it! 🦾",
        verified: false, stats: { run: "4:15", sled: "140kg" }
    },
    {
        id: 3, name: "Marcus", age: 45, division: "Doubles Men", pace: "55-60m", location: "Santa Monica, CA", distance: "8 miles away",
        bio: "I will not stop. I have detailed files on all Hyrox movements. My mission is to win.",
        verified: true, stats: { run: "3:15", sled: "200kg" }
    },
    {
        id: 4, name: "Jessica", age: 27, division: "Women's Open", pace: "75-80m", location: "Culver City, CA", distance: "12 miles away",
        bio: "Running is my strength, need help on the heavy sleds! Let's crush a doubles race.",
        verified: false, stats: { run: "4:05", sled: "90kg" }
    },
    {
        id: 5, name: "David", age: 31, division: "Men's Pro", pace: "58-62m", location: "Downtown LA", distance: "15 miles away",
        bio: " aiming for sub-60. former track athlete. looking for serious training partner.",
        verified: true, stats: { run: "3:30", sled: "160kg" }
    },
    {
        id: 6, name: "Emma", age: 24, division: "Mixed Doubles", pace: "65-70m", location: "Silver Lake, CA", distance: "3 miles away",
        bio: "Just for fun but I like to win. 🤷‍♀️",
        verified: false, stats: { run: "4:20", sled: "110kg" }
    },
    {
        id: 7, name: "James", age: 38, division: "Men's Open", pace: "80m+", location: "Pasadena, CA", distance: "20 miles away",
        bio: "Dad strength engaged. First Hyrox, let's survive.",
        verified: false, stats: { run: "5:00", sled: "152kg" }
    },
    {
        id: 8, name: "Sophie", age: 33, division: "Women's Pro", pace: "62-66m", location: "Beverly Hills, CA", distance: "6 miles away",
        bio: "Hyrox coach and athlete. Join my squad.",
        verified: true, stats: { run: "3:55", sled: "120kg" }
    },
    {
        id: 9, name: "Mike", age: 28, division: "Doubles Men", pace: "60-65m", location: "West Hollywood, CA", distance: "4 miles away",
        bio: "Wall balls are life. Burpees are death.",
        verified: false, stats: { run: "4:10", sled: "145kg" }
    },
    {
        id: 10, name: "Olivia", age: 26, division: "Mixed Doubles", pace: "70m", location: "Santa Monica, CA", distance: "8 miles away",
        bio: "Looking for a guy who can keep up on the row.",
        verified: true, stats: { run: "4:30", sled: "100kg" }
    },
    {
        id: 11, name: "Chris", age: 41, division: "Men's Open", pace: "75m", location: "Malibu, CA", distance: "25 miles away",
        bio: "Training at the beach. Sand runs > track runs.",
        verified: false, stats: { run: "4:45", sled: "135kg" }
    },
    {
        id: 12, name: "Natasha", age: 30, division: "Women's Open", pace: "68m", location: "Venice, CA", distance: "5 miles away",
        bio: "Former rower, now Hyrox addict.",
        verified: true, stats: { run: "4:15", sled: "115kg" }
    },
    {
        id: 13, name: "Tom", age: 35, division: "Men's Pro", pace: "57m", location: "El Segundo, CA", distance: "14 miles away",
        bio: "Top 10 finisher last year. Going for podium.",
        verified: true, stats: { run: "3:25", sled: "170kg" }
    },
    {
        id: 14, name: "Rachel", age: 25, division: "Doubles Women", pace: "72m", location: "Manhattan Beach, CA", distance: "16 miles away",
        bio: "Hyrox debut! Need a partner for Chicago.",
        verified: false, stats: { run: "4:40", sled: "95kg" }
    },
    {
        id: 15, name: "Ben", age: 29, division: "Mixed Doubles", pace: "63m", location: "Los Angeles, CA", distance: "2 miles away",
        bio: "Crossfit regional athlete converting to Hyrox.",
        verified: true, stats: { run: "3:50", sled: "155kg" }
    },
    {
        id: 16, name: "Laura", age: 32, division: "Women's Pro", pace: "64m", location: "Hollywood, CA", distance: "5 miles away",
        bio: "Sled push specialist. I'll take the heavy work.",
        verified: true, stats: { run: "4:00", sled: "130kg" }
    },
    {
        id: 17, name: "Daniel", age: 27, division: "Men's Open", pace: "69m", location: "Echo Park, CA", distance: "4 miles away",
        bio: "Running is easy, stations are hard. Help me.",
        verified: false, stats: { run: "3:55", sled: "125kg" }
    },
    {
        id: 18, name: "Megan", age: 23, division: "Women's Open", pace: "78m", location: "USC Campus, CA", distance: "7 miles away",
        bio: "College athlete looking for next challenge.",
        verified: false, stats: { run: "4:25", sled: "85kg" }
    },
    {
        id: 19, name: "Alex", age: 36, division: "Doubles Men", pace: "61m", location: "Culver City, CA", distance: "12 miles away",
        bio: "Engine for days. Let's go.",
        verified: true, stats: { run: "3:40", sled: "150kg" }
    },
    {
        id: 20, name: "Chloe", age: 28, division: "Mixed Doubles", pace: "67m", location: "Sherman Oaks, CA", distance: "18 miles away",
        bio: "Looking for a partner for Las Vegas race.",
        verified: false, stats: { run: "4:10", sled: "105kg" }
    },
];
