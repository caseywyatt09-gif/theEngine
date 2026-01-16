export interface Product {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    condition: 'New' | 'Like New' | 'Good' | 'Fair';
    category: 'Gear' | 'Apparel' | 'Supplements' | 'Tech';
    image: any;
    seller: {
        name: string;
        rating: number;
        verified: boolean;
    };
    isSourced?: boolean; // For AI Style Match results
}

export interface LiveStream {
    id: string;
    title: string;
    host: string;
    viewers: number;
    image: any;
    isLive: boolean;
    category: string;
}

export interface ForumPost {
    id: string;
    title: string;
    author: string;
    category: 'General' | 'Training' | 'Gear' | 'r/Hyrox';
    upvotes: number;
    comments: number;
    time: string;
    image?: any;
}

export const MOCK_PRODUCTS: Product[] = [
    {
        id: 'p1',
        title: 'Concept2 RowErg - Barely Used',
        price: 850,
        originalPrice: 990,
        condition: 'Like New',
        category: 'Gear',
        image: require('../assets/stations/rowing.png'),
        seller: { name: 'Mike T.', rating: 4.8, verified: true },
    },
    {
        id: 'p2',
        title: 'Puma Deviate Nitro 2 - Size 10',
        price: 95,
        originalPrice: 160,
        condition: 'Good',
        category: 'Apparel',
        image: require('../assets/images/athletes/marcus.png'), // Placeholder
        seller: { name: 'Sarah J.', rating: 5.0, verified: true },
    },
    {
        id: 'p3',
        title: 'Hyrox Sandbag (20kg)',
        price: 80,
        originalPrice: 110,
        condition: 'New',
        category: 'Gear',
        image: require('../assets/stations/lunges.png'),
        seller: { name: 'HYROX Official', rating: 5.0, verified: true },
    },
    {
        id: 'p4',
        title: 'Garmin Fenix 7 Pro',
        price: 650,
        originalPrice: 800,
        condition: 'Like New',
        category: 'Tech',
        image: require('../assets/images/athletes/jake.png'), // Placeholder
        seller: { name: 'Tom R.', rating: 4.9, verified: true },
    },
    {
        id: 'p5',
        title: 'Kettlebell Set (16/24/32kg)',
        price: 150,
        originalPrice: 220,
        condition: 'Good',
        category: 'Gear',
        image: require('../assets/stations/farmers_carry.png'),
        seller: { name: 'CrossFit Box 23', rating: 4.7, verified: false },
    },
];

export const MOCK_STREAMS: LiveStream[] = [
    {
        id: 's1',
        title: '🔥 FLASH SALE: Hyrox Gear!',
        host: 'GearHeadz',
        viewers: 1240,
        image: require('../assets/stations/sled_push.png'),
        isLive: true,
        category: 'Auctions',
    },
    {
        id: 's2',
        title: 'Shoe Review + Giveaway',
        host: 'TheRunningChannel',
        viewers: 856,
        image: require('../assets/images/athletes/emily.png'),
        isLive: true,
        category: 'Reviews',
    },
    {
        id: 's3',
        title: 'Live Training Session',
        host: 'Hunter McIntyre',
        viewers: 3500,
        image: require('../assets/stations/skierg.png'),
        isLive: true,
        category: 'Training',
    },
    {
        id: 's4',
        title: 'Supplement Q&A',
        host: 'NutritionCoach',
        viewers: 420,
        image: require('../assets/meals/smoothie.png'),
        isLive: true,
        category: 'Education',
    },
];

export const MOCK_FORUM_POSTS: ForumPost[] = [
    {
        id: 'f1',
        title: 'Is the Sled Pull harder on carpet or turf? 🥵',
        author: 'u/HyroxNoob',
        category: 'r/Hyrox',
        upvotes: 342,
        comments: 45,
        time: '2h ago',
    },
    {
        id: 'f2',
        title: 'Best shoes for Hyrox 2026 season?',
        author: 'u/SpeedDemon',
        category: 'Gear',
        upvotes: 128,
        comments: 89,
        time: '4h ago',
        image: require('../assets/images/athletes/sarah.png'),
    },
    {
        id: 'f3',
        title: 'Training Split for Sub-60 Goal',
        author: 'u/CoachKev',
        category: 'Training',
        upvotes: 567,
        comments: 112,
        time: '6h ago',
    },
    {
        id: 'f4',
        title: 'Selling my ticket for London event',
        author: 'u/InjuredRunner',
        category: 'General',
        upvotes: 23,
        comments: 12,
        time: '1d ago',
    },
];
