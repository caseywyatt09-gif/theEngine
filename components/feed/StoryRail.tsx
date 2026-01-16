import { View, ScrollView, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { ThemedText } from '../common/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';

interface Story {
    id: number;
    name: string;
    isLive: boolean;
    avatar: ImageSourcePropType;
}

const stories: Story[] = [
    { id: 0, name: "You", isLive: false, avatar: require('../../assets/images/profile_avatar_main.png') },
    { id: 1, name: "HyroxHQ", isLive: true, avatar: require('../../assets/images/story_avatar_1.png') },
    { id: 2, name: "TrackLife", isLive: true, avatar: require('../../assets/images/story_avatar_2.png') },
    { id: 3, name: "Recovery", isLive: false, avatar: require('../../assets/images/story_avatar_3.png') },
    { id: 4, name: "Sarah", isLive: false, avatar: require('../../assets/images/partner_avatar_sarah.png') },
];

export function StoryRail() {
    return (
        <View className="mb-6 pl-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-4">
                {stories.map((story, index) => (
                    <TouchableOpacity key={story.id} className="items-center mr-1">
                        {/* Avatar Container with Border */}
                        <View className="mb-1">
                            {/* Live/Story Ring */}
                            {story.isLive ? (
                                <LinearGradient
                                    colors={['#FF0000', '#FF4D00']}
                                    className="p-1 rounded-full w-20 h-20 items-center justify-center"
                                >
                                    <View className="w-full h-full rounded-full border-4 border-background overflow-hidden relative">
                                        <Image source={story.avatar} className="w-full h-full" resizeMode="cover" />
                                        <View className="absolute bottom-0 w-full bg-red-600 items-center">
                                            <ThemedText className="text-[8px] font-bold text-white uppercase tracking-tighter">LIVE</ThemedText>
                                        </View>
                                    </View>
                                </LinearGradient>
                            ) : (
                                <View className={`p-[2px] rounded-full w-20 h-20 items-center justify-center ${index === 0 ? 'border-2 border-dashed border-gray-500' : 'border-2 border-primary'}`}>
                                    <View className="w-full h-full rounded-full border-4 border-background overflow-hidden">
                                        <Image source={story.avatar} className="w-full h-full" resizeMode="cover" />
                                    </View>
                                    {index === 0 && (
                                        <View className="absolute bottom-0 right-0 bg-primary rounded-full w-6 h-6 items-center justify-center border-2 border-background">
                                            <ThemedText className="font-bold text-black text-xs">+</ThemedText>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                        <ThemedText className="text-xs text-textDim">{story.name}</ThemedText>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}
