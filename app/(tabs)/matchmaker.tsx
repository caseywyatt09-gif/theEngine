import { useState } from 'react';
import { View } from 'react-native';
import { ThemedView } from "../../components/common/ThemedView";
import { ThemedText } from "../../components/common/ThemedText";
import { PartnerProfileCard } from "../../components/matchmaker/PartnerProfileCard";
import { Button } from "../../components/common/Button";
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { MOCK_PARTNERS, Partner } from '../../components/matchmaker/mockData';

// Avatar mapping to avoid require cycles - using modulo to rotate through assets
const AVATARS = [
    require('../../assets/images/partner_avatar_sarah.png'),
    require('../../assets/images/partner_kyle_reese.png'),
    require('../../assets/images/partner_t800.png'),
    require('../../assets/images/partner_avatar_generic_female_1.png'),
    require('../../assets/images/partner_avatar_generic_male_1.png'),
    require('../../assets/images/partner_avatar_generic_female_2.png'),
    require('../../assets/images/partner_avatar_generic_male_2.png'),
];

export default function MatchmakerScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Enrich mock data with avatars
    const partners: Partner[] = MOCK_PARTNERS.map((p, index) => ({
        ...p,
        avatar: AVATARS[index % AVATARS.length]
    }));

    const currentPartner = partners[currentIndex];

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % partners.length);
    };

    return (
        <ThemedView className="flex-1 bg-background pt-12">
            <View className="px-6 mb-4 flex-row justify-between items-center">
                <View>
                    <ThemedText className="text-3xl font-bold text-white tracking-tighter">SQUAD FINDER</ThemedText>
                    <View className="flex-row items-center gap-1">
                        <Ionicons name="location-outline" size={12} color="#666" />
                        <ThemedText className="text-textDim text-xs uppercase tracking-widest">Training near Los Angeles, CA</ThemedText>
                    </View>
                </View>
                <Button variant="outline" title="" className="w-10 h-10 px-0 items-center justify-center rounded-full border-gray-700">
                    <Ionicons name="options-outline" size={20} color={Colors.primary} />
                </Button>
            </View>

            <View className="flex-1 items-center justify-center">
                {currentPartner ? (
                    <View>
                        <PartnerProfileCard {...currentPartner} />
                        {/* Distance Badge floating over card top right */}
                        <View className="absolute top-4 right-4 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md border border-white/10 flex-row items-center gap-1">
                            <Ionicons name="navigate-circle" size={14} color={Colors.primary} />
                            <ThemedText className="text-xs font-bold text-white">{currentPartner.distance}</ThemedText>
                        </View>
                    </View>
                ) : (
                    <ThemedText>No more profiles.</ThemedText>
                )}
            </View>

            {/* Action Buttons */}
            <View className="flex-row justify-center gap-8 pb-8 px-6">
                <Button
                    title=""
                    className="w-16 h-16 rounded-full bg-surface border border-red-500 justify-center items-center p-0"
                    onPress={handleNext}
                >
                    <Ionicons name="close" size={32} color="#EF4444" />
                </Button>

                <Button
                    title=""
                    className="w-20 h-20 rounded-full bg-primary justify-center items-center shadow-lg shadow-yellow-500/20 p-0 -mt-2"
                    onPress={() => alert(`Connect request sent to ${currentPartner.name}!`)}
                >
                    <Ionicons name="flash" size={40} color="black" />
                </Button>

                <Button
                    title=""
                    className="w-16 h-16 rounded-full bg-surface border border-blue-500 justify-center items-center p-0"
                    onPress={handleNext}
                >
                    <Ionicons name="star" size={24} color="#3B82F6" />
                </Button>
            </View>
        </ThemedView>
    );
}
