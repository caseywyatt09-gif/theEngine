import { AppMode } from '../store/useAppStore';
import { ImageSourcePropType } from 'react-native';

export interface Post {
    id: string;
    authorId: string;
    authorName: string;
    authorUsername: string;
    authorAvatar: ImageSourcePropType;
    authorVerified?: boolean;

    content: string;
    image?: ImageSourcePropType;

    type: 'workout' | 'race_result' | 'milestone' | 'question' | 'general';

    // Engagement
    likes: number;
    comments: number;
    shares: number;
    isLiked?: boolean;

    // Metadata
    timestamp: string;
    location?: string;

    // Activity data (for workout posts)
    activityType?: string;
    distance?: string;
    duration?: string;
    pace?: string;
    isVideo?: boolean;
    videoUrl?: string;
}

export const SUGGESTED_USERS = [
    {
        id: '1',
        name: 'jimboy_rivera',
        image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=500', // Motorcycle
        subtitle: 'Suggested for you',
    },
    {
        id: '2',
        name: 'james_estate',
        image: 'https://images.unsplash.com/photo-1600596542815-27b9c036e655?q=80&w=500', // Luxury Home
        subtitle: 'Followed by sarah + 2 more',
    },
    {
        id: '3',
        name: 'crossfit_games',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=500', // CrossFit/Event
        subtitle: 'Suggested for you',
    },
    {
        id: '4',
        name: 'nutrition_daily',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=500', // Healthy Food
        subtitle: 'Suggested for you',
    },
];

export const MOCK_POSTS: Post[] = [
    {
        id: 'p1',
        authorId: '1',
        authorName: 'Sarah Chen',
        authorUsername: '@sarahflies',
        authorAvatar: require('../assets/images/athletes/sarah.png'),
        authorVerified: true,
        content: '32km done ✅ Last 10k at race pace. The engine is ready for Boston! 😤 #marathontraining #bostonbound',
        type: 'workout',
        likes: 892,
        comments: 45,
        shares: 12,
        timestamp: '2h ago',
        location: 'Cambridge, MA',
        activityType: 'Run',
        distance: '32 km',
        duration: '2:45:00',
        pace: '5:09/km',
        image: require('../assets/images/athletes/sarah.png'),
    },
    {
        id: 'p2',
        authorId: '8',
        authorName: 'Kevin Nguyen',
        authorUsername: '@kevin_lifts',
        authorAvatar: require('../assets/images/athletes/kevin.png'),
        content: 'Hyrox through memes 😂\n\nI think this is pretty accurate for most peoples race… 💀 #hyrox #hyroxmemes #pain',
        type: 'general',
        likes: 9241,
        comments: 540,
        shares: 89,
        timestamp: '1d ago',
        image: require('../assets/images/athletes/kevin.png'),
        isVideo: true,
        videoUrl: 'https://cdn.coverr.co/videos/coverr-crossfit-battle-ropes-5290/1080p.mp4', // Placeholder Hyrox/Gym video
    },
    {
        id: 'p3',
        authorId: '3',
        authorName: 'Emily Rodriguez',
        authorUsername: '@em_runs_happy',
        authorAvatar: require('../assets/images/athletes/emily.png'),
        content: 'Gym selfie dump 📸 Trying to look cute while dying inside during Bulgarian split squats 🙃',
        type: 'general',
        likes: 567,
        comments: 89,
        shares: 15,
        timestamp: '5h ago',
        image: require('../assets/images/athletes/emily.png'),
    },
    {
        id: 'p4',
        authorId: '2',
        authorName: 'Marcus Johnson',
        authorUsername: '@marcusj_tri',
        authorAvatar: require('../assets/images/athletes/marcus.png'),
        authorVerified: true,
        content: 'Full race recap is up! 🎥 Taking you through every transition and the mental battle on the run. Link in bio!',
        type: 'race_result',
        likes: 2100,
        comments: 156,
        shares: 45,
        timestamp: '6h ago',
        location: 'Kona, HI',
        image: require('../assets/images/athletes/marcus.png'),
        isVideo: true,
    },
    {
        id: 'p5',
        authorId: '4',
        authorName: 'Jake Thompson',
        authorUsername: '@jakethepacemaker',
        authorAvatar: require('../assets/images/athletes/jake.png'),
        content: 'When the coach says "easy run" but you check the pace watch... 🤡',
        type: 'general',
        likes: 3400,
        comments: 420,
        shares: 1200,
        timestamp: '8h ago',
        image: require('../assets/images/athletes/david.png'), // Using David's pic as the 'reaction'
    },
    {
        id: 'p6',
        authorId: '5',
        authorName: 'Priya Patel',
        authorUsername: '@priyaruns',
        authorAvatar: require('../assets/images/athletes/priya.png'),
        content: 'Post-run coffee is the only reason I run tbh ☕️🥯',
        type: 'general',
        likes: 445,
        comments: 23,
        shares: 5,
        timestamp: '10h ago',
        image: require('../assets/images/athletes/priya.png'),
    },
    {
        id: 'p7',
        authorId: '6',
        authorName: 'David Kim',
        authorUsername: '@dkim_speed',
        authorAvatar: require('../assets/images/athletes/david.png'),
        authorVerified: true,
        content: 'Track vibes ⚡️ 12x400m at 64s. We working.',
        type: 'workout',
        likes: 789,
        comments: 67,
        shares: 34,
        timestamp: '1d ago',
        location: 'Stanford Track',
        activityType: 'Track',
        distance: '4.8 km',
        duration: '18:00',
        image: require('../assets/images/athletes/david.png'),
        isVideo: true,
    },
];
