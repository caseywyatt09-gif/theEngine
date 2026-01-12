import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../store/useAppStore';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

export default function WelcomeScreen() {
    const router = useRouter();
    const { mode, toggleMode } = useAppStore();

    return (
        <View className="flex-1 bg-background justify-center items-center px-8">
            {/* Logo */}
            <View className="mb-12">
                <Text className="text-6xl font-black text-white tracking-tighter">THE</Text>
                <Text className="text-6xl font-black text-primary tracking-tighter -mt-4">ENGINE</Text>
            </View>

            {/* Mode Toggle */}
            <View className="mb-12 items-center">
                <Text className="text-textDim text-sm uppercase tracking-widest mb-4">Select Your Mode</Text>
                <View className="flex-row bg-surface rounded-full p-1 border border-gray-800">
                    <TouchableOpacity
                        onPress={() => useAppStore.getState().setMode('race')}
                        className={`px-8 py-3 rounded-full ${mode === 'race' ? 'bg-race' : ''}`}
                    >
                        <Text className={`font-bold ${mode === 'race' ? 'text-white' : 'text-textDim'}`}>
                            🏁 RACE
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => useAppStore.getState().setMode('fun')}
                        className={`px-8 py-3 rounded-full ${mode === 'fun' ? 'bg-fun' : ''}`}
                    >
                        <Text className={`font-bold ${mode === 'fun' ? 'text-background' : 'text-textDim'}`}>
                            🎉 FUN
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Mode Description */}
            <View className="mb-12 px-4">
                {mode === 'race' ? (
                    <Text className="text-gray-400 text-center leading-6">
                        <Text className="text-race font-bold">Race Mode:</Text> Find competitive partners,
                        track performance metrics, and prepare for your next event.
                    </Text>
                ) : (
                    <Text className="text-gray-400 text-center leading-6">
                        <Text className="text-fun font-bold">Fun Mode:</Text> Connect with casual athletes,
                        share workouts, and enjoy the social side of fitness.
                    </Text>
                )}
            </View>

            {/* Enter Button */}
            <TouchableOpacity
                onPress={() => router.replace('/(tabs)/social')}
                className="bg-primary px-12 py-4 rounded-full flex-row items-center gap-2"
            >
                <Text className="text-background font-bold text-lg">ENTER THE ENGINE</Text>
                <Ionicons name="arrow-forward" size={20} color={Colors.background} />
            </TouchableOpacity>
        </View>
    );
}
