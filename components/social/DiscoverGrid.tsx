import { View, Text, Image, TouchableOpacity, Dimensions, ScrollView, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

const { width } = Dimensions.get('window');
const COLUMN_count = 3;
const ITEM_WIDTH = width / COLUMN_count;

// Mock Data for Discover Grid (Sourced "Hyrox" & Aesthetic Content)
const DISCOVER_ITEMS = [
    { id: '1', type: 'image', uri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80' }, // Gym aesthetic
    { id: '2', type: 'video', uri: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&w=800&q=80' }, // Workout action
    { id: '3', type: 'image', uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80' }, // Gym mood
    { id: '4', type: 'image', uri: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80' }, // Healthy food (New)
    { id: '5', type: 'image', uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80' }, // Gym mood (Reuse stable one to be safe)
    { id: '6', type: 'video', uri: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&w=800&q=80' }, // Running
    { id: '7', type: 'image', uri: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80' }, // Selfie
    { id: '8', type: 'image', uri: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80' }, // Weights
    { id: '9', type: 'image', uri: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?auto=format&fit=crop&w=800&q=80' }, // Yoga/Fitness (New)
    { id: '10', type: 'video', uri: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80' }, // Fashion
    { id: '11', type: 'image', uri: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80' }, // Rope
    { id: '12', type: 'image', uri: 'https://images.unsplash.com/photo-1616279967983-ec413476e824?auto=format&fit=crop&w=800&q=80' }, // Aesthetic
];

const FILTERS = ['Top', 'Workouts', 'Nutrition', 'Gear', 'Hyrox', 'Marathon'];

export function DiscoverGrid() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#888" />
                    <TextInput
                        placeholder="Search"
                        placeholderTextColor="#888"
                        style={styles.searchInput}
                    />
                </View>
            </View>

            {/* Filter Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer} contentContainerStyle={styles.filtersContent}>
                {FILTERS.map((filter, index) => (
                    <TouchableOpacity key={index} style={styles.filterChip}>
                        <Text style={styles.filterText}>{filter}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Masonry Grid (Simplified as 3-col wrap for now) */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid}>
                {DISCOVER_ITEMS.map((item, index) => {
                    return (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.gridItem}
                            onPress={() => router.push(`/post/${item.id}`)}
                        >
                            <Image
                                source={{ uri: item.uri }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                            {item.type === 'video' && (
                                <View style={styles.videoIcon}>
                                    <Ionicons name="play" size={20} color="white" />
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    searchContainer: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#262626',
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 36,
    },
    searchInput: {
        flex: 1,
        color: 'white',
        marginLeft: 8,
        fontSize: 16,
    },
    filtersContainer: {
        marginBottom: 8,
    },
    filtersContent: {
        paddingHorizontal: 12,
        gap: 8,
        paddingBottom: 4, // Prevent clipping
    },
    filterChip: {
        backgroundColor: '#262626',
        borderWidth: 1,
        borderColor: '#333',
        paddingHorizontal: 16,
        paddingVertical: 8, // Increased for better tap target and text visibility
        borderRadius: 20, // More pill-shaped for modern look
    },
    filterText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    gridItem: {
        width: '33.33%',
        aspectRatio: 1,
        borderWidth: 0.5, // Hairline border for grid separation
        borderColor: '#000',
    },
    image: {
        width: '100%',
        height: '100%',
        position: 'absolute', // Ensure it fills the aspect ratio container
        top: 0,
        left: 0,
    },
    videoIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 12, // slightly rounded
        padding: 4,
    },
});
