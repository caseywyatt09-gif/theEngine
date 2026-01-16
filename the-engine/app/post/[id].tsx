import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FeedPost } from '../../components/social/FeedPost';
import { Colors } from '../../constants/Colors';

// TODO: In a real app, fetch from a shared store or API. 
// For now, we'll "reconstruct" a Post object from the Discover item or use a mock lookup.
// Since we don't have a shared data store for "Discover Items" to "Post" mapping yet,
// we will mock a "full post" version of the discover item here.

export default function PostDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    // Local Lookup Data (Matching DiscoverGrid)
    const DISCOVER_ITEMS = [
        { id: '1', type: 'image', uri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80' },
        { id: '2', type: 'video', uri: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&w=800&q=80' },
        { id: '3', type: 'image', uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80' },
        { id: '4', type: 'image', uri: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80' },
        { id: '5', type: 'image', uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80' },
        { id: '6', type: 'video', uri: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&w=800&q=80' },
        { id: '7', type: 'image', uri: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80' },
        { id: '8', type: 'image', uri: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80' },
        { id: '9', type: 'image', uri: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?auto=format&fit=crop&w=800&q=80' },
        { id: '10', type: 'video', uri: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80' },
        { id: '11', type: 'image', uri: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80' },
        { id: '12', type: 'image', uri: 'https://images.unsplash.com/photo-1616279967983-ec413476e824?auto=format&fit=crop&w=800&q=80' },
    ];

    const item = DISCOVER_ITEMS.find(i => i.id === id);

    // MOCK DATA: Construct a "Post" based on the ID for demo purposes
    const mockPost = {
        id: id as string,
        authorId: 'u1',
        authorName: 'Engine Athlete',
        authorUsername: 'engine_athlete',
        authorAvatar: { uri: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop' },
        authorVerified: true,
        content: 'Pushing limits today at the new facility. #Engine #Hyrox',
        type: 'general',
        likes: 124,
        comments: 18,
        shares: 5,
        timestamp: '2h ago',
        location: 'The Engine House',
        image: item ? { uri: item.uri } : { uri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800' },
        isVideo: item ? item.type === 'video' : false,
        videoUrl: item?.type === 'video' ? 'https://assets.mixkit.co/videos/preview/mixkit-man-working-out-on-a-cross-trainer-machine-42861-large.mp4' : undefined,
    } as any;

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="white" />
                    <Text style={styles.backText}>Discover</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Post</Text>
                <View style={{ width: 80 }} /> {/* Spacer for balance */}
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* We pass the reconstructed post to FeedPost */}
                <FeedPost post={mockPost} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 80,
    },
    backText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 4,
        fontWeight: '600',
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        paddingBottom: 40,
    }
});
