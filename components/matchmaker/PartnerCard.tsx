import { View, Image, ImageSourcePropType } from 'react-native';
import { ThemedView } from '../common/ThemedView';
import { ThemedText } from '../common/ThemedText';
import { Button } from '../common/Button';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

interface PartnerProps {
    name: string;
    division: string;
    pace: string;
    location: string;
    verified: boolean;
    avatar: ImageSourcePropType;
}

export function PartnerCard({ name, division, pace, location, verified, avatar }: PartnerProps) {
    return (
        <ThemedView className="bg-surface p-4 rounded-xl mb-4 border border-gray-800 shadow-sm">
            <View className="flex-row gap-4 mb-4">
                {/* Avatar */}
                <View className="w-16 h-16 rounded-full overflow-hidden bg-gray-700">
                    <Image source={avatar} className="w-full h-full" resizeMode="cover" />
                </View>

                {/* Info */}
                <View className="flex-1">
                    <View className="flex-row justify-between items-start">
                        <View>
                            <View className="flex-row items-center gap-2">
                                <ThemedText className="text-lg font-bold text-white">{name}</ThemedText>
                                {verified && <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />}
                            </View>
                            <ThemedText className="text-textDim text-sm">{location}</ThemedText>
                        </View>
                        <View className="bg-gray-800 px-2 py-1 rounded">
                            <ThemedText className="text-xs font-bold text-primary">{division}</ThemedText>
                        </View>
                    </View>

                    <View className="mt-2 flex-row items-center gap-2">
                        <Ionicons name="speedometer-outline" size={14} color="#AAAAAA" />
                        <ThemedText className="text-xs text-textDim uppercase mr-1">Target Pace</ThemedText>
                        <ThemedText className="font-mono text-white text-sm font-bold">{pace}</ThemedText>
                    </View>
                </View>
            </View>

            <Button title="Connect" variant="outline" className="py-2" />
        </ThemedView>
    );
}
