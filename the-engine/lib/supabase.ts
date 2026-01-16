import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Credentials loaded from environment variables (app.json extra config)
// See .env.example for required variables
const SUPABASE_URL = Constants.expoConfig?.extra?.supabaseUrl || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.supabaseAnonKey || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database types (generated from schema)
export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    username: string;
                    display_name: string;
                    avatar_url: string | null;
                    bio: string | null;
                    current_mode: 'race' | 'fun';
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['users']['Insert']>;
            };
            performance_stats: {
                Row: {
                    id: string;
                    user_id: string;
                    source: 'garmin' | 'strava' | 'manual';
                    vo2_max: number | null;
                    ftp: number | null;
                    race_pb: Record<string, string>;
                    weekly_volume: number;
                    last_synced: string;
                };
            };
            social_matches: {
                Row: {
                    id: string;
                    user_a: string;
                    user_b: string;
                    mode: 'race' | 'fun';
                    status: 'pending' | 'matched' | 'declined';
                    created_at: string;
                };
            };
            marketplace_listings: {
                Row: {
                    id: string;
                    seller_id: string;
                    title: string;
                    description: string;
                    price: number;
                    category: 'gear' | 'coaching' | 'event';
                    images: string[];
                    status: 'active' | 'sold' | 'archived';
                    created_at: string;
                };
            };
        };
    };
}
