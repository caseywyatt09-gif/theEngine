import { View, Text, ScrollView, TouchableOpacity, Modal, Alert, Image, Dimensions } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '../../store/useAppStore';
import { Colors } from '../../constants/Colors';
import { ProfileTile } from '../../components/social/ProfileTile';
import { EventCard } from '../../components/social/EventCard';
import { MOCK_ATHLETES, Athlete } from '../../data/mockAthletes';
import { MOCK_EVENTS, POPULAR_CITIES } from '../../data/mockEvents';

const { height } = Dimensions.get('window');

export default function SocialScreen() {
    const { mode, toggleMode } = useAppStore();
    const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
    const [matches, setMatches] = useState<Athlete[]>([]);
    const [activeTab, setActiveTab] = useState<'athletes' | 'nearby' | 'events' | 'cities'>('athletes');

    // Filter athletes based on mode
    const allAthletes = MOCK_ATHLETES;
    const activeAthletes = allAthletes.filter(a => a.isActive);
    const recommendedAthletes = allAthletes.filter(a => !a.isActive);

    const handleConnect = () => {
        if (selectedAthlete) {
            setMatches([...matches, selectedAthlete]);
            Alert.alert(
                '🔥 It\'s a Match!',
                `You and ${selectedAthlete.displayName} can now train together!`
            );
            // Move to next athlete
            const currentIdx = allAthletes.findIndex(a => a.id === selectedAthlete.id);
            const nextAthlete = allAthletes[currentIdx + 1] || allAthletes[0];
            setSelectedAthlete(nextAthlete);
        }
    };

    const handleSkip = () => {
        if (selectedAthlete) {
            const currentIdx = allAthletes.findIndex(a => a.id === selectedAthlete.id);
            const nextAthlete = allAthletes[currentIdx + 1] || allAthletes[0];
            setSelectedAthlete(nextAthlete);
        }
    };

    return (
        <View className="flex-1 bg-background">
            {/* Header */}
            <View className="pt-14 px-5 pb-3 flex-row justify-between items-center">
                <TouchableOpacity>
                    <Ionicons name="settings-outline" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={toggleMode}
                    className="flex-row items-center gap-2"
                >
                    <Ionicons name="flame" size={26} color={Colors.primary} />
                    <Text className="text-lg font-bold text-white">
                        {mode === 'race' ? 'RACE' : 'FUN'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity>
                    <Ionicons name="chatbubbles-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View className="flex-row px-2 mb-3">
                <TouchableOpacity
                    onPress={() => setActiveTab('athletes')}
                    className={`flex-1 py-2 ${activeTab === 'athletes' ? 'border-b-2 border-primary' : 'border-b border-gray-700'}`}
                >
                    <Text className={`text-center text-xs font-medium ${activeTab === 'athletes' ? 'text-white' : 'text-textDim'}`}>
                        Athletes
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab('nearby')}
                    className={`flex-1 py-2 ${activeTab === 'nearby' ? 'border-b-2 border-primary' : 'border-b border-gray-700'}`}
                >
                    <Text className={`text-center text-xs font-medium ${activeTab === 'nearby' ? 'text-white' : 'text-textDim'}`}>
                        Near You
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab('events')}
                    className={`flex-1 py-2 ${activeTab === 'events' ? 'border-b-2 border-primary' : 'border-b border-gray-700'}`}
                >
                    <Text className={`text-center text-xs font-medium ${activeTab === 'events' ? 'text-white' : 'text-textDim'}`}>
                        Events
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab('cities')}
                    className={`flex-1 py-2 ${activeTab === 'cities' ? 'border-b-2 border-primary' : 'border-b border-gray-700'}`}
                >
                    <Text className={`text-center text-xs font-medium ${activeTab === 'cities' ? 'text-white' : 'text-textDim'}`}>
                        Cities
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 8 }}
                showsVerticalScrollIndicator={false}
            >
                {activeTab === 'athletes' && (
                    <>
                        {/* Recently Active Section */}
                        <Text className="text-white font-bold text-lg px-2 mb-2">Recently Active</Text>
                        <View className="flex-row flex-wrap">
                            {activeAthletes.map((athlete) => (
                                <ProfileTile
                                    key={athlete.id}
                                    athlete={athlete}
                                    onPress={() => setSelectedAthlete(athlete)}
                                />
                            ))}
                        </View>

                        {/* Recommended Section */}
                        <View className="flex-row justify-between items-center px-2 mt-6 mb-2">
                            <Text className="text-white font-bold text-lg">Recommended</Text>
                            <TouchableOpacity>
                                <Text className="text-textDim text-sm">See More</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row flex-wrap">
                            {recommendedAthletes.map((athlete) => (
                                <ProfileTile
                                    key={athlete.id}
                                    athlete={athlete}
                                    onPress={() => setSelectedAthlete(athlete)}
                                />
                            ))}
                        </View>
                    </>
                )}

                {activeTab === 'events' && (
                    <>
                        {/* Upcoming Events */}
                        <Text className="text-white font-bold text-lg px-2 mb-3">Upcoming Races</Text>
                        <View className="flex-row flex-wrap px-1">
                            {MOCK_EVENTS.map((event) => (
                                <View key={event.id} className="w-1/2 p-1">
                                    <TouchableOpacity className="rounded-2xl overflow-hidden">
                                        {/* Event Card */}
                                        <LinearGradient
                                            colors={[event.color, `${event.color}99`]}
                                            className="h-32 p-3 justify-between"
                                        >
                                            <View className="flex-row justify-between">
                                                <Text className="text-2xl">{event.emoji}</Text>
                                                <View className="bg-black/30 px-2 py-1 rounded-full">
                                                    <Text className="text-white text-[10px]">{event.date}</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text className="text-white font-bold text-sm" numberOfLines={1}>{event.name}</Text>
                                                <Text className="text-white/70 text-xs">{event.attendees} going</Text>
                                            </View>
                                        </LinearGradient>
                                        {/* I'm Going Button */}
                                        <TouchableOpacity className="bg-surface py-2.5 flex-row items-center justify-center gap-2 border-t border-gray-700">
                                            <Ionicons name="checkmark-circle-outline" size={16} color={Colors.fun} />
                                            <Text className="text-fun font-medium text-sm">I'm Going</Text>
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </>
                )}

                {activeTab === 'nearby' && (
                    <>
                        {/* Near You Header */}
                        <View className="flex-row justify-between items-center px-2 mb-3">
                            <Text className="text-white font-bold text-lg">Athletes Near You</Text>
                            <View className="bg-fun/20 px-3 py-1 rounded-full">
                                <Text className="text-fun text-xs font-medium">Within 5 miles</Text>
                            </View>
                        </View>

                        {/* Activity Filter Pills */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="mb-4"
                            contentContainerStyle={{ paddingHorizontal: 8 }}
                        >
                            {['All', '🏃 Run', '☕ Coffee', '🌲 Trail', '🏋️ Gym'].map((tag, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    className={`px-4 py-2 rounded-full mr-2 ${idx === 0 ? 'bg-primary' : 'bg-surface border border-gray-700'}`}
                                >
                                    <Text className={`text-sm ${idx === 0 ? 'text-white font-medium' : 'text-textDim'}`}>
                                        {tag}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Nearby Athletes Grid */}
                        <View className="flex-row flex-wrap">
                            {allAthletes
                                .filter(a => parseInt(a.location.split(' ')[0]) <= 5)
                                .sort((a, b) => parseInt(a.location.split(' ')[0]) - parseInt(b.location.split(' ')[0]))
                                .map((athlete) => (
                                    <ProfileTile
                                        key={athlete.id}
                                        athlete={athlete}
                                        onPress={() => setSelectedAthlete(athlete)}
                                    />
                                ))}
                        </View>
                    </>
                )}

                {activeTab === 'cities' && (
                    <>
                        {/* Cities Header */}
                        <View className="px-2 mb-3">
                            <Text className="text-white font-bold text-lg">Explore Cities</Text>
                            <Text className="text-textDim text-sm">Signal where you're traveling to connect with athletes there</Text>
                        </View>

                        {/* Popular Cities Grid */}
                        <View className="flex-row flex-wrap px-1">
                            {POPULAR_CITIES.map((city) => (
                                <View key={city.id} className="w-1/2 p-1">
                                    <TouchableOpacity className="rounded-2xl overflow-hidden">
                                        <LinearGradient
                                            colors={[city.color, `${city.color}77`]}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            className="h-28 p-3 justify-between"
                                        >
                                            <Text className="text-3xl">{city.emoji}</Text>
                                            <View>
                                                <Text className="text-white font-bold text-base">{city.name}</Text>
                                                <Text className="text-white/70 text-xs">{city.athleteCount} athletes</Text>
                                            </View>
                                        </LinearGradient>
                                        {/* I'm Planning Button */}
                                        <TouchableOpacity className="bg-surface py-2.5 flex-row items-center justify-center gap-2 border-t border-gray-700">
                                            <Ionicons name="airplane-outline" size={16} color={Colors.secondary} />
                                            <Text className="text-secondary font-medium text-sm">I'm Visiting</Text>
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </>
                )}
            </ScrollView>

            {/* Bottom Tab Bar */}
            <View className="h-20 bg-surface border-t border-gray-800 flex-row justify-around items-center px-8 pb-4">
                <TouchableOpacity>
                    <Ionicons name="flame" size={26} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="grid" size={24} color={Colors.textDim} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="star" size={24} color={Colors.textDim} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="chatbubble" size={24} color={Colors.textDim} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="person" size={24} color={Colors.textDim} />
                </TouchableOpacity>
            </View>

            {/* Full Screen Profile Modal */}
            <Modal
                visible={selectedAthlete !== null}
                animationType="slide"
                presentationStyle="fullScreen"
            >
                {selectedAthlete && (
                    <View className="flex-1 bg-background">
                        {/* Full Screen Background Photo */}
                        <Image
                            source={selectedAthlete.avatar}
                            className="absolute w-full h-full"
                            resizeMode="cover"
                            style={{ objectFit: 'cover', objectPosition: 'center center' } as any}
                        />

                        {/* Gradient Overlay - covers entire screen */}
                        <LinearGradient
                            colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(10,10,10,0.85)', '#0A0A0A']}
                            locations={[0, 0.25, 0.55, 0.75]}
                            className="absolute inset-0"
                        />

                        {/* Close Button */}
                        <TouchableOpacity
                            onPress={() => setSelectedAthlete(null)}
                            className="absolute top-14 left-4 w-10 h-10 bg-black/50 rounded-full items-center justify-center z-10"
                        >
                            <Ionicons name="chevron-down" size={24} color="white" />
                        </TouchableOpacity>

                        {/* Mode Badge */}
                        <View
                            className="absolute top-14 right-4 px-3 py-1.5 rounded-full z-10"
                            style={{ backgroundColor: selectedAthlete.currentMode === 'race' ? Colors.race : Colors.fun }}
                        >
                            <Text className="text-xs font-bold text-white">
                                {selectedAthlete.currentMode === 'race' ? '🏁 RACE' : '🎉 FUN'}
                            </Text>
                        </View>

                        {/* Content Overlay - positioned at bottom */}
                        <View className="flex-1 justify-end">
                            {/* Name & Info */}
                            <View className="px-6 mb-2">
                                <View className="flex-row items-center gap-3 mb-1">
                                    <Text className="text-4xl font-bold text-white">
                                        {selectedAthlete.displayName}
                                    </Text>
                                    {selectedAthlete.age && (
                                        <Text className="text-3xl text-white">{selectedAthlete.age}</Text>
                                    )}
                                </View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="location" size={14} color={Colors.textDim} />
                                    <Text className="text-textDim">{selectedAthlete.location}</Text>
                                </View>
                            </View>

                            {/* Tags */}
                            <View className="flex-row flex-wrap gap-2 px-6 mb-3">
                                {selectedAthlete.vibeCheck && (
                                    <View className="bg-surface/80 px-4 py-2 rounded-full border border-gray-700">
                                        <Text className="text-white">{selectedAthlete.vibeCheck}</Text>
                                    </View>
                                )}
                                {selectedAthlete.favoriteActivities?.slice(0, 2).map((activity) => (
                                    <View key={activity} className="bg-surface/80 px-4 py-2 rounded-full border border-gray-700">
                                        <Text className="text-white">{activity}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Bio */}
                            <Text className="text-gray-300 text-base leading-6 px-6 mb-4">
                                {selectedAthlete.bio}
                            </Text>

                            {/* Stats */}
                            {selectedAthlete.vo2Max && (
                                <View className="flex-row gap-3 px-6 mb-6">
                                    <View className="bg-surface/80 px-4 py-3 rounded-xl flex-1 border border-gray-700">
                                        <Text className="text-textDim text-xs">VO2 Max</Text>
                                        <Text className="text-white font-bold text-lg">{selectedAthlete.vo2Max}</Text>
                                    </View>
                                    {selectedAthlete.racePace && (
                                        <View className="bg-surface/80 px-4 py-3 rounded-xl flex-1 border border-gray-700">
                                            <Text className="text-textDim text-xs">Pace</Text>
                                            <Text className="text-white font-bold text-lg">{selectedAthlete.racePace}</Text>
                                        </View>
                                    )}
                                </View>
                            )}

                            {/* Action Buttons */}
                            <View className="flex-row justify-center items-center gap-5 pb-10 pt-4 px-6">
                                <TouchableOpacity
                                    onPress={handleSkip}
                                    className="w-16 h-16 bg-surface rounded-full items-center justify-center border border-gray-700"
                                >
                                    <Ionicons name="close" size={32} color={Colors.race} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={handleConnect}
                                    className="w-20 h-20 rounded-full items-center justify-center"
                                    style={{ backgroundColor: mode === 'race' ? Colors.race : Colors.fun }}
                                >
                                    <Ionicons name="heart" size={40} color="white" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="w-16 h-16 bg-surface rounded-full items-center justify-center border border-gray-700"
                                >
                                    <Ionicons name="star" size={28} color={Colors.secondary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            </Modal>
        </View>
    );
}
