import { View, Image, ImageSourcePropType, Dimensions } from 'react-native';
import { ThemedText } from '../common/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

const { width } = Dimensions.get('window');
const CARD_HEIGHT = 500;

interface PartnerProfileProps {
    name: string;
    age: number;
    division: string;
    pace: string;
    location: string;
    bio: string;
    verified: boolean;
    avatar: ImageSourcePropType;
    stats: {
        run: string;
        sled: string;
    };
}

export function PartnerProfileCard({ name, age, division, pace, location, bio, verified, avatar, stats }: PartnerProfileProps) {
    return (
        <View className="mb-4 rounded-3xl overflow-hidden bg-surface shadow-2xl border border-gray-800" style={{ height: CARD_HEIGHT, width: width - 48 }}>
            {/* Full Image Background */}
            <View className="absolute inset-0 z-0 bg-gray-900">
                <Image source={avatar} className="w-full h-full" resizeMode="cover" />
                {/* Gradient Overlay */}
                <View className="absolute inset-0 bg-black/20" />
                <View className="absolute bottom-0 w-full h-3/4 bg-gradient-to-t from-black via-black/90 to-transparent" />
            </View>

            {/* Content Overlay */}
            <View className="flex-1 justify-end p-6 pb-8 z-10">
                {/* Badges */}
                <View className="flex-row gap-2 mb-3">
                    <View className="bg-primary px-3 py-1 rounded-full self-start shadow-lg shadow-black/50">
                        <ThemedText className="text-black font-extrabold text-xs uppercase">{division}</ThemedText>
                    </View>
                    {verified && (
                        <View className="bg-green-500 px-3 py-1 rounded-full self-start flex-row items-center gap-1 shadow-lg shadow-black/50">
                            <Ionicons name="checkmark-circle" size={12} color="white" />
                            <ThemedText className="text-white font-bold text-xs uppercase">Verified</ThemedText>
                        </View>
                    )}
                </View>

                {/* Name & Age */}
                <View className="flex-row items-baseline gap-2 mb-1">
                    <ThemedText className="text-4xl font-bold text-white tracking-tight shadow-black shadow-md">{name}</ThemedText>
                    <ThemedText className="text-2xl text-gray-300 font-light shadow-black shadow-md">{age}</ThemedText>
                </View>

                {/* Location */}
                <View className="flex-row items-center gap-1 mb-4">
                    <Ionicons name="location-sharp" size={16} color={Colors.primary} />
                    <ThemedText className="text-gray-300 font-medium shadow-black shadow-sm">{location}</ThemedText>
                </View>

                {/* Stats Grid */}
                <View className="flex-row justify-between bg-white/10 p-3 rounded-xl mb-4 backdrop-blur-md border border-white/10">
                    <View>
                        <ThemedText className="text-[10px] text-gray-300 uppercase tracking-wider">Target Pace</ThemedText>
                        <ThemedText className="text-white font-bold text-lg">{pace}</ThemedText>
                    </View>
                    <View className="w-[1px] bg-white/20 h-full" />
                    <View>
                        <ThemedText className="text-[10px] text-gray-300 uppercase tracking-wider">1km Run</ThemedText>
                        <ThemedText className="text-white font-bold text-lg">{stats.run}</ThemedText>
                    </View>
                    <View className="w-[1px] bg-white/20 h-full" />
                    <View>
                        <ThemedText className="text-[10px] text-gray-300 uppercase tracking-wider">Sled</ThemedText>
                        <ThemedText className="text-white font-bold text-lg">{stats.sled}</ThemedText>
                    </View>
                </View>

                {/* Bio */}
                <ThemedText className="text-gray-300 text-sm leading-5 shadow-black shadow-sm" numberOfLines={3}>{bio}</ThemedText>
            </View>
        </View>
    );
}
