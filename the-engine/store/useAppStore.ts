import { create } from 'zustand';

// Types
export type AppMode = 'race' | 'fun';

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

interface AppState {
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
}

export const useAppStore = create<AppState>((set) => ({
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
}));
