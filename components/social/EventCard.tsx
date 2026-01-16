import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Event } from '../../data/mockEvents';

interface EventCardProps {
    event: Event;
    onPress?: () => void;
}

export function EventCard({ event, onPress }: EventCardProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="w-44 mr-3 rounded-2xl overflow-hidden"
            activeOpacity={0.9}
        >
            {/* Gradient Background */}
            <LinearGradient
                colors={[event.color, `${event.color}99`, `${event.color}55`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="h-28 p-3 justify-between"
            >
                {/* Emoji */}
                <Text className="text-3xl">{event.emoji}</Text>

                {/* Date Badge */}
                <View className="bg-black/30 self-start px-2 py-1 rounded-full">
                    <Text className="text-white text-[10px] font-medium">{event.date}</Text>
                </View>
            </LinearGradient>

            {/* Info */}
            <View className="bg-surface p-3">
                <Text className="text-white font-bold text-sm" numberOfLines={1}>
                    {event.name}
                </Text>
                <Text className="text-textDim text-xs mt-0.5" numberOfLines={1}>
                    {event.location}
                </Text>

                {/* Attendees */}
                <View className="flex-row items-center mt-2">
                    <Ionicons name="people" size={12} color="#666" />
                    <Text className="text-textDim text-xs ml-1">
                        {event.attendees} athletes
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
