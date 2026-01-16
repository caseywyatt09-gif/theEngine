import { View, Text, ScrollView, TouchableOpacity, Modal, Alert, Image, Dimensions, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Slider from '@react-native-community/slider';
import { useAppStore } from '../../store/useAppStore';
import { Colors } from '../../constants/Colors';
import { ProfileTile } from '../../components/social/ProfileTile';
import { SwipeableCard } from '../../components/social/SwipeableCard';
import MatchCelebration from '../../components/social/MatchCelebration';
import { EventCard } from '../../components/events/EventCard';
import { RegistrationModal } from '../../components/events/RegistrationModal';
import { EventGuestList } from '../../components/events/EventGuestList';
import { Attendee } from '../../components/events/FacePile';
import { MOCK_ATHLETES, Athlete } from '../../data/mockAthletes';
import { MOCK_EVENTS, POPULAR_CITIES, HYROX_EVENTS, HyroxEvent, HyroxCategory } from '../../data/mockEvents';
import { getMatchHint } from '../../data/mockMatchHints';

const { height, width } = Dimensions.get('window');

// Generate mock attendees for face piles
const generateMockAttendees = (count: number): Attendee[] => {
    return MOCK_ATHLETES.slice(0, count).map(a => ({
        id: a.id,
        avatar_url: null, // Will use placeholder
        displayName: a.displayName,
    }));
};

export default function SocialScreen() {
    const router = useRouter();
    const { mode, toggleMode, hasCompletedOnboarding } = useAppStore();
    const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
    const [matches, setMatches] = useState<Athlete[]>([]);
    const [activeTab, setActiveTab] = useState<'swipe' | 'nearby' | 'events'>('swipe');
    const [showFilters, setShowFilters] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [swipeHistory, setSwipeHistory] = useState<number[]>([]);
    const [showMatchCelebration, setShowMatchCelebration] = useState(false);
    const [matchedAthlete, setMatchedAthlete] = useState<Athlete | null>(null);

    // Events state
    const [hyroxEvents, setHyroxEvents] = useState<HyroxEvent[]>(HYROX_EVENTS);
    const [selectedEvent, setSelectedEvent] = useState<HyroxEvent | null>(null);
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [showGuestList, setShowGuestList] = useState(false);
    const [eventsFilter, setEventsFilter] = useState<'all' | 'registered' | 'upcoming'>('all');

    // Filter preferences
    const [maxDistance, setMaxDistance] = useState(25);
    const [ageRange, setAgeRange] = useState({ min: 20, max: 45 });
    const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

    // Filter athletes based on preferences
    const filteredAthletes = MOCK_ATHLETES.filter(a => {
        const distance = parseInt(a.location.split(' ')[0]) || 0;
        const age = a.age || 25;
        return distance <= maxDistance && age >= ageRange.min && age <= ageRange.max;
    });

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
            <View className="pt-14 px-5 pb-3 border-b border-gray-900">
                <View className="flex-row justify-between items-center">
                    <View>
                        <Text className="text-2xl font-bold text-white tracking-tighter">MATCH</Text>
                        <View className="flex-row items-center gap-2 mt-1">
                            <View className={`w-2 h-2 rounded-full ${mode === 'race' ? 'bg-race' : 'bg-fun'}`} />
                            <Text className="text-textDim text-xs uppercase tracking-widest">
                                {mode === 'race' ? 'Race Mode' : 'Fun Mode'}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center gap-3">
                        <TouchableOpacity
                            onPress={toggleMode}
                            className={`px-3 py-1.5 rounded-full ${mode === 'race' ? 'bg-race' : 'bg-fun'}`}
                        >
                            <Text className={`font-bold text-xs ${mode === 'race' ? 'text-white' : 'text-background'}`}>
                                {mode === 'race' ? '🏁 RACE' : '🎉 FUN'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowFilters(true)}>
                            <Ionicons name="options-outline" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name="chatbubbles-outline" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Tabs - Simplified to 3 */}
            <View className="flex-row px-4 mb-3 gap-2">
                <TouchableOpacity
                    onPress={() => setActiveTab('swipe')}
                    className={`flex-1 py-2.5 rounded-full ${activeTab === 'swipe' ? (mode === 'race' ? 'bg-race' : 'bg-fun') : 'bg-surface'}`}
                >
                    <Text className={`text-center text-sm font-semibold ${activeTab === 'swipe' ? (mode === 'race' ? 'text-white' : 'text-background') : 'text-textDim'}`}>
                        Swipe
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab('nearby')}
                    className={`flex-1 py-2.5 rounded-full ${activeTab === 'nearby' ? (mode === 'race' ? 'bg-race' : 'bg-fun') : 'bg-surface'}`}
                >
                    <Text className={`text-center text-sm font-semibold ${activeTab === 'nearby' ? (mode === 'race' ? 'text-white' : 'text-background') : 'text-textDim'}`}>
                        Nearby
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab('events')}
                    className={`flex-1 py-2.5 rounded-full ${activeTab === 'events' ? (mode === 'race' ? 'bg-race' : 'bg-fun') : 'bg-surface'}`}
                >
                    <Text className={`text-center text-sm font-semibold ${activeTab === 'events' ? (mode === 'race' ? 'text-white' : 'text-background') : 'text-textDim'}`}>
                        Events
                    </Text>
                </TouchableOpacity>
            </View>

            {activeTab === 'swipe' ? (
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <View style={styles.swipeContainer}>
                        {filteredAthletes.length > 0 && currentCardIndex < filteredAthletes.length ? (
                            <>
                                {/* Background card */}
                                {currentCardIndex + 1 < filteredAthletes.length && (
                                    <View style={[styles.cardPlaceholder, { transform: [{ scale: 0.95 }], opacity: 0.5 }]}>
                                        <Image
                                            source={filteredAthletes[currentCardIndex + 1].avatar}
                                            style={styles.placeholderImage}
                                            resizeMode="cover"
                                        />
                                    </View>
                                )}
                                {/* Active card */}
                                <SwipeableCard
                                    key={filteredAthletes[currentCardIndex].id}
                                    athlete={filteredAthletes[currentCardIndex]}
                                    mode={mode}
                                    matchHint={getMatchHint(filteredAthletes[currentCardIndex].id, filteredAthletes[currentCardIndex].favoriteActivities)}
                                    onSwipeLeft={() => {
                                        setSwipeHistory(prev => [...prev, currentCardIndex]);
                                        setCurrentCardIndex(prev => prev + 1);
                                    }}
                                    onSwipeRight={() => {
                                        const athlete = filteredAthletes[currentCardIndex];
                                        setMatches(prev => [...prev, athlete]);
                                        setMatchedAthlete(athlete);
                                        setShowMatchCelebration(true);
                                        setSwipeHistory(prev => [...prev, currentCardIndex]);
                                        setCurrentCardIndex(prev => prev + 1);
                                    }}
                                    onSuperLike={() => {
                                        const athlete = filteredAthletes[currentCardIndex];
                                        setMatches(prev => [...prev, athlete]);
                                        setMatchedAthlete(athlete);
                                        setShowMatchCelebration(true);
                                        setSwipeHistory(prev => [...prev, currentCardIndex]);
                                        setCurrentCardIndex(prev => prev + 1);
                                    }}
                                />
                                {/* Rewind Button */}
                                {swipeHistory.length > 0 && (
                                    <TouchableOpacity
                                        style={styles.rewindButton}
                                        onPress={() => {
                                            const lastIndex = swipeHistory[swipeHistory.length - 1];
                                            setSwipeHistory(prev => prev.slice(0, -1));
                                            setCurrentCardIndex(lastIndex);
                                        }}
                                    >
                                        <Ionicons name="arrow-undo" size={24} color="#FFD700" />
                                    </TouchableOpacity>
                                )}
                            </>
                        ) : (
                            <View style={styles.noMoreCards}>
                                <Ionicons name="heart-half" size={80} color={Colors.textDim} />
                                <Text style={styles.noMoreText}>No more athletes nearby</Text>
                                <TouchableOpacity
                                    style={[styles.resetButton, { backgroundColor: mode === 'race' ? Colors.race : Colors.fun }]}
                                    onPress={() => {
                                        setCurrentCardIndex(0);
                                        setSwipeHistory([]);
                                    }}
                                >
                                    <Text style={styles.resetButtonText}>Start Over</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </GestureHandlerRootView>
            ) : (
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 8 }}
                    showsVerticalScrollIndicator={false}
                >
                    {activeTab === 'nearby' && (
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

                            {/* Nearby Athletes Header */}
                            <View className="flex-row justify-between items-center px-2 mt-6 mb-3">
                                <Text className="text-white font-bold text-lg">Near You</Text>
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

                    {activeTab === 'events' && (
                        <>
                            {/* Filter Pills */}
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                className="mb-4"
                                contentContainerStyle={{ paddingHorizontal: 8 }}
                            >
                                {[
                                    { key: 'all', label: 'All Events', icon: 'calendar' },
                                    { key: 'registered', label: 'My Events', icon: 'ticket' },
                                    { key: 'upcoming', label: 'Coming Soon', icon: 'time' },
                                ].map((filter) => (
                                    <TouchableOpacity
                                        key={filter.key}
                                        onPress={() => setEventsFilter(filter.key as any)}
                                        className={`flex-row items-center gap-2 px-4 py-2 rounded-full mr-2 ${eventsFilter === filter.key
                                            ? (mode === 'race' ? 'bg-race' : 'bg-fun')
                                            : 'bg-surface border border-gray-700'
                                            }`}
                                    >
                                        <Ionicons
                                            name={filter.icon as any}
                                            size={16}
                                            color={eventsFilter === filter.key ? 'white' : Colors.textDim}
                                        />
                                        <Text className={`text-sm font-medium ${eventsFilter === filter.key ? 'text-white' : 'text-textDim'
                                            }`}>
                                            {filter.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            {/* Events Header */}
                            <View className="flex-row justify-between items-center px-2 mb-4">
                                <View>
                                    <Text className="text-white font-bold text-xl">HYROX 2026</Text>
                                    <Text className="text-textDim text-sm">
                                        {hyroxEvents.filter(e => e.userRegistration).length} registered • {hyroxEvents.length} events
                                    </Text>
                                </View>
                                <TouchableOpacity className="bg-surface px-3 py-2 rounded-full flex-row items-center gap-2">
                                    <Ionicons name="globe-outline" size={16} color={Colors.textDim} />
                                    <Text className="text-textDim text-sm">Worldwide</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Event Cards */}
                            <View className="px-2">
                                {hyroxEvents
                                    .filter(event => {
                                        if (eventsFilter === 'registered') return !!event.userRegistration;
                                        if (eventsFilter === 'upcoming') return event.status === 'upcoming';
                                        return true;
                                    })
                                    .map((event, idx) => (
                                        <EventCard
                                            key={event.id}
                                            event={event}
                                            attendees={generateMockAttendees(3 + Math.floor(idx * 1.5))}
                                            onPress={() => {
                                                setSelectedEvent(event);
                                                setShowGuestList(true);
                                            }}
                                            onRegister={() => {
                                                setSelectedEvent(event);
                                                setShowRegistrationModal(true);
                                            }}
                                        />
                                    ))
                                }
                            </View>

                            {/* Cities Section */}
                            <View className="px-2 mt-6 mb-3">
                                <Text className="text-white font-bold text-lg">Explore Cities</Text>
                                <Text className="text-textDim text-sm">Connect with athletes in other cities</Text>
                            </View>

                            {/* Popular Cities Grid */}
                            <View className="flex-row flex-wrap px-1">
                                {POPULAR_CITIES.map((city) => (
                                    <View key={city.id} className="w-1/2 p-1">
                                        <TouchableOpacity
                                            className="rounded-2xl overflow-hidden"
                                            onPress={() => router.push(`/city/${city.id}`)}
                                        >
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
                                            {/* I'm Visiting Button */}
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
            )
            }



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
                            style={{ objectFit: 'cover', objectPosition: 'top' } as any}
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

            {/* Filter Modal */}
            <Modal
                visible={showFilters}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View className="flex-1 bg-background pt-6">
                    <View className="flex-row justify-between items-center px-6 pb-4 border-b border-gray-800">
                        <TouchableOpacity onPress={() => setShowFilters(false)}>
                            <Text className="text-textDim text-lg">Cancel</Text>
                        </TouchableOpacity>
                        <Text className="text-white font-bold text-lg">Preferences</Text>
                        <TouchableOpacity onPress={() => setShowFilters(false)}>
                            <Text className="text-primary font-bold text-lg">Done</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="flex-1 px-6 pt-6">
                        {/* Distance */}
                        <View className="mb-8">
                            <View className="flex-row justify-between mb-2">
                                <Text className="text-white font-bold text-lg">Maximum Distance</Text>
                                <Text className="text-primary font-bold">{maxDistance} mi</Text>
                            </View>
                            <Slider
                                style={{ width: '100%', height: 40 }}
                                minimumValue={1}
                                maximumValue={50}
                                value={maxDistance}
                                onValueChange={(val: number) => setMaxDistance(Math.round(val))}
                                minimumTrackTintColor={Colors.primary}
                                maximumTrackTintColor="#333"
                                thumbTintColor={Colors.primary}
                            />
                        </View>

                        {/* Age Range */}
                        <View className="mb-8">
                            <View className="flex-row justify-between mb-2">
                                <Text className="text-white font-bold text-lg">Age Range</Text>
                                <Text className="text-primary font-bold">{ageRange.min} - {ageRange.max}</Text>
                            </View>
                            <View className="mb-4">
                                <Text className="text-textDim text-sm mb-1">Minimum: {ageRange.min}</Text>
                                <Slider
                                    style={{ width: '100%', height: 40 }}
                                    minimumValue={18}
                                    maximumValue={60}
                                    value={ageRange.min}
                                    onValueChange={(val: number) => setAgeRange(prev => ({ ...prev, min: Math.round(val) }))}
                                    minimumTrackTintColor={Colors.primary}
                                    maximumTrackTintColor="#333"
                                    thumbTintColor={Colors.primary}
                                />
                            </View>
                            <View>
                                <Text className="text-textDim text-sm mb-1">Maximum: {ageRange.max}</Text>
                                <Slider
                                    style={{ width: '100%', height: 40 }}
                                    minimumValue={18}
                                    maximumValue={60}
                                    value={ageRange.max}
                                    onValueChange={(val: number) => setAgeRange(prev => ({ ...prev, max: Math.round(val) }))}
                                    minimumTrackTintColor={Colors.primary}
                                    maximumTrackTintColor="#333"
                                    thumbTintColor={Colors.primary}
                                />
                            </View>
                        </View>

                        {/* Activity Types */}
                        <View className="mb-8">
                            <Text className="text-white font-bold text-lg mb-4">Activity Types</Text>
                            <View className="flex-row flex-wrap gap-3">
                                {['Running', 'Cycling', 'CrossFit', 'Swimming', 'Trail', 'Yoga', 'HIIT'].map((activity) => {
                                    const isSelected = selectedActivities.includes(activity);
                                    return (
                                        <TouchableOpacity
                                            key={activity}
                                            onPress={() => {
                                                if (isSelected) {
                                                    setSelectedActivities(prev => prev.filter(a => a !== activity));
                                                } else {
                                                    setSelectedActivities(prev => [...prev, activity]);
                                                }
                                            }}
                                            className={`px-4 py-2 rounded-full border ${isSelected ? 'bg-primary border-primary' : 'bg-surface border-gray-700'}`}
                                        >
                                            <Text className={isSelected ? 'text-white font-bold' : 'text-textDim'}>{activity}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        {/* Results Preview */}
                        <View className="bg-surface rounded-2xl p-4 border border-gray-800 mb-6">
                            <Text className="text-textDim text-center">
                                <Text className="text-white font-bold">{filteredAthletes.length}</Text> athletes match your preferences
                            </Text>
                        </View>
                    </ScrollView>
                </View>
            </Modal>

            {/* Match Celebration Modal */}
            {matchedAthlete && (
                <MatchCelebration
                    visible={showMatchCelebration}
                    onClose={() => {
                        setShowMatchCelebration(false);
                        setMatchedAthlete(null);
                    }}
                    onSendMessage={() => {
                        setShowMatchCelebration(false);
                        setMatchedAthlete(null);
                        // TODO: Navigate to chat
                        Alert.alert('Coming Soon', 'Chat feature coming soon!');
                    }}
                    userPhoto={require('../../assets/images/athletes/david.png')}
                    matchPhoto={matchedAthlete.avatar}
                    matchName={matchedAthlete.displayName}
                    matchBio={matchedAthlete.bio}
                />
            )}

            {/* Registration Modal */}
            <RegistrationModal
                visible={showRegistrationModal}
                event={selectedEvent}
                onClose={() => {
                    setShowRegistrationModal(false);
                    setSelectedEvent(null);
                }}
                onComplete={(registration) => {
                    // Update the event with registration info
                    setHyroxEvents(prev => prev.map(e =>
                        e.id === selectedEvent?.id
                            ? {
                                ...e,
                                status: 'registered' as const,
                                userRegistration: {
                                    category: registration.category,
                                    partner: registration.partner,
                                    waveTime: registration.waveTime,
                                    confirmationCode: `HX-${e.city.substring(0, 2).toUpperCase()}-2026-${Math.floor(Math.random() * 9000) + 1000}`,
                                }
                            }
                            : e
                    ));
                    setShowRegistrationModal(false);
                    setSelectedEvent(null);
                    Alert.alert(
                        '🎉 Registration Complete!',
                        `You're registered for ${selectedEvent?.name}! Check your email for confirmation.`,
                        [{ text: 'Awesome!' }]
                    );
                }}
            />

            {/* Event Guest List Modal */}
            <EventGuestList
                visible={showGuestList}
                event={selectedEvent}
                isLoggedIn={hasCompletedOnboarding}
                onClose={() => {
                    setShowGuestList(false);
                    setSelectedEvent(null);
                }}
                onSignUpPrompt={() => {
                    setShowGuestList(false);
                    router.push('/onboarding');
                }}
                onMatch={(athlete) => {
                    Alert.alert(
                        '⚡ Match Request Sent!',
                        `You've sent a match request to ${athlete.displayName} for ${selectedEvent?.name}!`,
                        [{ text: 'Nice!' }]
                    );
                }}
            />
        </View >
    );
}

const styles = StyleSheet.create({
    swipeContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingTop: 20, // Add breathing room from top tabs
    },
    cardPlaceholder: {
        position: 'absolute',
        width: width - 32,
        height: Math.min(height * 0.65, 520),
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#1a1a1a',
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
    },
    noMoreCards: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    noMoreText: {
        color: Colors.textDim,
        fontSize: 18,
        marginTop: 16,
        marginBottom: 24,
    },
    resetButton: {
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 30,
    },
    resetButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    rewindButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFD700',
    },
});
