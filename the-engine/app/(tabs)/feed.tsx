import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, SafeAreaView, Platform, StatusBar, ScrollView } from 'react-native';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { FeedPost } from '../../components/social/FeedPost';
import { MOCK_POSTS } from '../../data/mockPosts';
import { MOCK_ATHLETES } from '../../data/mockAthletes';
import { Colors } from '../../constants/Colors';
import { DiscoverGrid } from '../../components/social/DiscoverGrid';
import { SuggestedSection } from '../../components/social/SuggestedSection';
import { SUGGESTED_USERS } from '../../data/mockPosts';

const STORIES = [
    { id: 'new', name: 'Your Story', image: null, isUser: true },
    { id: '1', name: 'sarah', image: require('../../assets/images/athletes/sarah.png'), hasStory: true },
    { id: '2', name: 'marcus', image: require('../../assets/images/athletes/marcus.png'), hasStory: true },
    { id: '3', name: 'emily', image: require('../../assets/images/athletes/emily.png'), hasStory: false }, // Seen
    { id: '4', name: 'jake', image: require('../../assets/images/athletes/jake.png'), hasStory: true },
    { id: '5', name: 'priya', image: require('../../assets/images/athletes/priya.png'), hasStory: true },
];

export default function FeedScreen() {
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    const storyAthletes = MOCK_ATHLETES.slice(0, 8);

    const [view, setView] = useState<'feed' | 'discover' | 'pulse'>('feed'); // Toggle state

    // Mock Pulse/Thread posts
    const PULSE_POSTS = [
        {
            id: 'p1',
            author: 'Sarah Chen',
            handle: '@sarahfitness',
            avatar: require('../../assets/images/athletes/sarah.png'),
            content: 'Just crushed my first sub-60 HYROX! 🔥 All those sled pushes finally paid off. Who else is racing in Miami next month?',
            likes: 234,
            replies: 45,
            reposts: 12,
            time: '2h',
        },
        {
            id: 'p2',
            author: 'Marcus Johnson',
            handle: '@marcusruns',
            avatar: require('../../assets/images/athletes/marcus.png'),
            content: 'Hot take: Wall balls are harder than burpee broad jumps. Fight me. 😤\n\nThe leg burn is REAL after 100 reps.',
            likes: 567,
            replies: 89,
            reposts: 34,
            time: '4h',
        },
        {
            id: 'p3',
            author: 'Emily Davis',
            handle: '@emtrains',
            avatar: require('../../assets/images/athletes/emily.png'),
            content: 'Recovery tip: Ice bath + compression boots + 8hrs sleep = back at it tomorrow.\n\nWhat\'s your recovery stack? 👇',
            likes: 189,
            replies: 67,
            reposts: 8,
            time: '6h',
        },
        {
            id: 'p4',
            author: 'Jake Martinez',
            handle: '@jakemartinez',
            avatar: require('../../assets/images/athletes/jake.png'),
            content: 'New PB on the SkiErg today: 3:12 for 1000m 💪\n\nCoach said I need to work on my breathing. Video analysis coming soon!',
            likes: 312,
            replies: 23,
            reposts: 15,
            time: '8h',
        },
        {
            id: 'p5',
            author: 'Priya Patel',
            handle: '@priyapatel',
            avatar: require('../../assets/images/athletes/priya.png'),
            content: 'Looking for a training partner in SF Bay Area. I train 5x/week, usually mornings. DM me! 🏃‍♀️\n\n#HyroxTraining #FitnessCommunity',
            likes: 145,
            replies: 56,
            reposts: 22,
            time: '12h',
        },
    ];

    const renderPulsePost = (post: typeof PULSE_POSTS[0]) => (
        <TouchableOpacity key={post.id} style={styles.pulsePost}>
            <Image source={post.avatar} style={styles.pulseAvatar} />
            <View style={styles.pulseContent}>
                <View style={styles.pulseHeader}>
                    <Text style={styles.pulseAuthor}>{post.author}</Text>
                    <Text style={styles.pulseHandle}>{post.handle}</Text>
                    <Text style={styles.pulseTime}>· {post.time}</Text>
                </View>
                <Text style={styles.pulseText}>{post.content}</Text>
                <View style={styles.pulseActions}>
                    <TouchableOpacity style={styles.pulseAction}>
                        <Ionicons name="chatbubble-outline" size={18} color="#666" />
                        <Text style={styles.pulseActionText}>{post.replies}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.pulseAction}>
                        <Ionicons name="repeat-outline" size={20} color="#666" />
                        <Text style={styles.pulseActionText}>{post.reposts}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.pulseAction}>
                        <Ionicons name="heart-outline" size={18} color="#666" />
                        <Text style={styles.pulseActionText}>{post.likes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.pulseAction}>
                        <Ionicons name="share-outline" size={18} color="#666" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderHeader = () => (
        <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesContainer} contentContainerStyle={styles.storiesContent}>
                {STORIES.map((story) => (
                    <TouchableOpacity key={story.id} style={styles.storyItem}>
                        <View style={[
                            styles.storyRing,
                            story.hasStory && styles.activeStoryRing,
                            story.isUser && styles.noRing
                        ]}>
                            {story.isUser ? (
                                <View style={styles.addUserStory}>
                                    <Ionicons name="add" size={24} color="#FF6B35" />
                                </View>
                            ) : (
                                <Image source={story.image} style={styles.storyAvatar} />
                            )}
                        </View>
                        {story.hasStory && !story.isUser && (
                            <View style={styles.liveBadge}>
                                <Text style={styles.liveText}>LIVE</Text>
                            </View>
                        )}
                        <Text style={styles.storyName}>{story.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <View style={styles.divider} />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Custom Header with Toggle */}
            <View style={styles.topHeader}>
                <Text style={styles.headerBrand}>FEED</Text>

                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Ionicons name="heart-outline" size={28} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Ionicons name="paper-plane-outline" size={26} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content Toggle Pills */}
            <View style={styles.pillContainer}>
                {[
                    { key: 'feed', label: 'Feed' },
                    { key: 'discover', label: 'Discover' },
                    { key: 'pulse', label: 'Pulse' },
                ].map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        onPress={() => setView(tab.key as 'feed' | 'discover' | 'pulse')}
                        style={[
                            styles.pillItem,
                            view === tab.key && styles.pillActive
                        ]}
                    >
                        <Text style={[
                            styles.pillText,
                            view === tab.key && styles.pillTextActive
                        ]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Content Area */}
            {view === 'feed' ? (
                <FlatList
                    data={[
                        ...MOCK_POSTS.slice(0, 2),
                        { id: 'suggested-section', type: 'suggested' },
                        ...MOCK_POSTS.slice(2)
                    ]}
                    renderItem={({ item }) => {
                        if ((item as any).type === 'suggested') {
                            return <SuggestedSection users={SUGGESTED_USERS} />;
                        }
                        return <FeedPost post={item as any} />;
                    }}
                    keyExtractor={item => item.id}
                    ListHeaderComponent={renderHeader}
                    showsVerticalScrollIndicator={false}
                />
            ) : view === 'discover' ? (
                <DiscoverGrid />
            ) : (
                <ScrollView style={styles.pulseContainer} showsVerticalScrollIndicator={false}>
                    {/* Compose Button */}
                    <TouchableOpacity style={styles.composeBar}>
                        <Image source={require('../../assets/images/athletes/sarah.png')} style={styles.composeAvatar} />
                        <Text style={styles.composePlaceholder}>What's your training update?</Text>
                        <TouchableOpacity style={styles.composeBtn}>
                            <Ionicons name="send" size={20} color="white" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    {PULSE_POSTS.map(renderPulsePost)}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    topHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#000',
        position: 'relative', // Context for absolute positioning
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        justifyContent: 'center', // True center
        zIndex: -1, // Behind icons if they overlap (though shouldn't)
    },
    headerTitle: {
        fontFamily: 'System', // Or custom font
        fontSize: 22,
        fontWeight: '800', // Extra bold for "Engine" look
    },
    activeTitle: {
        color: 'white',
    },
    inactiveTitle: {
        color: '#666',
    },
    headerDivider: {
        width: 1,
        height: 18,
        backgroundColor: '#333',
        marginHorizontal: 12,
    },
    headerBrand: {
        fontSize: 24,
        fontWeight: '800',
        color: 'white',
        letterSpacing: -1,
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    iconBtn: {
        // Hit slop could be added here
    },
    pillContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1a',
    },
    pillItem: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#1a1a1a',
    },
    pillActive: {
        backgroundColor: '#FF6B35',
    },
    pillText: {
        color: '#888',
        fontSize: 14,
        fontWeight: '600',
    },
    pillTextActive: {
        color: 'white',
    },
    storiesContainer: {
        paddingVertical: 12,
    },
    storiesContent: {
        paddingHorizontal: 12,
    },
    storyItem: {
        alignItems: 'center',
        marginRight: 16,
        position: 'relative',
    },
    storyRing: {
        width: 68,
        height: 68,
        borderRadius: 34,
        padding: 3,
        borderWidth: 2,
        borderColor: '#333', // Default seen color
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeStoryRing: {
        borderColor: '#FF6B35', // Engine Orange
    },
    noRing: {
        borderWidth: 0,
        backgroundColor: '#1a1a1a',
    },
    storyAvatar: {
        width: 58,
        height: 58,
        borderRadius: 29,
    },
    addUserStory: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    liveBadge: {
        position: 'absolute',
        bottom: 20,
        backgroundColor: '#FF0055', // Live pink/red
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 3,
        borderWidth: 1.5,
        borderColor: 'black',
    },
    liveText: {
        color: 'white',
        fontSize: 8,
        fontWeight: 'bold',
    },
    storyName: {
        color: 'white',
        fontSize: 11,
        marginTop: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#262626',
    },
    // Pulse (Threads-like) styles
    pulseContainer: {
        flex: 1,
    },
    composeBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    composeAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    composePlaceholder: {
        flex: 1,
        color: '#666',
        fontSize: 16,
    },
    composeBtn: {
        backgroundColor: '#FF6B35',
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pulsePost: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#262626',
    },
    pulseAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
    },
    pulseContent: {
        flex: 1,
    },
    pulseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    pulseAuthor: {
        color: 'white',
        fontWeight: '700',
        fontSize: 15,
        marginRight: 4,
    },
    pulseHandle: {
        color: '#666',
        fontSize: 14,
        marginRight: 4,
    },
    pulseTime: {
        color: '#666',
        fontSize: 14,
    },
    pulseText: {
        color: 'white',
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 12,
    },
    pulseActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        maxWidth: 280,
    },
    pulseAction: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    pulseActionText: {
        color: '#666',
        fontSize: 13,
    },
});
