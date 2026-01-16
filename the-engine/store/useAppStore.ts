import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export type AppMode = 'race' | 'fun';

export interface UserProfile {
    displayName: string;
    avatarUri: string | null;
    primarySport: string;
    experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'elite';
    goal: string;
    instagramHandle?: string;
    stravaLink?: string;
}

export interface User {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    bio: string | null;
    currentMode: AppMode;
}

export interface PerformanceStats {
    vo2Max: number | null;
    ftp: number | null;
    weeklyVolume: number;
    racePBs: Record<string, string>; // { "5k": "18:45", "Marathon": "3:15:00" }
}

export interface ReferralInfo {
    code: string;
    referredBy?: string;
    referralCount: number;
    rewardsEarned: number;
}

interface AppState {
    // Onboarding
    hasCompletedOnboarding: boolean;
    setOnboardingComplete: (val: boolean) => void;
    userProfile: UserProfile | null;
    setUserProfile: (profile: UserProfile) => void;

    // Mode
    mode: AppMode;
    setMode: (mode: AppMode) => void;
    toggleMode: () => void;

    // User
    user: User | null;
    setUser: (user: User | null) => void;

    // Performance
    stats: PerformanceStats | null;
    setStats: (stats: PerformanceStats | null) => void;

    // Auth
    isAuthenticated: boolean;
    setAuthenticated: (val: boolean) => void;

    // Referrals
    referral: ReferralInfo;
    setReferralCode: (code: string) => void;
    incrementReferralCount: () => void;
}

// Generate a unique referral code
const generateReferralCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'ENGINE-';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            // Onboarding
            hasCompletedOnboarding: false,
            setOnboardingComplete: (val) => set({ hasCompletedOnboarding: val }),
            userProfile: null,
            setUserProfile: (profile) => set({ userProfile: profile }),

            // Mode - defaults to 'fun' for new users
            mode: 'fun',
            setMode: (mode) => set({ mode }),
            toggleMode: () => set((state) => ({ mode: state.mode === 'race' ? 'fun' : 'race' })),

            // User
            user: null,
            setUser: (user) => set({ user }),

            // Performance Stats
            stats: null,
            setStats: (stats) => set({ stats }),

            // Auth
            isAuthenticated: false,
            setAuthenticated: (val) => set({ isAuthenticated: val }),

            // Referrals
            referral: {
                code: generateReferralCode(),
                referralCount: 0,
                rewardsEarned: 0,
            },
            setReferralCode: (code) => set((state) => ({
                referral: { ...state.referral, code }
            })),
            incrementReferralCount: () => set((state) => ({
                referral: {
                    ...state.referral,
                    referralCount: state.referral.referralCount + 1,
                    rewardsEarned: state.referral.rewardsEarned + 1,
                }
            })),
        }),
        {
            name: 'the-engine-storage',
            storage: createJSONStorage(() => {
                // Use localStorage for web (synchronous) to verify if async storage is the issue
                if (typeof window !== 'undefined' && window.localStorage) {
                    return localStorage;
                }
                return AsyncStorage;
            }),
            partialize: (state) => ({
                hasCompletedOnboarding: state.hasCompletedOnboarding,
                mode: state.mode,
                userProfile: state.userProfile,
                referral: state.referral,
            }),
        }
    )
);
