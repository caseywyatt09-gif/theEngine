import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/useAppStore';
import { Colors } from '../../constants/Colors';

// Mock data
const MOCK_USER = {
    displayName: "Alex Runner",
    username: "@alexruns",
    avatarUrl: null,
    bio: "Marathon enthusiast. Chasing the sub-3.",
};

const MOCK_STATS = {
    vo2Max: 52,
    ftp: 280,
    weeklyVolume: 12,
    racePBs: {
        "5K": "18:45",
        "10K": "39:30",
        "Half": "1:28:00",
        "Full": "3:15:00",
    },
};

const MOCK_FUN_STATS = {
    workoutsThisMonth: 18,
    friendsConnected: 47,
    groupRuns: 12,
    highFives: 234,
};

export default function ProfileScreen() {
    const { mode, toggleMode } = useAppStore();

    return (
        <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingBottom: 100 }}>
            <View className="pt-16 px-6">
                {/* Header with Mode Toggle */}
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-3xl font-bold text-white tracking-tighter">PROFILE</Text>
                    <TouchableOpacity
                        onPress={toggleMode}
                        className={`px-4 py-2 rounded-full flex-row items-center gap-2 ${mode === 'race' ? 'bg-race' : 'bg-fun'}`}
                    >
                        <Text className={`font-bold text-xs ${mode === 'race' ? 'text-white' : 'text-background'}`}>
                            {mode === 'race' ? '🏁 RACE' : '🎉 FUN'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Avatar & Name */}
                <View className="items-center mb-8">
                    <View className={`w-28 h-28 rounded-full items-center justify-center mb-4 border-4 ${mode === 'race' ? 'bg-race/20 border-race' : 'bg-fun/20 border-fun'}`}>
                        <Ionicons name="person" size={48} color={mode === 'race' ? Colors.race : Colors.fun} />
                    </View>
                    <Text className="text-2xl font-bold text-white">{MOCK_USER.displayName}</Text>
                    <Text className="text-textDim">{MOCK_USER.username}</Text>
                    <Text className="text-gray-400 mt-2 text-center px-8">{MOCK_USER.bio}</Text>
                </View>

                {/* Mode-Specific Stats */}
                {mode === 'race' ? (
                    <>
                        {/* Performance Metrics */}
                        <View className="bg-surface rounded-2xl p-6 mb-4 border border-race/30">
                            <Text className="text-lg font-bold text-white mb-4 flex-row items-center">
                                <Ionicons name="pulse" size={20} color={Colors.race} /> Performance
                            </Text>
                            <View className="flex-row flex-wrap gap-4">
                                <View className="bg-background p-4 rounded-xl flex-1 min-w-[45%]">
                                    <Text className="text-textDim text-xs uppercase">VO2 Max</Text>
                                    <Text className="text-2xl font-bold text-white">{MOCK_STATS.vo2Max}</Text>
                                </View>
                                <View className="bg-background p-4 rounded-xl flex-1 min-w-[45%]">
                                    <Text className="text-textDim text-xs uppercase">FTP</Text>
                                    <Text className="text-2xl font-bold text-white">{MOCK_STATS.ftp}w</Text>
                                </View>
                                <View className="bg-background p-4 rounded-xl flex-1 min-w-[45%]">
                                    <Text className="text-textDim text-xs uppercase">Weekly Vol</Text>
                                    <Text className="text-2xl font-bold text-white">{MOCK_STATS.weeklyVolume}h</Text>
                                </View>
                            </View>
                        </View>

                        {/* Race PBs */}
                        <View className="bg-surface rounded-2xl p-6 border border-gray-800">
                            <Text className="text-lg font-bold text-white mb-4">
                                🏆 Personal Bests
                            </Text>
                            {Object.entries(MOCK_STATS.racePBs).map(([distance, time]) => (
                                <View key={distance} className="flex-row justify-between py-3 border-b border-gray-800">
                                    <Text className="text-gray-400">{distance}</Text>
                                    <Text className="text-white font-bold">{time}</Text>
                                </View>
                            ))}
                        </View>
                    </>
                ) : (
                    <>
                        {/* Fun Stats */}
                        <View className="bg-surface rounded-2xl p-6 mb-4 border border-fun/30">
                            <Text className="text-lg font-bold text-white mb-4">
                                🎉 Fun Stats
                            </Text>
                            <View className="flex-row flex-wrap gap-4">
                                <View className="bg-background p-4 rounded-xl flex-1 min-w-[45%]">
                                    <Text className="text-textDim text-xs uppercase">Workouts</Text>
                                    <Text className="text-2xl font-bold text-white">{MOCK_FUN_STATS.workoutsThisMonth}</Text>
                                    <Text className="text-fun text-xs">This month</Text>
                                </View>
                                <View className="bg-background p-4 rounded-xl flex-1 min-w-[45%]">
                                    <Text className="text-textDim text-xs uppercase">Friends</Text>
                                    <Text className="text-2xl font-bold text-white">{MOCK_FUN_STATS.friendsConnected}</Text>
                                </View>
                                <View className="bg-background p-4 rounded-xl flex-1 min-w-[45%]">
                                    <Text className="text-textDim text-xs uppercase">Group Runs</Text>
                                    <Text className="text-2xl font-bold text-white">{MOCK_FUN_STATS.groupRuns}</Text>
                                </View>
                                <View className="bg-background p-4 rounded-xl flex-1 min-w-[45%]">
                                    <Text className="text-textDim text-xs uppercase">High Fives</Text>
                                    <Text className="text-2xl font-bold text-white">{MOCK_FUN_STATS.highFives}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Social Activity */}
                        <View className="bg-surface rounded-2xl p-6 border border-gray-800">
                            <Text className="text-lg font-bold text-white mb-4">
                                Recent Activity
                            </Text>
                            <Text className="text-gray-400">Your latest social posts will appear here.</Text>
                        </View>
                    </>
                )}

                {/* Edit Profile Button */}
                <TouchableOpacity className="mt-6 bg-surface py-4 rounded-xl items-center border border-gray-800">
                    <Text className="text-white font-bold">Edit Profile</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
