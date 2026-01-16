import { View, Image, ImageSourcePropType, TouchableOpacity, Share } from 'react-native';
import { useState } from 'react';
import { ThemedView } from '../common/ThemedView';
import { ThemedText } from '../common/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import * as Haptics from 'expo-haptics';

interface FeedCardProps {
    username: string;
    mediaUrl?: ImageSourcePropType;
    caption: string;
    bolts: number;
    timeAgo: string;
}

export function FeedCard({ username, mediaUrl, caption, bolts: initialBolts, timeAgo }: FeedCardProps) {
    const [bolts, setBolts] = useState(initialBolts);
    const [isBolted, setIsBolted] = useState(false);

    const handleBolt = () => {
        // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Only works on mobile
        setIsBolted(!isBolted);
        setBolts(prev => isBolted ? prev - 1 : prev + 1);
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out this post by ${username} on Hyrox Hub! ⚡`,
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <ThemedView className="bg-surface mb-6 rounded-none sm:rounded-xl overflow-hidden border-b border-gray-900 sm:border-0 shadow-lg">
            {/* Header */}
            <View className="flex-row items-center p-3">
                <View className="w-8 h-8 rounded-full bg-gray-700 mr-3 overflow-hidden">
                    <View className="w-full h-full bg-gray-600" />
                </View>
                <ThemedText className="font-bold flex-1">{username}</ThemedText>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
                </TouchableOpacity>
            </View>

            {/* Media */}
            <View className="w-full h-80 bg-gray-800 justify-center items-center overflow-hidden relative">
                {mediaUrl ? (
                    <Image source={mediaUrl} className="w-full h-full" resizeMode="cover" />
                ) : (
                    <Ionicons name="image" size={48} color="#333" />
                )}
                {/* Live Badge if applicable (could be passed in prop, hardcoded for now just for visuals on first post) */}
                {/* <View className="absolute top-4 right-4 bg-red-600 px-2 py-1 rounded">
             <ThemedText className="font-bold text-xs">LIVE</ThemedText>
        </View> */}
            </View>

            {/* Actions */}
            <View className="flex-row items-center p-3 gap-4">
                <TouchableOpacity className="flex-row items-center gap-1" onPress={handleBolt}>
                    <Ionicons name={isBolted ? "flash" : "flash-outline"} size={26} color={Colors.primary} />
                    <ThemedText className={`font-bold ${isBolted ? 'text-primary' : 'text-white'}`}>{bolts}</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity>
                    <Ionicons name="chatbubble-outline" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity className="ml-auto" onPress={handleShare}>
                    <Ionicons name="share-social-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Caption */}
            <View className="px-3 pb-4">
                <ThemedText>
                    <ThemedText className="font-bold">{username} </ThemedText>
                    {caption}
                </ThemedText>
                <ThemedText className="text-xs text-textDim mt-1">{timeAgo}</ThemedText>
            </View>
        </ThemedView>
    );
}
