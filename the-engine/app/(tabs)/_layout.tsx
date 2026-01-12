import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { Colors } from '../../constants/Colors';

export default function TabLayout() {
    const { mode } = useAppStore();
    const activeColor = mode === 'race' ? Colors.race : Colors.fun;

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Colors.surface,
                    borderTopColor: Colors.gray[800],
                    borderTopWidth: 1,
                    height: 90,
                    paddingBottom: 30,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: activeColor,
                tabBarInactiveTintColor: Colors.textDim,
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                },
            }}
        >
            <Tabs.Screen
                name="feed"
                options={{
                    title: 'Feed',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="newspaper" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="social"
                options={{
                    title: 'Match',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="flame" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="warroom"
                options={{
                    title: 'War Room',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="fitness" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="underground"
                options={{
                    title: 'Market',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="storefront" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
