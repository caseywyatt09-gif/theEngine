import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Athlete } from '../../data/mockAthletes';
import { useAppStore } from '../../store/useAppStore';
import { Colors } from '../../constants/Colors';

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = Math.min(height * 0.65, 500);

interface MatchCardProps {
    athlete: Athlete;
    onSkip: () => void;
    onConnect: () => void;
    onSuperLike?: () => void;
}

export function MatchCard({ athlete, onSkip, onConnect, onSuperLike }: MatchCardProps) {
    const { mode } = useAppStore();
    const accentColor = mode === 'race' ? Colors.race : Colors.fun;

    return (
        <View
            className="rounded-3xl overflow-hidden relative"
            style={{ height: CARD_HEIGHT, width: '100%' }}
        >
            {/* Full Bleed Photo */}
            <Image
                source={athlete.avatar}
                className="absolute inset-0 w-full h-full"
                resizeMode="cover"
            />

            {/* Gradient Overlay */}
            <LinearGradient
                colors={['transparent', 'transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.95)']}
                locations={[0, 0.4, 0.7, 1]}
                className="absolute inset-0"
            />

            {/* Top Right - Scroll Up Icon */}
            <TouchableOpacity className="absolute top-4 right-4 bg-black/30 p-2 rounded-full">
                <Ionicons name="arrow-up" size={20} color="white" />
            </TouchableOpacity>

            {/* Bottom Content */}
            <View className="absolute bottom-0 left-0 right-0 p-5">
                {/* Name & Age */}
                <View className="flex-row items-center gap-3 mb-2">
                    <Text className="text-3xl font-bold text-white">{athlete.displayName}</Text>
                    {athlete.age && <Text className="text-2xl text-white">{athlete.age}</Text>}
                    <View
                        className="w-3 h-3 rounded-full ml-1"
                        style={{ backgroundColor: Colors.fun }}
                    />
                </View>

                {/* Interest Tags */}
                <View className="flex-row flex-wrap gap-2 mb-3">
                    {mode === 'race' ? (
                        <>
                            {athlete.racePace && (
                                <View className="bg-white/20 px-3 py-1.5 rounded-full border border-white/30">
                                    <Text className="text-white text-sm">{athlete.racePace}</Text>
                                </View>
                            )}
                            {athlete.upcomingRace && (
                                <View className="bg-white/20 px-3 py-1.5 rounded-full border border-white/30">
                                    <Text className="text-white text-sm">{athlete.upcomingRace}</Text>
                                </View>
                            )}
                            {athlete.vo2Max && (
                                <View className="bg-white/20 px-3 py-1.5 rounded-full border border-white/30">
                                    <Text className="text-white text-sm">VO2: {athlete.vo2Max}</Text>
                                </View>
                            )}
                        </>
                    ) : (
                        <>
                            {athlete.vibeCheck && (
                                <View className="bg-white/20 px-3 py-1.5 rounded-full border border-white/30">
                                    <Text className="text-white text-sm">{athlete.vibeCheck}</Text>
                                </View>
                            )}
                            {athlete.favoriteActivities?.slice(0, 2).map((activity) => (
                                <View key={activity} className="bg-white/20 px-3 py-1.5 rounded-full border border-white/30">
                                    <Text className="text-white text-sm">{activity}</Text>
                                </View>
                            ))}
                        </>
                    )}
                </View>

                {/* Bio */}
                <Text className="text-gray-300 text-sm leading-5 mb-5" numberOfLines={3}>
                    {athlete.bio}
                </Text>

                {/* Action Buttons */}
                <View className="flex-row justify-center items-center gap-4">
                    {/* Refresh */}
                    <TouchableOpacity className="w-12 h-12 bg-surface rounded-full items-center justify-center border border-gray-700">
                        <Ionicons name="refresh" size={22} color="#FFB800" />
                    </TouchableOpacity>

                    {/* Skip */}
                    <TouchableOpacity
                        onPress={onSkip}
                        className="w-14 h-14 bg-surface rounded-full items-center justify-center border border-gray-700"
                    >
                        <Ionicons name="close" size={28} color={Colors.race} />
                    </TouchableOpacity>

                    {/* Connect (Heart) */}
                    <TouchableOpacity
                        onPress={onConnect}
                        className="w-16 h-16 rounded-full items-center justify-center"
                        style={{ backgroundColor: accentColor }}
                    >
                        <Ionicons name="heart" size={32} color="white" />
                    </TouchableOpacity>

                    {/* Super Like (Star) */}
                    <TouchableOpacity
                        onPress={onSuperLike}
                        className="w-14 h-14 bg-surface rounded-full items-center justify-center border border-gray-700"
                    >
                        <Ionicons name="star" size={24} color="#00D4FF" />
                    </TouchableOpacity>

                    {/* Message */}
                    <TouchableOpacity className="w-12 h-12 bg-surface rounded-full items-center justify-center border border-gray-700">
                        <Ionicons name="chatbubble" size={20} color="#A855F7" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Mode Badge */}
            <View
                className="absolute top-4 left-4 px-3 py-1.5 rounded-full"
                style={{ backgroundColor: athlete.currentMode === 'race' ? Colors.race : Colors.fun }}
            >
                <Text className="text-xs font-bold text-white">
                    {athlete.currentMode === 'race' ? '🏁 RACE MODE' : '🎉 FUN MODE'}
                </Text>
            </View>
        </View>
    );
}
