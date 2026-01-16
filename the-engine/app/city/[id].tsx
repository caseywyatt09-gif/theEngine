import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, Modal, SafeAreaView, StatusBar, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Colors } from '../../constants/Colors';
import { POPULAR_CITIES } from '../../data/mockEvents';
import { MOCK_ATHLETES, Athlete } from '../../data/mockAthletes';
import { ProfileTile } from '../../components/social/ProfileTile';
import { useAppStore } from '../../store/useAppStore';

const { height } = Dimensions.get('window');

export default function CityDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { mode } = useAppStore();
    const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);

    const city = POPULAR_CITIES.find(c => c.id === id);

    if (!city) {
        return (
            <View className="flex-1 bg-black justify-center items-center">
                <Text className="text-white">City not found</Text>
            </View>
        );
    }

    // SIMULATION: Select a deterministic subset of athletes based on the city ID
    // In a real app, this would be an API call: GET /athletes?cityId=...
    const cityAthletes = MOCK_ATHLETES.filter((_, index) => {
        // Simple hash-like logic to distribute athletes across cities
        const cityIndex = parseInt(city.id.replace('c', ''));
        return (index + cityIndex) % 3 === 0;
    });

    const handleConnect = () => {
        if (selectedAthlete) {
            // Mock connect action
            setSelectedAthlete(null);
        }
    };

    return (
        <View className="flex-1 bg-black">
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="light-content" />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Hero Headers */}
                <View className="relative h-64 w-full">
                    <LinearGradient
                        colors={[city.color, 'black']}
                        className="absolute inset-0"
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                    />

                    {/* Back Button */}
                    <SafeAreaView>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="flex-row items-center px-4 pt-2"
                        >
                            <Ionicons name="chevron-back" size={28} color="white" />
                            <Text className="text-white font-bold text-lg ml-1">Back</Text>
                        </TouchableOpacity>
                    </SafeAreaView>

                    <View className="absolute bottom-6 left-6 right-6">
                        <Text className="text-6xl mb-2">{city.emoji}</Text>
                        <Text className="text-white font-bold text-4xl">{city.name}</Text>
                        <View className="flex-row items-center gap-2 mt-2">
                            <Text className="text-white/80 text-lg">{city.country}</Text>
                            <View className="w-1 h-1 bg-white/50 rounded-full" />
                            <Text className="text-white/80 text-lg">{cityAthletes.length} Athletes Active</Text>
                        </View>
                    </View>
                </View>

                {/* Filter / Tabs Placeholder */}
                <View className="px-4 py-4 flex-row gap-3">
                    {['Top Rated', 'Newest', 'Online Now'].map((tab, i) => (
                        <TouchableOpacity
                            key={tab}
                            className={`px-4 py-2 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/10'}`}
                        >
                            <Text className={`${i === 0 ? 'text-black font-bold' : 'text-white'}`}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Athletes Grid */}
                <View className="flex-row flex-wrap px-2 pb-20">
                    {cityAthletes.map((athlete) => (
                        <ProfileTile
                            key={athlete.id}
                            athlete={athlete}
                            onPress={() => setSelectedAthlete(athlete)}
                        />
                    ))}
                </View>
            </ScrollView>


            {/* Full Screen Profile Modal (Reused) */}
            <Modal
                visible={selectedAthlete !== null}
                animationType="slide"
                presentationStyle="fullScreen"
            >
                {selectedAthlete && (
                    <View className="flex-1 bg-black">
                        <Image
                            source={selectedAthlete.avatar}
                            className="absolute w-full h-full"
                            style={{ resizeMode: 'cover' }}
                        />
                        <LinearGradient
                            colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(10,10,10,0.9)', '#000']}
                            locations={[0, 0.25, 0.6, 1]}
                            className="absolute inset-0"
                        />
                        <TouchableOpacity
                            onPress={() => setSelectedAthlete(null)}
                            className="absolute top-14 left-4 w-10 h-10 bg-black/50 rounded-full items-center justify-center z-10"
                        >
                            <Ionicons name="chevron-down" size={24} color="white" />
                        </TouchableOpacity>

                        <View className="flex-1 justify-end pb-12 px-6">
                            <View className="flex-row items-center gap-3 mb-1">
                                <Text className="text-4xl font-bold text-white">{selectedAthlete.displayName}</Text>
                                {selectedAthlete.age && <Text className="text-3xl text-white">{selectedAthlete.age}</Text>}
                            </View>
                            <Text className="text-gray-300 text-lg mb-4">{selectedAthlete.bio}</Text>

                            {/* Actions */}
                            <View className="flex-row justify-center gap-6 mt-4">
                                <TouchableOpacity
                                    onPress={() => setSelectedAthlete(null)}
                                    className="w-16 h-16 bg-white/10 rounded-full items-center justify-center"
                                >
                                    <Ionicons name="close" size={32} color="#ff4b4b" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleConnect}
                                    className="w-20 h-20 rounded-full items-center justify-center bg-blue-500 shadow-lg shadow-blue-500/50"
                                >
                                    <Ionicons name="heart" size={40} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity className="w-16 h-16 bg-white/10 rounded-full items-center justify-center">
                                    <Ionicons name="chatbubble" size={28} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            </Modal>
        </View>
    );
}
