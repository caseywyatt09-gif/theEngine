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

// Mock Health Stats
const MOCK_HEALTH_STATS = {
    restingHR: 42,
    hrv: 112,
    sleepAvg: '7h 45m',
    recoveryScore: 92,
};

// Mock Weekly Activity
const MOCK_WEEKLY_ACTIVITY = [
    { day: 'M', minutes: 45, strain: 'low' },
    { day: 'T', minutes: 90, strain: 'high' },
    { day: 'W', minutes: 60, strain: 'med' },
    { day: 'T', minutes: 30, strain: 'low' },
    { day: 'F', minutes: 120, strain: 'high' },
    { day: 'S', minutes: 0, strain: 'rest' },
    { day: 'S', minutes: 180, strain: 'high' },
];

// Mock Recent Activity
const MOCK_RECENT_ACTIVITY_ITEMS = [
    { id: 1, type: 'run', title: 'Morning 5K', subtitle: '23:45 · 5.02km', time: '2h ago', icon: 'walk' },
    { id: 2, type: 'workout', title: 'Full Body Hyrox Prep', subtitle: '45m · 320 cal', time: 'Yesterday', icon: 'barbell' },
    { id: 3, type: 'social', title: 'Group Run with @sarah_run', subtitle: 'Social Mode', time: '2d ago', icon: 'people' },
];

export default function ProfileScreen() {
    const { mode, toggleMode } = useAppStore();
    const activeColor = mode === 'race' ? Colors.race : Colors.fun;

    const renderHealthSnapshot = () => (
        <View className="bg-surface rounded-2xl p-6 mb-4 border border-gray-800">
            <Text className="text-lg font-bold text-white mb-4 flex-row items-center">
                <Ionicons name="fitness" size={20} color={activeColor} /> Health Snapshot
            </Text>
            <View className="flex-row justify-between">
                <View className="items-center">
                    <Ionicons name="heart" size={24} color="#FF595E" />
                    <Text className="text-white font-bold text-lg mt-1">{MOCK_HEALTH_STATS.restingHR}</Text>
                    <Text className="text-textDim text-[10px] uppercase">RHR</Text>
                </View>
                <View className="items-center">
                    <Ionicons name="pulse" size={24} color="#1982C4" />
                    <Text className="text-white font-bold text-lg mt-1">{MOCK_HEALTH_STATS.hrv}</Text>
                    <Text className="text-textDim text-[10px] uppercase">HRV</Text>
                </View>
                <View className="items-center">
                    <Ionicons name="moon" size={24} color="#6A4C93" />
                    <Text className="text-white font-bold text-lg mt-1">{MOCK_HEALTH_STATS.sleepAvg}</Text>
                    <Text className="text-textDim text-[10px] uppercase">Sleep</Text>
                </View>
                <View className="items-center">
                    <Ionicons name="battery-charging" size={24} color="#8AC926" />
                    <Text className="text-white font-bold text-lg mt-1">{MOCK_HEALTH_STATS.recoveryScore}%</Text>
                    <Text className="text-textDim text-[10px] uppercase">Recovery</Text>
                </View>
            </View>
        </View>
    );

    const renderActivityGuide = () => (
        <View className={`bg-surface rounded-2xl p-6 mb-4 border ${mode === 'race' ? 'border-race/30' : 'border-fun/30'}`}>
            <Text className="text-lg font-bold text-white mb-4">
                {mode === 'race' ? 'Weekly Workload' : 'Activity Streak'}
            </Text>
            <View className="flex-row items-end justify-between h-32 pb-2">
                {MOCK_WEEKLY_ACTIVITY.map((day, idx) => {
                    const heightPercent = Math.min((day.minutes / 180) * 100, 100);
                    let barColor = '#333';
                    if (day.strain === 'high') barColor = '#FF595E';
                    if (day.strain === 'med') barColor = '#FFCA3A';
                    if (day.strain === 'low') barColor = '#8AC926';
                    if (day.strain === 'rest') barColor = '#1a1a1a';

                    return (
                        <View key={idx} className="items-center gap-2">
                            <View
                                style={{
                                    width: 8,
                                    height: `${Math.max(heightPercent, 5)}%`,
                                    backgroundColor: barColor,
                                    borderRadius: 4
                                }}
                            />
                            <Text className="text-textDim text-xs">{day.day}</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );

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

                {renderHealthSnapshot()}

                {renderActivityGuide()}

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


                        {/* Recent Activity */}
                        <View className="bg-surface rounded-2xl p-6 border border-gray-800">
                            <Text className="text-lg font-bold text-white mb-4">
                                Recent Activity
                            </Text>
                            {MOCK_RECENT_ACTIVITY_ITEMS.map((item, idx) => (
                                <View key={item.id} className={`flex-row items-center gap-4 py-3 ${idx !== MOCK_RECENT_ACTIVITY_ITEMS.length - 1 ? 'border-b border-gray-800' : ''}`}>
                                    <View className="w-10 h-10 rounded-full bg-surfaceHighlight items-center justify-center border border-gray-700">
                                        <Ionicons name={item.icon as any} size={20} color={Colors.textDim} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-white font-bold">{item.title}</Text>
                                        <Text className="text-textDim text-xs">{item.subtitle}</Text>
                                    </View>
                                    <Text className="text-gray-500 text-xs">{item.time}</Text>
                                </View>
                            ))}
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
