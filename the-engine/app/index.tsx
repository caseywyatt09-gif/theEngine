import { View, ActivityIndicator, Platform } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Colors } from '../constants/Colors';

export default function RootScreen() {
    const router = useRouter();
    const { hasCompletedOnboarding } = useAppStore();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        // Give zustand time to hydrate from storage
        const timer = setTimeout(() => {
            setIsHydrated(true);
        }, 200);
        return () => clearTimeout(timer);
    }, []);

    // While loading, show a spinner
    if (!isHydrated) {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    // After hydration, redirect based on onboarding status
    if (hasCompletedOnboarding) {
        return <Redirect href="/(tabs)/social" />;
    }

    return <Redirect href="/onboarding" />;
}
