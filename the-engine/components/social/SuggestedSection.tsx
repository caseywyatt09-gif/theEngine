import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.45; // Slightly less than half width

export interface SuggestedUser {
    id: string;
    name: string;
    image: string; // URL
    subtitle: string;
}

interface SuggestedSectionProps {
    users: SuggestedUser[];
}

export function SuggestedSection({ users }: SuggestedSectionProps) {
    const renderItem = ({ item }: { item: SuggestedUser }) => (
        <View style={styles.card}>
            <TouchableOpacity style={styles.closeBtn}>
                <Ionicons name="close" size={16} color="#999" />
            </TouchableOpacity>

            <Image source={{ uri: item.image }} style={styles.profileImage} />

            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.subtitle} numberOfLines={1}>{item.subtitle}</Text>

            <TouchableOpacity style={styles.followBtn}>
                <Text style={styles.followText}>Follow</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Suggested for you</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAll}>See all</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={users}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 15,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    title: {
        color: 'white',
        fontWeight: '600',
        fontSize: 15,
    },
    seeAll: {
        color: '#0095F6', // Instagram blue
        fontWeight: '600',
        fontSize: 14,
    },
    listContent: {
        paddingHorizontal: 12,
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: '#262626',
        position: 'relative',
    },
    closeBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 1,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
        marginTop: 8,
    },
    name: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
        marginBottom: 2,
    },
    subtitle: {
        color: '#999',
        fontSize: 12,
        marginBottom: 16,
    },
    followBtn: {
        backgroundColor: '#0095F6',
        width: '100%',
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: 'center',
    },
    followText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
});
