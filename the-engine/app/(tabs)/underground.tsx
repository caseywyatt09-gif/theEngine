import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

export default function UndergroundScreen() {
    return (
        <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingBottom: 100 }}>
            <View className="pt-16 px-6">
                {/* Header */}
                <View className="mb-6">
                    <Text className="text-3xl font-bold text-white tracking-tighter">UNDERGROUND</Text>
                    <Text className="text-textDim text-xs uppercase tracking-widest mt-1">
                        The Marketplace
                    </Text>
                </View>

                {/* Categories */}
                <View className="flex-row gap-3 mb-6">
                    {['Gear', 'Coaching', 'Events'].map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            className="bg-surface px-4 py-2 rounded-full border border-gray-800"
                        >
                            <Text className="text-white font-medium">{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Featured Listings */}
                <View className="bg-surface rounded-2xl p-6 mb-4 border border-gray-800">
                    <View className="flex-row items-center gap-3 mb-4">
                        <Ionicons name="pricetag" size={24} color={Colors.primary} />
                        <Text className="text-xl font-bold text-white">Featured Gear</Text>
                    </View>
                    <Text className="text-gray-400 mb-4">
                        Premium equipment from verified sellers.
                    </Text>
                    <View className="bg-gray-800 h-32 rounded-xl items-center justify-center">
                        <Text className="text-textDim">Listings coming soon</Text>
                    </View>
                </View>

                {/* Coach Finder */}
                <View className="bg-surface rounded-2xl p-6 border border-gray-800">
                    <View className="flex-row items-center gap-3 mb-4">
                        <Ionicons name="school" size={24} color={Colors.secondary} />
                        <Text className="text-xl font-bold text-white">Find a Coach</Text>
                    </View>
                    <Text className="text-gray-400">
                        Connect with certified coaches in your area.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}
