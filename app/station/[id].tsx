import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '../../components/common/ThemedView';
import { ThemedText } from '../../components/common/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { STATION_DATA } from '../../components/training/stationWorkouts';
import { Colors } from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

export default function StationDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    // Convert id to number
    const stationId = parseInt(Array.isArray(id) ? id[0] : id);
    const station = STATION_DATA.find(s => s.id === stationId);

    if (!station) {
        return (
            <ThemedView className="flex-1 justify-center items-center">
                <ThemedText>Station not found.</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Header Image */}
            <View className="relative h-56 w-full">
                <Image source={station.image} className="w-full h-full" resizeMode="cover" />
                <View className="absolute inset-0 bg-black/50" />
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="absolute top-12 left-6 bg-black/50 p-2 rounded-full border border-white/20"
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View className="absolute bottom-6 left-6">
                    <ThemedText className="text-3xl font-bold text-white uppercase tracking-tighter">{station.name}</ThemedText>
                    <ThemedText className="text-primary font-bold text-sm tracking-widest uppercase">{station.description}</ThemedText>
                </View>
            </View>

            {/* Video Workouts Grid */}
            <View className="p-4">
                <ThemedText className="text-xl font-bold mb-4 text-white uppercase tracking-tight">WORKOUT VIDEOS</ThemedText>

                <View className="flex-row flex-wrap gap-4">
                    {station.workouts.map((workout) => (
                        <TouchableOpacity
                            key={workout.id}
                            className="w-[47%] h-40 rounded-xl overflow-hidden relative bg-gray-900 border border-gray-800"
                            activeOpacity={0.8}
                            onPress={() => alert(`Playing: ${workout.title}`)}
                        >
                            {/* Use parent station image with overlay as video thumbnail preview */}
                            <Image source={station.image} className="w-full h-full opacity-70" resizeMode="cover" />
                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.9)']}
                                className="absolute inset-0 z-10"
                            />

                            {/* Play Button */}
                            <View className="absolute inset-0 z-20 justify-center items-center">
                                <View className="w-12 h-12 bg-primary/90 rounded-full justify-center items-center shadow-lg">
                                    <Ionicons name="play" size={24} color="black" style={{ marginLeft: 3 }} />
                                </View>
                            </View>

                            {/* Intensity Badge */}
                            <View className={`absolute top-2 right-2 z-30 px-2 py-1 rounded ${workout.intensity === 'High' ? 'bg-red-500' : workout.intensity === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'}`}>
                                <ThemedText className="text-[10px] font-bold text-black uppercase">{workout.intensity}</ThemedText>
                            </View>

                            {/* Title & Duration */}
                            <View className="absolute bottom-0 left-0 right-0 p-3 z-20">
                                <ThemedText className="font-bold text-white text-sm leading-5" numberOfLines={1}>{workout.title}</ThemedText>
                                <View className="flex-row items-center gap-1 mt-1">
                                    <Ionicons name="time-outline" size={10} color="#999" />
                                    <ThemedText className="text-gray-400 text-xs">{workout.duration}</ThemedText>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}
