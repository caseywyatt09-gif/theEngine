import { ScrollView, View } from 'react-native';
import { ThemedView } from "../../components/common/ThemedView";
import { ThemedText } from "../../components/common/ThemedText";
import PaceCalculator from "../../components/training/PaceCalculator";
import { StationGrid } from "../../components/training/StationGrid";

export default function TrainingScreen() {
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
            <ThemedView className="flex-1 p-4 pt-12 pb-20">
                <ThemedText className="text-3xl font-bold mb-6 text-white tracking-tighter">HYROX ENGINE</ThemedText>

                <PaceCalculator />

                <View className="h-8" />

                <StationGrid />
            </ThemedView>
        </ScrollView>
    );
}
