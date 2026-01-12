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

    const [view, setView] = useState<'feed' | 'discover'>('feed'); // Toggle state

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
                <View style={styles.headerTitleRow}>
                    <TouchableOpacity onPress={() => setView('feed')}>
                        <Text style={[styles.headerTitle, view === 'feed' ? styles.activeTitle : styles.inactiveTitle]}>Feed</Text>
                    </TouchableOpacity>
                    <View style={styles.headerDivider} />
                    <TouchableOpacity onPress={() => setView('discover')}>
                        <Text style={[styles.headerTitle, view === 'discover' ? styles.activeTitle : styles.inactiveTitle]}>Discover</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Ionicons name="heart-outline" size={28} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Ionicons name="paper-plane-outline" size={26} color="white" />
                    </TouchableOpacity>
                </View>
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
            ) : (
                <DiscoverGrid />
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
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    iconBtn: {
        // Hit slop could be added here
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
});
