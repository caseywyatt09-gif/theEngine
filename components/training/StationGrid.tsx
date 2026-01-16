import { View, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '../common/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { STATION_DATA } from './stationWorkouts';

export function StationGrid() {
    const router = useRouter();

    return (
        <View className="mb-8">
            <ThemedText className="text-xl font-bold mb-4 text-white uppercase tracking-tight">Station Mastery Modules</ThemedText>
            <View className="flex-row flex-wrap gap-3">
                {STATION_DATA.map((station) => (
                    <TouchableOpacity
                        key={station.id}
                        className="w-[48%] h-40 rounded-xl overflow-hidden relative shadow-lg bg-gray-900 border border-gray-800"
                        activeOpacity={0.8}
                        onPress={() => router.push(`/station/${station.id}`)}
                    >
                        <Image source={station.image} className="w-full h-full opacity-60" resizeMode="cover" />
                        <LinearGradient
                            colors={['transparent', '#000000']}
                            className="absolute inset-0 z-10"
                        />
                        <View className="absolute bottom-0 left-0 right-0 p-3 z-20">
                            <ThemedText className="font-bold text-white text-lg leading-5">{station.name}</ThemedText>
                            <ThemedText className="text-primary text-xs font-bold uppercase mt-1">{station.description}</ThemedText>
                        </View>
                        <View className="absolute top-2 right-2 bg-black/50 p-1 rounded-full z-20 border border-white/20">
                            <Ionicons name="play" size={12} color="white" />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}
