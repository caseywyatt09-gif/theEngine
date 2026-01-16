import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Colors.surface,
                    borderTopColor: Colors.background,
                    height: 80,
                    paddingBottom: 20,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.textDim,
                tabBarLabelStyle: {
                    fontWeight: 'bold',
                    fontSize: 12,
                    textTransform: 'uppercase',
                },
            }}>
            <Tabs.Screen
                name="feed"
                options={{
                    title: 'Roxzone',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="flash" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="training"
                options={{
                    title: 'Training',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="timer" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="matchmaker"
                options={{
                    title: 'Partners',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="people" size={size} color={color} />
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
