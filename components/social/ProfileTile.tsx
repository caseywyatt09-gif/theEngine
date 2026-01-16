import { View, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Athlete } from '../../data/mockAthletes';
import { Colors } from '../../constants/Colors';

interface ProfileTileProps {
    athlete: Athlete;
    onPress: () => void;
}

export function ProfileTile({ athlete, onPress }: ProfileTileProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-1 aspect-[3/4] rounded-2xl overflow-hidden m-1.5"
            style={{ minWidth: '45%' }}
            activeOpacity={0.9}
        >
            {/* Photo */}
            <Image
                source={athlete.avatar}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    height: '100%',
                }}
                resizeMode="cover"
            />

            {/* Gradient Overlay */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
                locations={[0.3, 0.7, 1]}
                className="absolute inset-0"
            />

            {/* Active Indicator */}
            {athlete.isActive && (
                <View className="absolute top-2 right-2 flex-row items-center gap-1 bg-black/40 px-2 py-1 rounded-full">
                    <View className="w-2 h-2 rounded-full bg-green-500" />
                    <Text className="text-white text-[10px]">Active</Text>
                </View>
            )}

            {/* Star Badge (for recommended) */}
            {athlete.vo2Max && athlete.vo2Max > 55 && (
                <View
                    className="absolute top-2 left-2 w-6 h-6 rounded-full items-center justify-center"
                    style={{ backgroundColor: Colors.secondary }}
                >
                    <Text className="text-[10px]">⭐</Text>
                </View>
            )}

            {/* Bottom Content */}
            <View className="absolute bottom-0 left-0 right-0 p-3">
                <View className="flex-row items-center gap-1.5">
                    <Text className="text-white font-bold text-base" numberOfLines={1}>
                        {athlete.displayName.split(' ')[0]}
                    </Text>
                    {athlete.age && (
                        <Text className="text-white text-sm">{athlete.age}</Text>
                    )}
                </View>
                <Text className="text-gray-400 text-xs mt-0.5" numberOfLines={1}>
                    {athlete.location}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

