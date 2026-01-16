import { View, Text } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useAppStore } from '../../store/useAppStore';

interface ChatMessageProps {
    message: {
        id: string;
        text: string;
        sender: 'user' | 'ai';
        timestamp: Date;
    };
}

export function ChatMessage({ message }: ChatMessageProps) {
    const { mode } = useAppStore();
    const isUser = message.sender === 'user';

    // Determine AI bubble color based on mode
    const aiBgColor = mode === 'race' ? Colors.race : Colors.fun;

    return (
        <View className={`w-full flex-row ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
            {!isUser && (
                <View className="w-8 h-8 rounded-full bg-surface mr-2 items-center justify-center border border-white/10">
                    <Text className="text-lg">🤖</Text>
                </View>
            )}

            <View
                className={`px-4 py-3 rounded-2xl max-w-[80%] ${isUser
                    ? 'bg-surface border border-white/10'
                    : ''
                    }`}
                // Add 90 opacity (hex) to darken slightly, or use a specific dark variant if preferred
                // Actually, let's just use the colors but maybe with text shadow or a darker text color?
                // Better yet: White text on Neon is hard. Let's make the background darker version of the color
                // or just keep white text and make background 20% opacity of key color?
                // User said "too bright", so likely full neon background.
                // Let's try 30% opacity of the neon color + a border.
                style={!isUser ? { backgroundColor: `${aiBgColor}40`, borderWidth: 1, borderColor: aiBgColor } : {}}
            >
                <Text className="text-white text-base leading-5">
                    {message.text}
                </Text>
                <Text className="text-white/40 text-[10px] mt-1 text-right">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        </View>
    );
}
