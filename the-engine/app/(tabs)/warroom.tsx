import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/useAppStore';
import { Colors } from '../../constants/Colors';

export default function WarRoomScreen() {
    const { mode } = useAppStore();

    return (
        <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingBottom: 100 }}>
            <View className="pt-16 px-6">
                {/* Header */}
                <View className="mb-6">
                    <Text className="text-3xl font-bold text-white tracking-tighter">WAR ROOM</Text>
                    <Text className="text-textDim text-xs uppercase tracking-widest mt-1">
                        {mode === 'race' ? 'Battle Station Active' : 'Training Mode'}
                    </Text>
                </View>

                {/* Training Plans */}
                <View className="bg-surface rounded-2xl p-6 mb-4 border border-gray-800">
                    <View className="flex-row items-center gap-3 mb-4">
                        <Ionicons name="calendar" size={24} color={Colors.primary} />
                        <Text className="text-xl font-bold text-white">Training Plans</Text>
                    </View>
                    <Text className="text-gray-400">
                        {mode === 'race'
                            ? 'Structured periodization for peak performance.'
                            : 'Flexible routines to keep you moving.'}
                    </Text>
                </View>

                {/* Race Prep */}
                {mode === 'race' && (
                    <View className="bg-surface rounded-2xl p-6 mb-4 border border-race/30">
                        <View className="flex-row items-center gap-3 mb-4">
                            <Ionicons name="flag" size={24} color={Colors.race} />
                            <Text className="text-xl font-bold text-white">Race Prep</Text>
                        </View>
                        <Text className="text-gray-400">
                            Countdown timers, taper protocols, and race day checklists.
                        </Text>
                    </View>
                )}

                {/* Analytics */}
                <View className="bg-surface rounded-2xl p-6 border border-gray-800">
                    <View className="flex-row items-center gap-3 mb-4">
                        <Ionicons name="analytics" size={24} color={Colors.secondary} />
                        <Text className="text-xl font-bold text-white">Analytics</Text>
                    </View>
                    <Text className="text-gray-400">
                        {mode === 'race'
                            ? 'VO2 Max trends, FTP tracking, and race predictions.'
                            : 'Activity streaks, workout history, and fun stats.'}
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}
