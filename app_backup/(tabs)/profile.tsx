import { ScrollView, View, Image } from 'react-native';
import { ThemedView } from "../../components/common/ThemedView";
import { ThemedText } from "../../components/common/ThemedText";
import { Button } from "../../components/common/Button";
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

const StatRow = ({ label, value }: { label: string, value: string }) => (
    <View className="flex-row justify-between py-3 border-b border-gray-800">
        <ThemedText className="text-textDim uppercase text-xs tracking-wider">{label}</ThemedText>
        <ThemedText className="font-mono font-bold">{value}</ThemedText>
    </View>
);

export default function ProfileScreen() {
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
            <ThemedView className="flex-1 p-4 pt-12">
                <View className="items-center mb-8">
                    <View className="w-32 h-32 rounded-full border-2 border-primary overflow-hidden mb-4 shadow-xl">
                        <Image
                            source={require('../../assets/images/profile_avatar_main.png')}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    </View>
                    <ThemedText className="text-2xl font-bold uppercase tracking-widest">Alex Mercer</ThemedText>
                    <View className="flex-row items-center gap-1 mt-1 bg-surface px-3 py-1 rounded-full">
                        <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
                        <ThemedText className="text-primary font-bold text-sm uppercase">Verified Finisher</ThemedText>
                    </View>
                </View>

                <View className="bg-surface p-4 rounded-xl mb-6 shadow-lg border border-gray-800">
                    <ThemedText className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">SPEC SHEET</ThemedText>
                    <StatRow label="Division" value="MEN'S OPEN" />
                    <StatRow label="1km Run PB" value="03:45" />
                    <StatRow label="500m Row PB" value="01:28" />
                    <StatRow label="Sled Push" value="152kg" />
                    <StatRow label="Full Race PB" value="01:08:45" />
                </View>

                <Button title="Edit Profile" variant="outline" />
            </ThemedView>
        </ScrollView>
    );
}
