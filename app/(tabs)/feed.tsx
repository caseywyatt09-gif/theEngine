import { ScrollView, View } from 'react-native';
import { ThemedView } from "../../components/common/ThemedView";
import { ThemedText } from "../../components/common/ThemedText";
import { FeedCard } from "../../components/feed/FeedCard";
import { StoryRail } from "../../components/feed/StoryRail";
import { Ionicons } from '@expo/vector-icons';

export default function FeedScreen() {
    const posts = [
        {
            id: 1,
            username: "hyrox_champ",
            caption: "New PB on the Sled Push! 120kg moved like butter. 🧈⚡ #HyroxWorld",
            bolts: 124,
            timeAgo: "2h",
            mediaUrl: require('../../assets/images/sled_push_action.png')
        },
        {
            id: 3,
            username: "iron_mike",
            caption: "Wall Balls... love to hate them. 100 reps unbroken strategy paid off. 🎯",
            bolts: 215,
            timeAgo: "4h",
            mediaUrl: require('../../assets/images/wall_ball_action.png')
        },
        {
            id: 2,
            username: "sarah_runs",
            caption: "Engine building session. 8x1km intervals. The pain cave is real.",
            bolts: 89,
            timeAgo: "5h",
            mediaUrl: require('../../assets/images/running_intervals.png')
        },
        {
            id: 4,
            username: "elena_fit",
            caption: "SkiErg focus. Finding that rhythm in the chaos. ⛷️💨",
            bolts: 176,
            timeAgo: "8h",
            mediaUrl: require('../../assets/images/skierg_focus.png')
        },
        {
            id: 5,
            username: "team_alpha",
            caption: "Squad goals. Nothing beats that post-race feeling with the crew. 🤜🤛 #HyroxFamily",
            bolts: 342,
            timeAgo: "1d",
            mediaUrl: require('../../assets/images/post_workout_squad.png')
        },
        {
            id: 6,
            username: "lunges_larry",
            caption: "Sandbag Lunges are the great equalizer. Just keep moving forward. 🏋️‍♂️",
            bolts: 134,
            timeAgo: "1d",
            mediaUrl: require('../../assets/images/sandbag_lunges.png')
        },
    ];

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
            <ThemedView className="flex-1 pt-12 pb-20">
                <View className="px-4 mb-4 flex-row justify-between items-center">
                    <ThemedText className="text-3xl font-bold text-white tracking-tighter">ROXZONE</ThemedText>
                    <View className="flex-row gap-4">
                        <Ionicons name="heart-outline" size={28} color="white" />
                        <Ionicons name="chatbubble-ellipses-outline" size={28} color="white" />
                    </View>
                </View>

                {/* Story Rail */}
                <StoryRail />

                {posts.map(post => (
                    <FeedCard key={post.id} {...post} />
                ))}
            </ThemedView>
        </ScrollView>
    );
}
