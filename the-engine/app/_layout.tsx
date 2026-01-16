import "react-native-gesture-handler";
import "../global.css";
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
    // Debug log to check if RootLayout is mounting
    if (typeof window !== 'undefined') {
        console.log("RootLayout is evaluating");
    }

    return (
        <>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="onboarding/index" options={{ gestureEnabled: false }} />
                <Stack.Screen name="(tabs)" />
            </Stack>
        </>
    );
}
