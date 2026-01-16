import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform,
  ActivityIndicator, ScrollView, Image, Dimensions, Modal, TextInput, KeyboardAvoidingView, Alert, PanResponder, Animated
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Sound Effects using Web Audio API - Subtle & Premium
const SoundEffects = {
  audioContext: null as AudioContext | null,

  init() {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && !this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.log('Web Audio not supported');
      }
    }
  },

  // Soft haptic-like tap - very subtle
  playTap() {
    if (!this.audioContext) return;
    const ctx = this.audioContext;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    filter.type = 'lowpass';
    filter.frequency.value = 200;

    osc.frequency.value = 80; // Very low, more like a thud
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.06);
  },

  // Gentle breath/air whoosh
  playWhoosh() {
    if (!this.audioContext) return;
    const ctx = this.audioContext;

    // Use noise-like filtered oscillator for organic feel
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(300, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.25);
    filter.Q.value = 0.5;

    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.25);
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
  },

  // Soft pulse/heartbeat during scan
  playBeep() {
    if (!this.audioContext) return;
    const ctx = this.audioContext;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = 180; // Low, warm tone
    osc.type = 'sine';
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  },

  // Warm, ambient chord - like a gentle notification
  playCelebration() {
    if (!this.audioContext) return;
    const ctx = this.audioContext;

    // Soft major chord (C major in low register)
    const notes = [261.63, 329.63, 392.00]; // C4, E4, G4
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      filter.type = 'lowpass';
      filter.frequency.value = 800;

      osc.frequency.value = freq;
      osc.type = 'sine';
      const startTime = ctx.currentTime + i * 0.12; // Slower arpeggio
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.06, startTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);
      osc.start(startTime);
      osc.stop(startTime + 0.8);
    });
  },

  // Gentle confirmation - subtle rising tone
  playSuccess() {
    if (!this.audioContext) return;
    const ctx = this.audioContext;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    filter.type = 'lowpass';
    filter.frequency.value = 600;

    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.15);
    osc.type = 'sine';
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
  }
};


// Athlete images
const ATHLETE_IMAGES = {
  sarah: require('./assets/images/athletes/athlete_sarah_1768393442842.png'),
  sarah_running: require('./assets/images/athletes/sarah_running.png'),
  sarah_training: require('./assets/images/athletes/sarah_training.png'),
  marcus: require('./assets/images/athletes/athlete_marcus_1768393464570.png'),
  emma: require('./assets/images/athletes/athlete_emma_1768393482242.png'),
};

// Post images
const POST_IMAGES = {
  running: require('./assets/images/posts/post_running_1768393517236.png'),
  hyrox: require('./assets/images/posts/post_hyrox_1768393533600.png'),
  swimming: require('./assets/images/posts/post_swimming_1768393553162.png'),
  gym: require('./assets/images/posts/post_gym_1768394465715.png'),
  cycling: require('./assets/images/posts/post_cycling_1768394482614.png'),
  yoga: require('./assets/images/posts/post_yoga_1768394498506.png'),
  crossfit: require('./assets/images/posts/post_crossfit_1768394515073.png'),
  hiit: require('./assets/images/posts/post_hiit_1768394549388.png'),
  marathon: require('./assets/images/posts/post_marathon_1768394567471.png'),
  boxing: require('./assets/images/posts/post_boxing_1768394581923.png'),
  hiking: require('./assets/images/posts/post_hiking_1768394599971.png'),
  rowing: require('./assets/images/posts/post_rowing_1768394639491.png'),
  spinning: require('./assets/images/posts/post_spinning_1768394658566.png'),
  stretching: require('./assets/images/posts/post_stretching_1768394674065.png'),
  medal: require('./assets/images/posts/post_medal_1768394692028.png'),
};

const MARKET_IMAGES = {
  nike: require('./assets/images/market_nike.png'),
  protein: require('./assets/images/market_protein.png'),
  live1: require('./assets/images/market_live_1.png'),
  live2: require('./assets/images/market_live_2.png'),
};

// Inline colors to avoid import issues
const Colors = {
  background: '#0A0A0F',
  surface: '#1A1A23',
  primary: '#FF4500',
  race: '#FF4500',
  fun: '#00CED1',
  textDim: '#888888',
};

type TabName = 'feed' | 'social' | 'warroom' | 'market' | 'profile';
type AppMode = 'race' | 'fun';

const TABS: { name: TabName; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { name: 'feed', label: 'Feed', icon: 'newspaper' },
  { name: 'social', label: 'Match', icon: 'flame' },
  { name: 'warroom', label: 'War Room', icon: 'fitness' },
  { name: 'market', label: 'Market', icon: 'storefront' },
  { name: 'profile', label: 'Profile', icon: 'person' },
];

// Mock athlete data inline - with multiple photos for carousel
const ATHLETES = [
  {
    id: '1', name: 'Sarah Chen', age: 28, location: '0.5 mi', distance: 0.5, bio: 'Marathon runner & HYROX enthusiast. Looking for training partners!', vibeCheck: '☕ Coffee Run', mode: 'race' as AppMode, avatar: { uri: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=800&q=80' }, photos: [
      { uri: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=800&q=80' },
      { uri: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&q=80' },
      { uri: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80' }
    ]
  },
  {
    id: '2', name: 'Marcus Johnson', age: 32, location: '1.2 mi', distance: 1.2, bio: 'CrossFit coach by day, trail runner by weekend. Let\'s train together!', vibeCheck: '🌅 Morning Person', mode: 'fun' as AppMode, avatar: { uri: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80' }, photos: [
      { uri: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80' },
      { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80' },
      { uri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80' }
    ]
  },
  {
    id: '3', name: 'Emma Wilson', age: 26, location: '2.3 mi', distance: 2.3, bio: 'Triathlete in training. Always up for a swim or bike ride!', vibeCheck: '🎯 Race Mode', mode: 'race' as AppMode, avatar: { uri: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80' }, photos: [
      { uri: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80' },
      { uri: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80' },
      { uri: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80' }
    ]
  },
  {
    id: '4', name: 'David Lee', age: 29, location: '3.0 mi', distance: 3.0, bio: 'Obstacle Course Racing pro. Training for Spartan World Champs.', vibeCheck: '🏔️ Trail Seeker', mode: 'race' as AppMode, avatar: { uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80' }, photos: [
      { uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80' },
      { uri: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80' },
      { uri: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80' }
    ]
  },
  {
    id: '5', name: 'Jessica K.', age: 24, location: '1.5 mi', distance: 1.5, bio: 'Just getting into running! Looking for social 5k buddies.', vibeCheck: '🎉 Fun Pace', mode: 'fun' as AppMode, avatar: { uri: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800&q=80' }, photos: [
      { uri: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800&q=80' },
      { uri: 'https://images.unsplash.com/photo-1571731977949-83c825478d39?w=800&q=80' },
      { uri: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80' }
    ]
  },
  {
    id: '6', name: 'Alex Rivera', age: 31, location: '4.2 mi', distance: 4.2, bio: 'Powerlifter converting to endurance. Help me with my cardio!', vibeCheck: '🏋️ Gym Rat', mode: 'fun' as AppMode, avatar: { uri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80' }, photos: [
      { uri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80' },
      { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80' },
      { uri: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80' }
    ]
  },
  {
    id: '7', name: 'Chloe Davis', age: 27, location: '0.8 mi', distance: 0.8, bio: 'Yoga instructor and casual cyclist. Good vibes only.', vibeCheck: '🧘‍♀️ Zen Mode', mode: 'fun' as AppMode, avatar: { uri: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80' }, photos: [
      { uri: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80' },
      { uri: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80' },
      { uri: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80' }
    ]
  },
  {
    id: '8', name: 'Ryan Park', age: 30, location: '5.1 mi', distance: 5.1, bio: 'Ironman finisher. Serious training partners only.', vibeCheck: '⏱️ Tempo Run', mode: 'race' as AppMode, avatar: { uri: 'https://images.unsplash.com/photo-1571731977949-83c825478d39?w=800&q=80' }, photos: [
      { uri: 'https://images.unsplash.com/photo-1571731977949-83c825478d39?w=800&q=80' },
      { uri: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80' },
      { uri: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80' }
    ]
  },
  {
    id: '9', name: 'Lisa Wong', age: 25, location: '2.0 mi', distance: 2.0, bio: 'Climber and hiker. Let\'s hit the trails!', vibeCheck: '🧗‍♀️ Send It', mode: 'fun' as AppMode, avatar: { uri: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800&q=80' }, photos: [
      { uri: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800&q=80' },
      { uri: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80' },
      { uri: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80' }
    ]
  },
  {
    id: '10', name: 'Tom Baker', age: 34, location: '0.2 mi', distance: 0.2, bio: 'Rowing enthusiast. Early morning crew anyone?', vibeCheck: '🚣‍♀️ Row Row', mode: 'race' as AppMode, avatar: { uri: 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=800&q=80' }, photos: [
      { uri: 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=800&q=80' },
      { uri: 'https://images.unsplash.com/photo-1541698444083-023c97d3f4b6?w=800&q=80' },
      { uri: 'https://images.unsplash.com/photo-1519505907962-0a6cb0167c73?w=800&q=80' }
    ]
  },
  {
    id: '11', name: 'Sofia G.', age: 22, location: '11.0 mi', distance: 11.0, bio: 'Sprinter. Short distance speed work.', vibeCheck: '⚡ Fast AF', mode: 'race' as AppMode, avatar: { uri: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80' }, photos: [
      { uri: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80' },
      { uri: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=800&q=80' },
      { uri: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&q=80' }
    ]
  },
  {
    id: '12', name: 'Mike T.', age: 33, location: '15.0 mi', distance: 15.0, bio: 'Ultra runner. 50k is just a warm up.', vibeCheck: '🌵 Desert Run', mode: 'race' as AppMode, avatar: { uri: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80' }, photos: [
      { uri: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80' },
      { uri: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80' },
      { uri: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80' }
    ]
  },
];

// Mock feed posts (20 posts)
const FEED_POSTS = [
  { id: '1', athlete: ATHLETES[0], type: 'workout', content: 'Just crushed a 10K tempo run! 🔥 New PR at 4:32/km pace. Race prep is going strong.', image: POST_IMAGES.running, workout: { type: 'Running', title: '10K Tempo Run 🔥', distance: '10km', duration: '45:20', pace: '4:32/km' }, likes: 124, comments: 28, timeAgo: '2h ago' },
  { id: '2', athlete: ATHLETES[1], type: 'achievement', content: 'Completed my first HYROX race! 🏁 What an incredible experience. Already signed up for the next one.', image: POST_IMAGES.hyrox, achievement: { title: 'HYROX Finisher', icon: '🏆' }, likes: 289, comments: 53, timeAgo: '3h ago' },
  { id: '3', athlete: ATHLETES[2], type: 'workout', content: 'Morning swim session done ✅ Working on my freestyle technique for the upcoming tri.', image: POST_IMAGES.swimming, workout: { type: 'Swimming', title: 'Freestyle Technique', distance: '2km', duration: '38:00', pace: '1:54/100m' }, likes: 95, comments: 13, timeAgo: '4h ago' },
  { id: '4', athlete: ATHLETES[0], type: 'workout', content: 'Leg day at the gym 💪 Feeling stronger every week!', image: POST_IMAGES.gym, workout: { type: 'Strength', title: 'Leg Day Blast', distance: '—', duration: '1:15:00', pace: '—' }, likes: 156, comments: 21, timeAgo: '5h ago' },
  { id: '5', athlete: ATHLETES[1], type: 'workout', content: 'Epic cycling route today! Those mountain views were unreal 🏔️', image: POST_IMAGES.cycling, workout: { type: 'Cycling', title: 'Mountain Climb', distance: '65km', duration: '2:30:00', pace: '26km/h' }, likes: 234, comments: 42, timeAgo: '6h ago' },
  { id: '6', athlete: ATHLETES[2], type: 'workout', content: 'Beach yoga to start the day right 🧘‍♀️ Mind and body connected.', image: POST_IMAGES.yoga, workout: { type: 'Yoga', title: 'Sunrise Flow', distance: '—', duration: '45:00', pace: '—' }, likes: 312, comments: 67, timeAgo: '7h ago' },
  { id: '7', athlete: ATHLETES[0], type: 'workout', content: 'CrossFit WOD destroyed me today 😅 Box jumps for days!', image: POST_IMAGES.crossfit, workout: { type: 'CrossFit', title: 'WOD: The Box', distance: '—', duration: '35:00', pace: '—' }, likes: 178, comments: 34, timeAgo: '8h ago' },
  { id: '8', athlete: ATHLETES[1], type: 'workout', content: 'HIIT class was INSANE today! Battle ropes are no joke 🔥', image: POST_IMAGES.hiit, workout: { type: 'HIIT', title: 'High Intensity', distance: '—', duration: '45:00', pace: '—' }, likes: 267, comments: 45, timeAgo: '9h ago' },
  { id: '9', athlete: ATHLETES[2], type: 'achievement', content: 'Marathon PR! Sub-3:30 finally achieved! All the training paid off 🏃‍♀️', image: POST_IMAGES.marathon, achievement: { title: 'Marathon PR', icon: '🏆' }, likes: 456, comments: 89, timeAgo: '10h ago' },
  { id: '10', athlete: ATHLETES[0], type: 'workout', content: 'Boxing session to blow off steam. Nothing like hitting the heavy bag 🥊', image: POST_IMAGES.boxing, workout: { type: 'Boxing', title: 'Heavy Bag Work', distance: '—', duration: '60:00', pace: '—' }, likes: 198, comments: 27, timeAgo: '11h ago' },
  { id: '11', athlete: ATHLETES[1], type: 'achievement', content: 'Summit reached! 12km hike with 1200m elevation gain 🏔️', image: POST_IMAGES.hiking, achievement: { title: 'Peak Conqueror', icon: '⛰️' }, likes: 345, comments: 56, timeAgo: '12h ago' },
  { id: '12', athlete: ATHLETES[2], type: 'workout', content: 'Rowing crew practice at sunrise. Best way to start the day! 🚣', image: POST_IMAGES.rowing, workout: { type: 'Rowing', title: 'Morning Crew', distance: '8km', duration: '45:00', pace: '2:48/500m' }, likes: 234, comments: 38, timeAgo: '14h ago' },
  { id: '13', athlete: ATHLETES[0], type: 'workout', content: 'Spin class with the squad! Those watts were flying 🔥', image: POST_IMAGES.spinning, workout: { type: 'Spinning', title: 'Power Output', distance: '25km', duration: '45:00', pace: '—' }, likes: 189, comments: 31, timeAgo: '16h ago' },
  { id: '14', athlete: ATHLETES[1], type: 'workout', content: 'Mobility work is just as important as the hard sessions 🙏', image: POST_IMAGES.stretching, workout: { type: 'Mobility', title: 'Recovery Session', distance: '—', duration: '30:00', pace: '—' }, likes: 145, comments: 22, timeAgo: '18h ago' },
  { id: '15', athlete: ATHLETES[2], type: 'achievement', content: 'Got my finisher medal! Such an amazing race day experience 🏅', image: POST_IMAGES.medal, achievement: { title: 'Race Finisher', icon: '🏅' }, likes: 378, comments: 67, timeAgo: '1d ago' },
  { id: '16', athlete: ATHLETES[0], type: 'looking_for_partner', content: 'Looking for a running buddy for Saturday long run! Planning 20km at easy pace. Anyone in? 👟', image: POST_IMAGES.running, likes: 112, comments: 27, timeAgo: '1d ago' },
  { id: '17', athlete: ATHLETES[1], type: 'event', content: "Just registered for HYROX Chicago! Who else is going? Let's form a team! 💪", event: { name: 'HYROX Chicago', date: 'Mar 15, 2026' }, image: POST_IMAGES.hyrox, likes: 245, comments: 48, timeAgo: '1d ago' },
  { id: '18', athlete: ATHLETES[2], type: 'workout', content: "Recovery swim after yesterday's race. Feeling so much better! 🏊‍♀️", image: POST_IMAGES.swimming, workout: { type: 'Swimming', title: 'Recovery Laps', distance: '1.5km', duration: '28:00', pace: '1:52/100m' }, likes: 134, comments: 19, timeAgo: '2d ago' },
  { id: '19', athlete: ATHLETES[0], type: 'workout', content: 'Back in the gym after rest week. Time to build back stronger! 💪', image: POST_IMAGES.gym, workout: { type: 'Strength', title: 'Full Body Reset', distance: '—', duration: '1:00:00', pace: '—' }, likes: 167, comments: 24, timeAgo: '2d ago' },
  { id: '20', athlete: ATHLETES[1], type: 'achievement', content: 'First century ride complete! 100km done and dusted 🚴', image: POST_IMAGES.cycling, achievement: { title: 'Century Rider', icon: '🚴' }, likes: 423, comments: 78, timeAgo: '2d ago' },
];

// Marketplace Data
const MARKET_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'gear', label: 'Gear' },
  { id: 'equipment', label: 'Equipment' },
  { id: 'supplements', label: 'Supplements' },
  { id: 'tickets', label: 'Tickets' },
];

const MARKET_LIVE_STREAMS = [
  { id: 'l1', host: 'RunWithMe', title: 'Best Running Shoes 2026 👟', viewers: 1240, image: MARKET_IMAGES.live1, avatar: ATHLETES[2].avatar, category: 'gear' },
  { id: 'l2', host: 'GymSharkFit', title: 'Supplements Review + Giveaway! 💊', viewers: 850, image: MARKET_IMAGES.live2, avatar: ATHLETES[1].avatar, category: 'supplements' },
  { id: 'l3', host: 'CrossFitGames', title: 'Live from the box! WOD Gear', viewers: 2100, image: POST_IMAGES.crossfit, avatar: ATHLETES[3].avatar, category: 'gear' },
  { id: 'l4', host: 'YogaWithAdriene', title: 'Morning Flow & Mat Talk 🧘‍♀️', viewers: 3200, image: POST_IMAGES.yoga, avatar: ATHLETES[0].avatar, category: 'equipment' },
  { id: 'l5', host: 'PelotonOfficial', title: 'New Bike+ Features Demo 🚴', viewers: 1500, image: POST_IMAGES.spinning, avatar: ATHLETES[1].avatar, category: 'equipment' },
  { id: 'l6', host: 'SpartanRace', title: 'Race Day Prep Q&A 🔥', viewers: 900, image: POST_IMAGES.hyrox, avatar: ATHLETES[2].avatar, category: 'tickets' },
  { id: 'l7', host: 'TheRock', title: 'Project Rock New Drop 🪨', viewers: 15400, image: POST_IMAGES.gym, avatar: ATHLETES[1].avatar, category: 'gear' },
  { id: 'l8', host: 'CourtneyDauwalter', title: 'Ultra Gear Packing List 🎒', viewers: 4200, image: POST_IMAGES.marathon, avatar: ATHLETES[2].avatar, category: 'gear' },
  { id: 'l9', host: 'BowmarNutrition', title: 'Taste Testing New Flavors 🍦', viewers: 670, image: MARKET_IMAGES.protein, avatar: ATHLETES[3].avatar, category: 'supplements' },
  { id: 'l10', host: 'RogueFitness', title: 'Echo Bike Challenge 🚲', viewers: 1100, image: POST_IMAGES.hiit, avatar: ATHLETES[0].avatar, category: 'equipment' },
  { id: 'l11', host: 'IronmanTri', title: 'Kona Qualifiers Live 🏊‍♂️', viewers: 8900, image: POST_IMAGES.swimming, avatar: ATHLETES[1].avatar, category: 'tickets' },
  { id: 'l12', host: 'Lululemon', title: 'Align Pant New Colors ✨', viewers: 2300, image: POST_IMAGES.stretching, avatar: ATHLETES[2].avatar, category: 'gear' },
];

const MARKET_PRODUCTS = [
  { id: 'mp1', name: 'Nike Metcon 8', price: 129.99, condition: 'New', category: 'gear', image: MARKET_IMAGES.nike, prime: true, rating: 4.8, reviews: 342, seller: 'Nike Official' },
  { id: 'mp2', name: 'The Engine Fuel Whey', price: 54.99, condition: 'New', category: 'supplements', image: MARKET_IMAGES.protein, prime: true, rating: 4.9, reviews: 128, seller: 'Engine Nutrition' },
  { id: 'mp3', name: 'Concept2 Rower (Used)', price: 750.00, condition: 'Used', category: 'equipment', image: POST_IMAGES.rowing, prime: false, rating: 4.5, reviews: 56, seller: 'LocalGymCloseout' },
  { id: 'mp4', name: 'HYROX Chicago Ticket', price: 185.00, condition: 'New', category: 'tickets', image: POST_IMAGES.hyrox, prime: true, rating: 5.0, reviews: 12, seller: 'HYROX Official' },
  { id: 'mp5', name: 'Garmin Fenix 8', price: 899.99, condition: 'New', category: 'gear', image: POST_IMAGES.marathon, prime: true, rating: 4.7, reviews: 89, seller: 'Garmin Store' },
  { id: 'mp6', name: 'Kettlebell Set 16-24kg', price: 120.00, condition: 'Used', category: 'equipment', image: POST_IMAGES.gym, prime: false, rating: 4.2, reviews: 23, seller: 'GymRat99' },
];

// Initial Pulse posts (Twitter/Threads style - text only + optional photos)
const INITIAL_PULSE_POSTS = [
  { id: 'p1', athlete: ATHLETES[0], content: "Early morning tempo run done ✅ 5:30am club who's with me?", likes: 42, comments: 12, reposts: 5, timeAgo: '1h ago', image: POST_IMAGES.running },
  { id: 'p2', athlete: ATHLETES[1], content: 'Hot take: HYROX is harder than a marathon. Change my mind 👇', likes: 156, comments: 89, reposts: 23, timeAgo: '2h ago' },
  { id: 'p3', athlete: ATHLETES[2], content: "Looking for a swim buddy in the LA area! DM me if you're training for any upcoming tris 🏊‍♀️", likes: 28, comments: 15, reposts: 3, timeAgo: '3h ago' },
  { id: 'p4', athlete: ATHLETES[0], content: "Race day nutrition tip: Don't try anything new! Stick with what works in training 🍌", likes: 234, comments: 45, reposts: 67, timeAgo: '4h ago', image: POST_IMAGES.gym },
  { id: 'p5', athlete: ATHLETES[1], content: "Who else is doing HYROX Chicago in March? Let's connect and maybe team up! 💪", likes: 89, comments: 34, reposts: 12, timeAgo: '5h ago' },
  { id: 'p6', athlete: ATHLETES[2], content: 'That post-workout soreness is hitting different today 😅 Rest day tomorrow for sure', likes: 67, comments: 23, reposts: 2, timeAgo: '6h ago', image: POST_IMAGES.stretching },
  { id: 'p7', athlete: ATHLETES[3], content: 'OCR World Championships are coming up! Anyone else training for the 15k course? 🏔️', likes: 112, comments: 45, reposts: 10, timeAgo: '7h ago' },
  { id: 'p8', athlete: ATHLETES[4], content: 'Just signed up for my first 5k! Nervous but excited 🎉 Any tips for a newbie?', likes: 89, comments: 56, reposts: 4, timeAgo: '8h ago' },
  { id: 'p9', athlete: ATHLETES[5], content: 'Does anyone have recommendations for good running shoes for heavy runners? 👟', likes: 45, comments: 34, reposts: 2, timeAgo: '9h ago' },
  { id: 'p10', athlete: ATHLETES[6], content: 'Yoga in the park this Sunday at 10am! Everyone is welcome 🧘‍♀️', likes: 134, comments: 23, reposts: 15, timeAgo: '10h ago' },
  { id: 'p11', athlete: ATHLETES[7], content: 'Ironman training block starts today. Goodbye social life 👋 See you in 6 months.', likes: 245, comments: 89, reposts: 45, timeAgo: '11h ago' },
  { id: 'p12', athlete: ATHLETES[8], content: 'Looking for belay partners at the local climbing gym! 🧗‍♀️', likes: 56, comments: 12, reposts: 3, timeAgo: '12h ago' },
  { id: 'p13', athlete: ATHLETES[9], content: 'Nothing beats the stillness of the water at 5am. Rowing is therapy 🚣‍♀️', likes: 178, comments: 34, reposts: 12, timeAgo: '13h ago' },
  { id: 'p14', athlete: ATHLETES[10], content: 'Need a sprinter for our 4x100 team! DM me if interested ⚡', likes: 90, comments: 23, reposts: 18, timeAgo: '14h ago' },
  { id: 'p15', athlete: ATHLETES[11], content: '50k trail run this weekend. Should I bring 2L or 3L of water? 🤔', likes: 156, comments: 67, reposts: 5, timeAgo: '15h ago' },
  { id: 'p16', athlete: ATHLETES[0], content: 'Marathon pacing strategy: Go out fast and hold on? Or negative splits? 👇', likes: 234, comments: 112, reposts: 34, timeAgo: '16h ago' },
  { id: 'p17', athlete: ATHLETES[1], content: 'Wall balls are the worst. That is all.', likes: 567, comments: 234, reposts: 123, timeAgo: '17h ago' },
  { id: 'p18', athlete: ATHLETES[2], content: 'Recovery boots: Worth the investment? 💰', likes: 145, comments: 78, reposts: 12, timeAgo: '18h ago' },
  { id: 'p19', athlete: ATHLETES[3], content: 'Mud, sweat, and tears. Best way to spend a Saturday! 🏃‍♂️', likes: 345, comments: 56, reposts: 23, timeAgo: '19h ago' },
  { id: 'p20', athlete: ATHLETES[4], content: 'First run without stopping! Feeling unstoppable 🚀', likes: 456, comments: 123, reposts: 45, timeAgo: '20h ago' },
];

// Mock Events with VIP Guest List
const EVENTS = [
  { id: 'e1', name: 'HYROX Chicago', date: 'Nov 18, 2026', location: 'Navy Pier', attendees: [ATHLETES[0], ATHLETES[1]], image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80' },
  { id: 'e2', name: 'NYC Marathon', date: 'Nov 5, 2026', location: 'Staten Island', attendees: [ATHLETES[2]], image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80' },
  { id: 'e3', name: 'Turkey Trot 5K', date: 'Nov 23, 2026', location: 'Lincoln Park', attendees: [ATHLETES[0], ATHLETES[2]], image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80' },
  { id: 'e4', name: 'Spartan Race', date: 'Dec 12, 2026', location: 'SoCal', attendees: [ATHLETES[1]], image: 'https://images.unsplash.com/photo-1627483297929-37f416fec7cd?auto=format&fit=crop&q=80' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>('social');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardPhotoIndex, setCardPhotoIndex] = useState(0); // Photo carousel index for swipe cards
  const [marketSearch, setMarketSearch] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [marketView, setMarketView] = useState<'home' | 'all_lives'>('home');
  const [liveCategory, setLiveCategory] = useState('all');
  const [showUsed, setShowUsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(['founder']);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]); // New Vibe State

  // Vibe Data
  const VIBES = [
    { id: 'early_bird', label: 'Early Bird 🌅' },
    { id: 'night_owl', label: 'Night Owl 🦉' },
    { id: 'lone_wolf', label: 'Lone Wolf 🐺' },
    { id: 'pack_animal', label: 'Pack Animal 🦍' },
    { id: 'data_nerd', label: 'Data Nerd 🤓' },
    { id: 'weekend_warrior', label: 'Weekend Warrior 🍺' },
    { id: 'gear_head', label: 'Gear Head 👟' },
    { id: 'competitor', label: 'Competitor 🏆' },
  ];

  // Forum Data ("The Locker Room")
  const FORUM_THREADS = [
    { id: '1', title: 'Best shoes for Hyrox Manchester? 👟', author: 'Sarahfit', answers: 34, upvotes: 128, tag: 'Gear', time: '2h ago' },
    { id: '2', title: 'My partner flaked. Anyone free for doubles? 😩', author: 'GymRat_99', answers: 12, upvotes: 56, tag: 'Matchmaking', time: '4h ago' },
    { id: '3', title: 'Sled push technique: Low vs High handles?', author: 'CoachMike', answers: 8, upvotes: 42, tag: 'Strategy', time: '6h ago' },
    { id: '4', title: 'Just hit a PB on the SkiErg! 🔥', author: 'BeastMode', answers: 22, upvotes: 89, tag: 'Wins', time: '1d ago' },
    { id: '5', title: 'Is pre-workout actually worth it?', author: 'NewbieJohn', answers: 45, upvotes: 12, tag: 'Nutrition', time: '1d ago' },
    { id: '6', title: 'Chicago HYROX 2026 - Who\'s racing? 🏁', author: 'WindyCity', answers: 67, upvotes: 234, tag: 'Matchmaking', time: '3h ago' },
    { id: '7', title: 'Wall balls are destroying my shoulders 😭', author: 'SmallButMighty', answers: 29, upvotes: 78, tag: 'Strategy', time: '5h ago' },
    { id: '8', title: 'Best meal before a race?', author: 'FueledUp', answers: 52, upvotes: 91, tag: 'Nutrition', time: '8h ago' },
    { id: '9', title: 'Broke 1hr for the first time! 💪', author: 'SubHourHero', answers: 18, upvotes: 312, tag: 'Wins', time: '2h ago' },
    { id: '10', title: 'Cheapest heart rate monitor that actually works?', author: 'BudgetAthlete', answers: 41, upvotes: 63, tag: 'Gear', time: '12h ago' },
    { id: '11', title: 'Pacing strategy for relay teams?', author: 'TeamCaptain', answers: 15, upvotes: 47, tag: 'Strategy', time: '1d ago' },
    { id: '12', title: 'Anyone tried the new Reebok Nanos for HYROX?', author: 'SneakerHead', answers: 33, upvotes: 102, tag: 'Gear', time: '6h ago' },
  ];

  // Badges Data
  const BADGES = [
    { id: 'founder', icon: 'crown', label: 'Founder', color: '#FFD700', description: 'Early Member' },
    { id: 'hype', icon: 'bullhorn', label: 'Hype Person', color: '#FF4757', description: 'Shared the App' },
    { id: 'streak', icon: 'fire', label: 'On Fire', color: '#FF8C00', description: '3-Day Streak' },
    { id: 'social', icon: 'account-group', label: 'Social', color: '#2ED573', description: 'Event Regular' }
  ];
  const [isLoading, setIsLoading] = useState(true);
  const [feedMode, setFeedMode] = useState<'photos' | 'pulse' | 'forum'>('photos');

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showGuestList, setShowGuestList] = useState(false);

  // Match Mode State
  const [matchViewMode, setMatchViewMode] = useState<'stack' | 'grid'>('stack');
  const [matchFilters, setMatchFilters] = useState({ race: true, fun: true, nearMe: false });

  // Pulse & Post State
  const [pulsePosts, setPulsePosts] = useState(INITIAL_PULSE_POSTS);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [forumFilter, setForumFilter] = useState('All');
  const [feedPosts, setFeedPosts] = useState(FEED_POSTS); // Convert FEED_POSTS to state
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostHasImage, setNewPostHasImage] = useState(false);

  // Onboarding State (must be at top level - not conditional)
  const [selectedGoal, setSelectedGoal] = useState<'race' | 'fun' | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'other' | null>(null);
  const [selectedHyroxStrengths, setSelectedHyroxStrengths] = useState<string[]>([]);
  const [selectedHyroxWeaknesses, setSelectedHyroxWeaknesses] = useState<string[]>([]);
  const [findingMatch, setFindingMatch] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  const [searchText, setSearchText] = useState('Scanning nearby athletes...');
  const [matchPhotoIndex, setMatchPhotoIndex] = useState(0); // For photo carousel

  // Animation values for onboarding
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const matchScaleAnim = useRef(new Animated.Value(0.3)).current;
  const matchOpacityAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const confettiAnims = useRef(
    Array.from({ length: 30 }, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(1),
      rotate: new Animated.Value(0),
    }))
  ).current;


  // Context-aware active color:
  // Feed = Fun (Turquoise)
  // Social (Match) = Fun (Turquoise) by default, or depends on filter? User said "only training should be in red".
  // War Room = Race (Red)
  // Profile = Depends on mode
  const activeColor = (activeTab === 'feed' || activeTab === 'social') ? Colors.fun : Colors.race;

  // Swipe Animation State
  const position = React.useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });
  const rotateAndTranslate = {
    transform: [{
      rotate: rotate
    },
    ...position.getTranslateTransform()
    ]
  };
  const likeOpacity = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp'
  });
  const nopeOpacity = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: [1, 0, 0],
    extrapolate: 'clamp'
  });

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 120) {
          Animated.spring(position, {
            toValue: { x: width + 100, y: gestureState.dy },
            useNativeDriver: false // Web compatibility
          }).start(() => {
            setCurrentIndex(i => i + 1);
            position.setValue({ x: 0, y: 0 });
          });
        } else if (gestureState.dx < -120) {
          Animated.spring(position, {
            toValue: { x: -width - 100, y: gestureState.dy },
            useNativeDriver: false
          }).start(() => {
            setCurrentIndex(i => i + 1);
            position.setValue({ x: 0, y: 0 });
          });
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: false
          }).start();
        }
      }
    })
  ).current;

  // Render Athletes Logic
  // Filter & Sort Athletes for Match Tab
  const filteredAthletes = ATHLETES.filter(a => (
    (a.mode === 'race' && matchFilters.race) ||
    (a.mode === 'fun' && matchFilters.fun)
  )).sort((a, b) => {
    if (matchFilters.nearMe) {
      return (a.distance || 99) - (b.distance || 99);
    }
    return 0; // Default order
  });

  // Circular Index for infinite swipe
  const currentAthlete = filteredAthletes[currentIndex % filteredAthletes.length];
  const nextAthlete = filteredAthletes[(currentIndex + 1) % filteredAthletes.length];

  useEffect(() => {
    SoundEffects.init(); // Initialize audio on first interaction
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Reset photo carousel when switching to new card
  useEffect(() => {
    setCardPhotoIndex(0);
  }, [currentIndex]);

  const handlePost = () => {
    if (!newPostContent.trim()) {
      Alert.alert('Empty Post', 'Please write something before posting!');
      return;
    }

    const newPost = {
      id: `p${Date.now()}`,
      athlete: { ...ATHLETES[0], name: 'You' },
      content: newPostContent,
      likes: 0,
      comments: 0,
      reposts: 0,
      timeAgo: 'Just now',
      streak: 1, // New post starts a streak or adds to it
      image: newPostHasImage ? 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80' : undefined // Mock image
    };

    if (feedMode === 'pulse') {
      setPulsePosts([newPost, ...pulsePosts]);
    } else {
      // Add to photo feed
      const newPhotoPost = {
        ...newPost,
        type: 'workout',
        workout: { type: 'Training', title: 'Workout', distance: '—', duration: '—', pace: '—' }
      };
      // @ts-ignore - types are loose for mock
      setFeedPosts([newPhotoPost, ...feedPosts]);
    }

    setNewPostContent('');
    setNewPostHasImage(false);
    setShowComposeModal(false);
  };

  // Loading screen
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <StatusBar style="light" />
        <Text style={styles.logo}>🔥 THE ENGINE</Text>
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
      </View>
    );
  }

  // Guest List View (VIP Club)
  if (showGuestList && selectedEventId) {
    const event = EVENTS.find(e => e.id === selectedEventId);
    if (!event) return null;

    return (
      <View style={[styles.container, { paddingTop: 60 }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowGuestList(false)} style={{ padding: 8 }}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>VIP GUEST LIST</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={{ padding: 16 }}>
          <Text style={styles.sectionTitle}>{event.name}</Text>
          <Text style={{ color: Colors.textDim, marginBottom: 20 }}>{event.date} · {event.location}</Text>

          <Text style={[styles.sectionTitle, { fontSize: 18, marginBottom: 16 }]}>Who's going? ({event.attendees.length})</Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            {event.attendees.map(attendee => (
              <TouchableOpacity
                key={attendee.id}
                style={{ alignItems: 'center', width: '30%' }}
                onPress={() => { setShowGuestList(false); setSelectedProfileId(attendee.id); }}
              >
                <Image source={attendee.avatar} style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 8 }} />
                <Text style={{ color: 'white', fontWeight: '600' }}>{attendee.name.split(' ')[0]}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <Ionicons name="fitness" size={12} color={activeColor} />
                  <Text style={{ color: Colors.textDim, fontSize: 12, marginLeft: 4 }}>Match 98%</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  }

  // Profile View
  if (selectedProfileId) {
    const profile = ATHLETES.find(a => a.id === selectedProfileId);
    if (!profile) return null;

    const profilePosts = FEED_POSTS.filter(p => p.athlete.id === selectedProfileId);

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        {/* Profile Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
          <TouchableOpacity onPress={() => setSelectedProfileId(null)} style={{ padding: 8 }}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '700', color: 'white', marginLeft: 16 }}>Profile</Text>
        </View>

        <ScrollView style={styles.scrollContent} contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={{ alignItems: 'center', padding: 20 }}>
            <Image source={profile.avatar} style={styles.avatarCircle} />
            <Text style={styles.profileName}>{profile.name} {profile.mode === 'race' && <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />}</Text>
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
              <View style={styles.tag}><Text style={styles.tagText}>{profile.location}</Text></View>
              <View style={styles.tag}><Text style={styles.tagText}>{profile.vibeCheck}</Text></View>
            </View>
            <Text style={{ color: Colors.textDim, textAlign: 'center', lineHeight: 22, maxWidth: 300 }}>{profile.bio}</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 20, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 20 }}>
            <View style={{ alignItems: 'center' }}><Text style={styles.statValue}>24</Text><Text style={styles.statLabel}>Workouts</Text></View>
            <View style={{ alignItems: 'center' }}><Text style={styles.statValue}>1.2k</Text><Text style={styles.statLabel}>Followers</Text></View>
            <View style={{ alignItems: 'center' }}><Text style={styles.statValue}>840</Text><Text style={styles.statLabel}>Following</Text></View>
          </View>

          <Text style={[styles.sectionTitle, { paddingHorizontal: 16 }]}>Recent Activity</Text>
          <View style={{ paddingHorizontal: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {profilePosts.map(post => (
              <View key={post.id} style={{ width: '31%', aspectRatio: 1, borderRadius: 8, overflow: 'hidden', marginBottom: 4 }}>
                {post.image && <Image source={post.image} style={{ width: '100%', height: '100%' }} />}
              </View>
            ))}
            {/* Generate some placeholder grid items if not enough posts */}
            {[1, 2, 3, 4, 5, 6].map(i => (
              <View key={`placeholder-${i}`} style={{ width: '31%', aspectRatio: 1, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)', marginBottom: 4 }} />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Compose Modal
  if (showComposeModal) {
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.container}>
          <StatusBar style="light" />
          <View style={[styles.header, { borderBottomWidth: 0 }]}>
            <TouchableOpacity onPress={() => setShowComposeModal(false)} style={{ padding: 8 }}>
              <Text style={{ color: Colors.textDim, fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlePost}
              style={{ backgroundColor: activeColor, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 }}
            >
              <Text style={{ color: 'white', fontWeight: '700' }}>Post</Text>
            </TouchableOpacity>
          </View>
          <View style={{ padding: 16, flexDirection: 'row', gap: 12 }}>
            <Image source={ATHLETES[0].avatar} style={{ width: 40, height: 40, borderRadius: 20 }} />
            <TextInput
              style={{ flex: 1, color: 'white', fontSize: 18, paddingTop: 8 }}
              placeholder="What's happening?"
              placeholderTextColor={Colors.textDim}
              multiline
              autoFocus
              value={newPostContent}
              onChangeText={setNewPostContent}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  const ACTIVITIES = [
    { id: 'running', icon: 'run', library: 'MaterialCommunityIcons', label: 'Running' },
    { id: 'swimming', icon: 'swim', library: 'MaterialCommunityIcons', label: 'Swimming' },
    { id: 'cycling', icon: 'bike', library: 'MaterialCommunityIcons', label: 'Cycling' },
    { id: 'hyrox', icon: 'dumbbell', library: 'MaterialCommunityIcons', label: 'HYROX' },
    { id: 'crossfit', icon: 'weight-lifter', library: 'MaterialCommunityIcons', label: 'CrossFit' },
    { id: 'boxing', icon: 'boxing-glove', library: 'MaterialCommunityIcons', label: 'Boxing' },
    { id: 'yoga', icon: 'yoga', library: 'MaterialCommunityIcons', label: 'Yoga' },
    { id: 'climbing', icon: 'wall', library: 'MaterialCommunityIcons', label: 'Climbing' },
    { id: 'rowing', icon: 'rowing', library: 'MaterialCommunityIcons', label: 'Rowing' },
  ];

  // The 8 HYROX Stations
  // The 8 HYROX Stations
  const HYROX_STATIONS = [
    { id: 'skierg', icon: 'ski', library: 'MaterialCommunityIcons', label: 'SkiErg', distance: '1000m' },
    { id: 'sled_push', icon: 'arrow-right-bold', library: 'MaterialCommunityIcons', label: 'Sled Push', distance: '50m' },
    { id: 'sled_pull', icon: 'arrow-left-bold', library: 'MaterialCommunityIcons', label: 'Sled Pull', distance: '50m' },
    { id: 'burpee_broad_jump', icon: 'jump-rope', library: 'MaterialCommunityIcons', label: 'Burpee Broad Jumps', distance: '80m' },
    { id: 'row', icon: 'rowing', library: 'MaterialCommunityIcons', label: 'Rowing', distance: '1000m' },
    { id: 'farmers_carry', icon: 'kettlebell', library: 'MaterialCommunityIcons', label: "Farmer's Carry", distance: '200m' },
    { id: 'sandbag_lunges', icon: 'bag-personal', library: 'MaterialCommunityIcons', label: 'Sandbag Lunges', distance: '100m' },
    { id: 'wall_balls', icon: 'volleyball', library: 'MaterialCommunityIcons', label: 'Wall Balls', distance: '100 reps' },
  ];

  const toggleHyroxStrength = (id: string) => {
    setSelectedHyroxStrengths(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
    // Remove from weaknesses if adding to strengths
    setSelectedHyroxWeaknesses(prev => prev.filter(w => w !== id));
  };

  const toggleHyroxWeakness = (id: string) => {
    setSelectedHyroxWeaknesses(prev =>
      prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]
    );
    // Remove from strengths if adding to weaknesses
    setSelectedHyroxStrengths(prev => prev.filter(s => s !== id));
  };

  // The "perfect match" athlete for the reveal
  const perfectMatch = ATHLETES[0]; // Sarah - marathon runner & HYROX

  const toggleActivity = (id: string) => {
    setSelectedActivities(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const startFindingMatch = () => {
    setFindingMatch(true);
    SoundEffects.playWhoosh(); // Transition sound

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    // Cycle through search texts with beeps
    const texts = [
      'Scanning nearby athletes...',
      'Analyzing training styles...',
      'Finding your perfect match...',
      'Almost there...',
    ];
    let textIndex = 0;
    const textInterval = setInterval(() => {
      textIndex = (textIndex + 1) % texts.length;
      setSearchText(texts[textIndex]);
      SoundEffects.playBeep(); // Beep on each text change
    }, 1000);

    // After 3.5 seconds, reveal the match
    setTimeout(() => {
      clearInterval(textInterval);
      pulseAnim.stopAnimation();
      setFindingMatch(false);
      setMatchFound(true);
      triggerMatchReveal();
    }, 3500);
  };

  const triggerMatchReveal = () => {
    // Play celebration sound! 🎉
    SoundEffects.playCelebration();

    // Spring bounce for the card
    Animated.spring(matchScaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 50,
      useNativeDriver: true,
    }).start();

    // Fade in
    Animated.timing(matchOpacityAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Pulsing glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.3, duration: 500, useNativeDriver: true }),
      ]),
      { iterations: 3 }
    ).start();

    // Confetti explosion
    confettiAnims.forEach((anim, i) => {
      const angle = (i / confettiAnims.length) * 2 * Math.PI;
      const distance = 150 + Math.random() * 100;
      const targetX = Math.cos(angle) * distance;
      const targetY = Math.sin(angle) * distance - 100; // Bias upward initially

      Animated.parallel([
        Animated.timing(anim.x, {
          toValue: targetX,
          duration: 1000 + Math.random() * 500,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(anim.y, {
            toValue: targetY,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(anim.y, {
            toValue: targetY + 300, // Fall down
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(anim.rotate, {
          toValue: Math.random() * 720 - 360,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(anim.opacity, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  // Onboarding
  if (showOnboarding) {
    // Step 0: Welcome
    // Step 1: Goal Selection
    // Step 2: Activity Preferences
    // Step 3: Finding Match (auto-triggered)
    // Step 4: Match Reveal

    if (matchFound) {
      // STEP 4: Match Reveal - THE AHA MOMENT!
      const confettiColors = ['#FF4500', '#00CED1', '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];

      return (
        <View style={styles.container}>
          <LinearGradient colors={['#1a1a2e', '#0a0a0f']} style={StyleSheet.absoluteFillObject} />
          <StatusBar style="light" />

          {/* Confetti */}
          {confettiAnims.map((anim, i) => (
            <Animated.View
              key={i}
              style={{
                position: 'absolute',
                top: height / 2,
                left: width / 2,
                width: 10,
                height: 10,
                backgroundColor: confettiColors[i % confettiColors.length],
                borderRadius: 2,
                transform: [
                  { translateX: anim.x },
                  { translateY: anim.y },
                  { rotate: anim.rotate.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] }) },
                ],
                opacity: anim.opacity,
              }}
            />
          ))}

          <View style={[styles.onboardingContent, { justifyContent: 'center' }]}>
            <Text style={{ fontSize: 28, fontWeight: '800', color: 'white', textAlign: 'center', marginBottom: 8 }}>
              🎉 It's a Match!
            </Text>
            <Text style={{ fontSize: 16, color: Colors.textDim, textAlign: 'center', marginBottom: 24 }}>
              We found your perfect training partner
            </Text>

            {/* Glowing backdrop */}
            <Animated.View style={{
              position: 'absolute',
              width: 320,
              height: 420,
              borderRadius: 24,
              backgroundColor: Colors.fun,
              opacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.1, 0.3] }),
              transform: [{ scale: 1.05 }],
            }} />

            {/* Match Card */}
            <Animated.View style={{
              width: 300,
              backgroundColor: Colors.surface,
              borderRadius: 24,
              overflow: 'hidden',
              transform: [{ scale: matchScaleAnim }],
              opacity: matchOpacityAnim,
            }}>
              {/* Photo Carousel */}
              <View style={{ position: 'relative', height: 300 }}>
                {/* Photos array */}
                {[ATHLETE_IMAGES.sarah, ATHLETE_IMAGES.sarah_running, ATHLETE_IMAGES.sarah_training].map((photo, index) => (
                  <Image
                    key={index}
                    source={photo}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: 300,
                      opacity: index === matchPhotoIndex ? 1 : 0,
                    }}
                    resizeMode="cover"
                  />
                ))}

                {/* Tap zones for navigation */}
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'row' }}>
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => { SoundEffects.playTap(); setMatchPhotoIndex(i => i > 0 ? i - 1 : 2); }}
                    activeOpacity={1}
                  />
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => { SoundEffects.playTap(); setMatchPhotoIndex(i => i < 2 ? i + 1 : 0); }}
                    activeOpacity={1}
                  />
                </View>

              </View>


              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={{ position: 'absolute', top: 200, left: 0, right: 0, height: 100 }}
              />

              {/* Compatibility Badge */}
              <View style={{
                position: 'absolute',
                top: 220,
                right: 16,
                backgroundColor: Colors.fun,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
              }}>
                <Text style={{ color: 'black', fontWeight: '800', fontSize: 14 }}>98% Match</Text>
              </View>

              <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: '800', color: 'white' }}>
                  {perfectMatch.name}, {perfectMatch.age}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <Ionicons name="location" size={14} color={Colors.textDim} />
                  <Text style={{ color: Colors.textDim, marginLeft: 4 }}>{perfectMatch.location} away</Text>
                </View>

                <View style={{
                  backgroundColor: 'rgba(0,206,209,0.15)',
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 12,
                  marginTop: 12,
                }}>
                  <Text style={{ color: Colors.fun, fontSize: 14, fontWeight: '600' }}>
                    ✨ You both train for HYROX & love morning runs!
                  </Text>
                </View>
              </View>
            </Animated.View>

            {/* Photo Thumbnails - Below Card */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 8,
              marginTop: 16,
              paddingHorizontal: 20,
            }}>
              {[ATHLETE_IMAGES.sarah, ATHLETE_IMAGES.sarah_running, ATHLETE_IMAGES.sarah_training].map((photo, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setMatchPhotoIndex(i)}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 12,
                    overflow: 'hidden',
                    borderWidth: matchPhotoIndex === i ? 3 : 2,
                    borderColor: matchPhotoIndex === i ? Colors.fun : 'rgba(255,255,255,0.3)',
                    opacity: matchPhotoIndex === i ? 1 : 0.6,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }}
                >
                  <Image
                    source={photo}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.nextButton, { marginTop: 32, backgroundColor: Colors.fun }]}
              onPress={() => setShowOnboarding(false)}
            >
              <Text style={styles.nextButtonText}>Let's Go! 🔥</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (findingMatch) {
      // STEP 3: Finding Match Animation
      return (
        <View style={styles.container}>
          <LinearGradient colors={['#1a1a2e', '#0a0a0f']} style={StyleSheet.absoluteFillObject} />
          <StatusBar style="light" />

          <View style={[styles.onboardingContent, { justifyContent: 'center' }]}>
            {/* Pulsing Rings */}
            <View style={{ alignItems: 'center', justifyContent: 'center', height: 200 }}>
              <Animated.View style={{
                position: 'absolute',
                width: 150,
                height: 150,
                borderRadius: 75,
                borderWidth: 2,
                borderColor: Colors.fun,
                opacity: 0.3,
                transform: [{ scale: pulseAnim }],
              }} />
              <Animated.View style={{
                position: 'absolute',
                width: 200,
                height: 200,
                borderRadius: 100,
                borderWidth: 2,
                borderColor: Colors.fun,
                opacity: 0.2,
                transform: [{ scale: pulseAnim }],
              }} />
              <Animated.View style={{
                position: 'absolute',
                width: 250,
                height: 250,
                borderRadius: 125,
                borderWidth: 2,
                borderColor: Colors.fun,
                opacity: 0.1,
                transform: [{ scale: pulseAnim }],
              }} />

              {/* Center Icon */}
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: Colors.fun,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Ionicons name="search" size={36} color="white" />
              </View>
            </View>

            <Text style={{ fontSize: 24, fontWeight: '700', color: 'white', marginTop: 40, textAlign: 'center' }}>
              {searchText}
            </Text>
            <ActivityIndicator color={Colors.fun} size="small" style={{ marginTop: 16 }} />
          </View>
        </View>
      );
    }

    // Steps 0-2: Static onboarding screens
    return (
      <View style={styles.container}>
        {/* Background */}
        {onboardingStep === 0 ? (
          <>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=1200&q=80' }}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'black' }}
              resizeMode="cover"
            />
            <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)', '#000']} style={StyleSheet.absoluteFillObject} />
          </>
        ) : (
          <LinearGradient colors={['#1a1a2e', '#0a0a0f']} style={StyleSheet.absoluteFillObject} />
        )}

        <StatusBar style="light" />

        {onboardingStep === 0 && (
          // STEP 0: Welcome
          <View style={styles.onboardingContent}>
            <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 60 }}>
              <Text style={[styles.onboardingTitle, { fontSize: 36 }]}>Welcome to{'\n'}The Engine 🔥</Text>
              <Text style={styles.onboardingSubtitle}>Find your perfect training partners</Text>

              <TouchableOpacity style={styles.nextButton} onPress={() => { SoundEffects.init(); SoundEffects.playSuccess(); setOnboardingStep(1); }}>
                <Text style={styles.nextButtonText}>Get Started</Text>
              </TouchableOpacity>

              <View style={styles.progressDots}>
                {[0, 1, 2].map(i => (
                  <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />
                ))}
              </View>
            </View>
          </View>
        )}

        {onboardingStep === 1 && (
          // STEP 1: Profile Basics (Gender)
          <View style={styles.onboardingContent}>
            <Text style={[styles.onboardingTitle, { marginTop: 80 }]}>About You</Text>
            <Text style={styles.onboardingSubtitle}>Help us find your ideal match</Text>

            <View style={{ width: '100%', gap: 14, marginTop: 40 }}>
              {[
                { id: 'male', icon: 'gender-male', library: 'MaterialCommunityIcons', label: 'Male' },
                { id: 'female', icon: 'gender-female', library: 'MaterialCommunityIcons', label: 'Female' },
                { id: 'other', icon: 'gender-male-female', library: 'MaterialCommunityIcons', label: 'Other / Prefer not to say' },
              ].map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.genderOption,
                    selectedGender === option.id && { borderColor: Colors.race, backgroundColor: 'rgba(255,69,0,0.15)' }
                  ]}
                  onPress={() => { SoundEffects.playTap(); setSelectedGender(option.id as any); }}
                >
                  <MaterialCommunityIcons name={option.icon as any} size={28} color="white" />
                  <Text style={styles.genderOptionText}>{option.label}</Text>
                  {selectedGender === option.id && (
                    <Ionicons name="checkmark-circle" size={24} color={Colors.race} style={{ marginLeft: 'auto' }} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.nextButton, { marginTop: 32, opacity: selectedGender ? 1 : 0.5 }]}
              onPress={() => { if (selectedGender) { SoundEffects.playSuccess(); setOnboardingStep(2); } }}
              disabled={!selectedGender}
            >
              <Text style={styles.nextButtonText}>Continue</Text>
            </TouchableOpacity>

            <View style={styles.progressDots}>
              {[0, 1, 2].map(i => (
                <View key={i} style={[styles.dot, i === 1 && styles.dotActive]} />
              ))}
            </View>
          </View>
        )}

        {onboardingStep === 2 && (
          // STEP 1: Goal Selection
          <View style={styles.onboardingContent}>
            <Text style={[styles.onboardingTitle, { marginTop: 80 }]}>What brings you here?</Text>
            <Text style={styles.onboardingSubtitle}>Choose your training vibe</Text>

            <View style={{ width: '100%', gap: 16, marginTop: 40 }}>
              <TouchableOpacity
                style={[
                  styles.goalButton,
                  selectedGoal === 'race' && { borderColor: Colors.race, backgroundColor: 'rgba(255,69,0,0.15)' }
                ]}
                onPress={() => { SoundEffects.playTap(); setSelectedGoal('race'); }}
              >
                <MaterialCommunityIcons name="trophy-variant-outline" size={32} color={selectedGoal === 'race' ? Colors.race : 'white'} style={{ marginBottom: 8 }} />
                <Text style={styles.goalButtonTitle}>Race Mode</Text>
                <Text style={styles.goalButtonSubtitle}>Training for HYROX, marathons, or competitions</Text>
                {selectedGoal === 'race' && (
                  <View style={{ position: 'absolute', top: 12, right: 12 }}>
                    <Ionicons name="checkmark-circle" size={24} color={Colors.race} />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.goalButton,
                  selectedGoal === 'fun' && { borderColor: Colors.fun, backgroundColor: 'rgba(0,206,209,0.15)' }
                ]}
                onPress={() => { SoundEffects.playTap(); setSelectedGoal('fun'); }}
              >
                <MaterialCommunityIcons name="party-popper" size={32} color={selectedGoal === 'fun' ? Colors.fun : 'white'} style={{ marginBottom: 8 }} />
                <Text style={styles.goalButtonTitle}>Fun Mode</Text>
                <Text style={styles.goalButtonSubtitle}>Casual training partners & social fitness</Text>
                {selectedGoal === 'fun' && (
                  <View style={{ position: 'absolute', top: 12, right: 12 }}>
                    <Ionicons name="checkmark-circle" size={24} color={Colors.fun} />
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.nextButton, { marginTop: 32, opacity: selectedGoal ? 1 : 0.5 }]}
              onPress={() => {
                if (selectedGoal) {
                  SoundEffects.playSuccess();
                  // Race Mode goes directly to HYROX stations, Fun Mode goes to activities
                  // Both modes go to Vibe Check (Step 3)
                  setOnboardingStep(3);
                }
              }}
              disabled={!selectedGoal}
            >
              <Text style={styles.nextButtonText}>Continue</Text>
            </TouchableOpacity>

            <View style={styles.progressDots}>
              {[0, 1, 2].map(i => (
                <View key={i} style={[styles.dot, i === 2 && styles.dotActive]} />
              ))}
            </View>
          </View>
        )}

        {onboardingStep === 3 && (
          // STEP 3: Vibe Check (Replaces Activities)
          <View style={styles.onboardingContent}>
            <Text style={[styles.onboardingTitle, { marginTop: 80 }]}>Vibe Check ✨</Text>
            <Text style={styles.onboardingSubtitle}>What's your training personality?</Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginTop: 40, paddingHorizontal: 10 }}>
              {VIBES.map(vibe => (
                <TouchableOpacity
                  key={vibe.id}
                  style={[
                    styles.activityChip, // Reusing chip styles
                    selectedVibes.includes(vibe.id) && {
                      backgroundColor: Colors.fun,
                      borderColor: Colors.fun
                    }
                  ]}
                  onPress={() => {
                    SoundEffects.playTap();
                    setSelectedVibes(prev =>
                      prev.includes(vibe.id) ? prev.filter(id => id !== vibe.id) : [...prev, vibe.id]
                    );
                  }}
                >
                  <Text style={[
                    styles.activityChipText,
                    selectedVibes.includes(vibe.id) ? { color: 'black' } : { color: 'white' }
                  ]}>
                    {vibe.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.nextButton, { marginTop: 40, opacity: selectedVibes.length > 0 ? 1 : 0.5 }]}
              onPress={() => {
                if (selectedVibes.length > 0) {
                  SoundEffects.playSuccess();
                  setOnboardingStep(4); // Continue to HYROX
                }
              }}
              disabled={selectedVibes.length === 0}
            >
              <Text style={styles.nextButtonText}>Continue</Text>
            </TouchableOpacity>

            <View style={styles.progressDots}>
              {[0, 1, 2, 3].map(i => (
                <View key={i} style={[styles.dot, i === 3 && styles.dotActive]} />
              ))}
            </View>
          </View>
        )}

        {onboardingStep === 4 && (
          // STEP 4: HYROX Stations - Strengths & Weaknesses
          <View style={styles.onboardingContent}>
            <Text style={[styles.onboardingTitle, { marginTop: 10, fontSize: 24 }]}>Your HYROX Profile (Root) 💪</Text>
            <Text style={styles.onboardingSubtitle}>Select your strengths & weaknesses to find complementary partners</Text>

            <ScrollView
              style={{ flex: 1, marginTop: 10 }}
              contentContainerStyle={{ paddingBottom: 140 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Strengths Section */}
              <View style={{ marginBottom: 28 }}>
                <Text style={{ color: '#4ADE80', fontSize: 16, fontWeight: '700', marginBottom: 14 }}>
                  💪 Your Strengths
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  {HYROX_STATIONS.map(station => (
                    <TouchableOpacity
                      key={station.id}
                      style={[
                        styles.hyroxChipSimple,
                        selectedHyroxStrengths.includes(station.id) && {
                          backgroundColor: '#4ADE80',
                          borderColor: '#4ADE80',
                        }
                      ]}
                      onPress={() => { SoundEffects.playTap(); toggleHyroxStrength(station.id); }}
                    >
                      <MaterialCommunityIcons
                        name={station.icon as any}
                        size={20}
                        color={selectedHyroxStrengths.includes(station.id) ? 'black' : 'white'}
                      />
                      <Text style={[
                        styles.hyroxChipLabel,
                        selectedHyroxStrengths.includes(station.id) && { color: 'black' }
                      ]}>
                        {station.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Weaknesses Section */}
              <View style={{ marginBottom: 28 }}>
                <Text style={{ color: '#FB7185', fontSize: 16, fontWeight: '700', marginBottom: 14 }}>
                  🔥 Needs Work
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  {HYROX_STATIONS.map(station => (
                    <TouchableOpacity
                      key={station.id}
                      style={[
                        styles.hyroxChipSimple,
                        selectedHyroxWeaknesses.includes(station.id) && {
                          backgroundColor: '#FB7185', // Rose color (softer than red)
                          borderColor: '#FB7185',
                        }
                      ]}
                      onPress={() => { SoundEffects.playTap(); toggleHyroxWeakness(station.id); }}
                    >
                      <MaterialCommunityIcons
                        name={station.icon as any}
                        size={20}
                        color={selectedHyroxWeaknesses.includes(station.id) ? 'black' : 'white'}
                      />
                      <Text style={[
                        styles.hyroxChipLabel,
                        selectedHyroxWeaknesses.includes(station.id) && { color: 'black' }
                      ]}>
                        {station.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Tip */}
              <View style={{ backgroundColor: 'rgba(0,206,209,0.1)', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,206,209,0.3)' }}>
                <Text style={{ color: Colors.fun, fontSize: 14 }}>
                  💡 Tip: We'll match you with athletes whose strengths complement your weaknesses!
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.nextButton, { position: 'absolute', bottom: 50, left: 20, right: 20 }]}
              onPress={() => { SoundEffects.playSuccess(); startFindingMatch(); }}
            >
              <Text style={styles.nextButtonText}>Find My Match ✨</Text>
            </TouchableOpacity>

            <View style={[styles.progressDots, { position: 'absolute', bottom: 20, left: 0, right: 0 }]}>
              {[0, 1, 2, 3].map(i => (
                <View key={i} style={[styles.dot, i === 3 && styles.dotActive]} />
              ))}
            </View>
          </View>
        )}
      </View>
    );
  }

  // Main App
  const renderContent = () => {
    switch (activeTab) {
      case 'social':
        return (
          <View style={styles.container}>
            <LinearGradient
              colors={[Colors.background, '#1a1a2e', Colors.background]}
              style={StyleSheet.absoluteFillObject}
            />
            {/* Match Header: Filters & Toggle */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  style={[styles.modeChip, { backgroundColor: matchFilters.race ? Colors.race : 'transparent', borderWidth: 1, borderColor: Colors.race }]}
                  onPress={() => setMatchFilters(f => ({ ...f, race: !f.race }))}
                >
                  <Text style={[styles.modeChipText, { color: matchFilters.race ? 'white' : Colors.race, fontSize: 13 }]}>🏁 Race (Root)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modeChip, { backgroundColor: matchFilters.fun ? Colors.fun : 'transparent', borderWidth: 1, borderColor: Colors.fun }]}
                  onPress={() => setMatchFilters(f => ({ ...f, fun: !f.fun }))}
                >
                  <Text style={[styles.modeChipText, { color: matchFilters.fun ? 'black' : Colors.fun, fontSize: 13 }]}>🎉 Fun</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modeChip, { backgroundColor: matchFilters.nearMe ? activeColor : 'transparent', borderWidth: 1, borderColor: activeColor }]}
                  onPress={() => setMatchFilters(f => ({ ...f, nearMe: !f.nearMe }))}
                >
                  <Text style={[styles.modeChipText, { color: matchFilters.nearMe ? 'white' : activeColor, fontSize: 13 }]}>📍 Near Me</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => setMatchViewMode(m => m === 'stack' ? 'grid' : 'stack')}
                style={{ padding: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20 }}
              >
                <Ionicons name={matchViewMode === 'stack' ? 'grid' : 'albums'} size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* Events Horizontal Scroll (Visible in BOTH Stack and Grid) */}
            <View style={{ height: 120, marginBottom: 10 }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                {EVENTS.map(event => (
                  <TouchableOpacity
                    key={event.id}
                    style={styles.eventHeaderCard}
                    onPress={() => { setSelectedEventId(event.id); setShowGuestList(true); }}
                  >
                    <Image source={{ uri: event.image }} style={styles.eventHeaderImg} />
                    <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.eventHeaderGradient} />
                    <Text style={styles.eventHeaderName}>{event.name}</Text>
                    <Text style={styles.eventHeaderDate}>{event.date}</Text>
                    <View style={styles.attendeeBadge}>
                      <Ionicons name="people" size={12} color="white" />
                      <Text style={styles.attendeeCount}>{event.attendees.length}+</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Content: Stack or Grid */}
            {matchViewMode === 'stack' ? (
              filteredAthletes.length > 0 ? (
                <View style={styles.cardContainer}>
                  {/* Next Card (Behind) */}
                  <View style={[styles.card, { position: 'absolute', transform: [{ scale: 0.95 }], opacity: 0.8 }]}>
                    <Image source={nextAthlete.avatar} style={{ position: 'absolute', width: '100%', height: '100%' }} resizeMode="cover" />
                    <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)', '#000']} style={styles.cardGradient} />
                    <View style={[styles.modeBadge, { backgroundColor: nextAthlete.mode === 'race' ? Colors.race : Colors.fun }]}>
                      <Text style={styles.modeBadgeText}>{nextAthlete.mode === 'race' ? '🏁 RACE' : '🎉 FUN'}</Text>
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={styles.athleteName}>{nextAthlete.name}, {nextAthlete.age}</Text>
                      <Text style={styles.locationText}><Ionicons name="location" size={12} color={Colors.textDim} /> {nextAthlete.location}</Text>
                      <Text style={styles.bioText}>{nextAthlete.bio}</Text>
                      <View style={styles.tag}><Text style={styles.tagText}>{nextAthlete.vibeCheck}</Text></View>
                    </View>
                  </View>

                  {/* Current Card (Animated) */}
                  <Animated.View
                    {...panResponder.panHandlers}
                    style={[styles.card, rotateAndTranslate]}
                  >
                    {/* Photo Carousel */}
                    {currentAthlete.photos?.map((photo, idx) => (
                      <Image
                        key={idx}
                        source={photo}
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          opacity: idx === cardPhotoIndex ? 1 : 0
                        }}
                        resizeMode="cover"
                      />
                    )) || <Image source={currentAthlete.avatar} style={{ position: 'absolute', width: '100%', height: '100%' }} resizeMode="cover" />}


                    {/* Gradient Overlay */}
                    <LinearGradient colors={['transparent', 'transparent', 'rgba(0,0,0,0.8)']} style={StyleSheet.absoluteFillObject} pointerEvents="none" />

                    {/* Tap Zones for Photos */}
                    <View style={{ flexDirection: 'row', position: 'absolute', top: 0, left: 0, right: 0, bottom: 150 }}>
                      <TouchableOpacity style={{ flex: 1 }} onPress={() => setCardPhotoIndex(i => Math.max(0, i - 1))} />
                      <TouchableOpacity style={{ flex: 1 }} onPress={() => setCardPhotoIndex(i => Math.min((currentAthlete.photos?.length || 1) - 1, i + 1))} />
                    </View>

                    <View style={[styles.modeBadge, { backgroundColor: currentAthlete.mode === 'race' ? Colors.race : Colors.fun }]}>
                      <Text style={styles.modeBadgeText}>{currentAthlete.mode === 'race' ? '🏁 RACE' : '🎉 FUN'}</Text>
                    </View>

                    <View style={styles.cardContent}>
                      <Text style={styles.athleteName}>{currentAthlete.name}, {currentAthlete.age}</Text>
                      <Text style={styles.locationText}><Ionicons name="location" size={12} color={Colors.textDim} /> {currentAthlete.location}</Text>
                      <Text style={styles.bioText}>{currentAthlete.bio}</Text>
                      <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                        <View style={styles.tag}><Text style={styles.tagText}>{currentAthlete.vibeCheck}</Text></View>
                      </View>
                    </View>

                    {/* Action Buttons Overlay */}
                    <View style={{ position: 'absolute', bottom: 20, right: 20, flexDirection: 'row', gap: 16 }}>
                      <TouchableOpacity style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.race }} onPress={() => { SoundEffects.playTap(); setCurrentIndex(currentIndex + 1); }}>
                        <Ionicons name="close" size={24} color={Colors.race} />
                      </TouchableOpacity>
                      <TouchableOpacity style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: activeColor, justifyContent: 'center', alignItems: 'center', shadowColor: activeColor, shadowOpacity: 0.5, shadowRadius: 10 }} onPress={() => { SoundEffects.playSuccess(); setCurrentIndex(currentIndex + 1); }}>
                        <Ionicons name="heart" size={30} color="white" />
                      </TouchableOpacity>
                      <TouchableOpacity style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.fun }} onPress={() => { SoundEffects.playCelebration(); setCurrentIndex(currentIndex + 1); }}>
                        <Ionicons name="star" size={24} color={Colors.fun} />
                      </TouchableOpacity>
                    </View>
                  </Animated.View>

                  {/* Photo Thumbnails (Outside Card) */}
                  <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 24 }}>
                    {currentAthlete.photos?.map((photo, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => { SoundEffects.playTap(); setCardPhotoIndex(idx); }}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 12,
                          overflow: 'hidden',
                          borderWidth: idx === cardPhotoIndex ? 3 : 2,
                          borderColor: idx === cardPhotoIndex ? activeColor : 'rgba(255,255,255,0.3)',
                          opacity: idx === cardPhotoIndex ? 1 : 0.6,
                          backgroundColor: 'rgba(0,0,0,0.3)',
                        }}
                      >
                        <Image
                          source={photo}
                          style={{ width: '100%', height: '100%' }}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

              ) : (
                <View style={[styles.centered, { flex: 1, minHeight: 400 }]}>
                  <Text style={{ color: Colors.textDim }}>No athletes found with current filters.</Text>
                </View>
              )
            ) : (
              // Grid View
              <ScrollView style={styles.scrollContent} contentContainerStyle={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                  {filteredAthletes.map(athlete => (
                    <TouchableOpacity
                      key={athlete.id}
                      style={{ width: '31%', aspectRatio: 0.75, borderRadius: 16, overflow: 'hidden', backgroundColor: Colors.surface }}
                      onPress={() => setSelectedProfileId(athlete.id)}
                    >
                      <Image source={athlete.avatar} style={{ width: '100%', height: '100%' }} />
                      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%' }} />
                      <View style={{ position: 'absolute', bottom: 8, left: 8 }}>
                        <Text style={{ color: 'white', fontWeight: '700', fontSize: 13 }}>{athlete.name.split(' ')[0]}, {athlete.age}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2, gap: 6 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="location" size={10} color={Colors.textDim} />
                            <Text style={{ color: Colors.textDim, fontSize: 10, marginLeft: 2 }}>{athlete.distance} mi</Text>
                          </View>
                        </View>
                      </View>
                      <View style={{ position: 'absolute', top: 6, right: 6, backgroundColor: athlete.mode === 'race' ? Colors.race : Colors.fun, paddingHorizontal: 4, paddingVertical: 2, borderRadius: 6 }}>
                        <Text style={{ fontSize: 9, fontWeight: '700', color: athlete.mode === 'fun' ? 'black' : 'white' }}>{athlete.mode === 'race' ? 'RACE' : 'FUN'}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            )
            }

          </View >
        );
      case 'warroom':
        return (
          <ScrollView style={styles.scrollContent} contentContainerStyle={{ padding: 16 }}>
            <Text style={styles.sectionTitle}>🏋️ Training Dashboard</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}><Text style={styles.statValue}>12</Text><Text style={styles.statLabel}>Workouts</Text></View>
              <View style={styles.statCard}><Text style={styles.statValue}>48km</Text><Text style={styles.statLabel}>Distance</Text></View>
              <View style={styles.statCard}><Text style={styles.statValue}>5:12</Text><Text style={styles.statLabel}>Avg Pace</Text></View>
              <View style={styles.statCard}><Text style={styles.statValue}>85</Text><Text style={styles.statLabel}>Score</Text></View>
            </View>
          </ScrollView>
        );

      case 'feed':
        return (
          <View style={{ flex: 1 }}>
            {/* Feed Mode Toggle - Photos vs Pulse (Sticky) */}
            <View style={[styles.feedToggle, { margin: 16, marginBottom: 0 }]}>
              <TouchableOpacity
                style={[styles.feedToggleBtn, feedMode === 'photos' && { backgroundColor: activeColor }]}
                onPress={() => setFeedMode('photos')}
              >
                <Ionicons name="images" size={18} color={feedMode === 'photos' ? 'white' : Colors.textDim} />
                <Text style={[styles.feedToggleText, feedMode === 'photos' && { color: 'white' }]}>Photos</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.feedToggleBtn, feedMode === 'pulse' && { backgroundColor: activeColor }]}
                onPress={() => setFeedMode('pulse')}
              >
                <Ionicons name="chatbubbles" size={18} color={feedMode === 'pulse' ? 'white' : Colors.textDim} />
                <Text style={[styles.feedToggleText, feedMode === 'pulse' && { color: 'white' }]}>Pulse</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.feedToggleBtn, feedMode === 'forum' && { backgroundColor: activeColor }]}
                onPress={() => setFeedMode('forum')}
              >
                <MaterialCommunityIcons name="forum-outline" size={18} color={feedMode === 'forum' ? 'white' : Colors.textDim} />
                <Text style={[styles.feedToggleText, feedMode === 'forum' && { color: 'white' }]}>Locker Room</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContent} contentContainerStyle={{ padding: 16 }}>

              {feedMode === 'photos' ? (
                <>
                  {/* Stories Row */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                    <TouchableOpacity
                      style={styles.storyBubble}
                      onPress={() => { setNewPostHasImage(true); setShowComposeModal(true); }}
                    >
                      <View style={[styles.storyRing, { backgroundColor: Colors.surface }]}>
                        <View style={styles.storyAvatar}>
                          <Ionicons name="add" size={24} color={activeColor} />
                        </View>
                      </View>
                      <Text style={styles.storyName}>Add</Text>
                    </TouchableOpacity>
                    {ATHLETES.map((athlete) => (
                      <TouchableOpacity key={athlete.id} style={styles.storyBubble}>
                        <LinearGradient colors={[activeColor, '#FFD700']} style={styles.storyRing}>
                          <Image source={athlete.avatar} style={styles.storyAvatarImg} />
                        </LinearGradient>
                        <Text style={styles.storyName}>{athlete.name.split(' ')[0]}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  {/* Compose Prompt for Photos */}
                  <TouchableOpacity
                    style={[styles.composePulse, { marginBottom: 24 }]}
                    onPress={() => { setNewPostHasImage(true); setShowComposeModal(true); }}
                  >
                    <View style={styles.composeAvatar}><Ionicons name="person" size={20} color="white" /></View>
                    <Text style={styles.composePlaceholder}>Post a workout photo...</Text>
                    <Ionicons name="images" size={20} color={activeColor} />
                  </TouchableOpacity>

                  {/* Photo Posts */}
                  {feedPosts.map(post => (
                    <View key={post.id} style={styles.feedPost}>
                      <View style={styles.postHeader}>
                        <TouchableOpacity onPress={() => setSelectedProfileId(post.athlete.id)}>
                          <Image source={post.athlete.avatar} style={styles.postAvatarImg} />
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <TouchableOpacity onPress={() => setSelectedProfileId(post.athlete.id)}>
                              <Text style={styles.postAuthor}>{post.athlete.name}</Text>
                            </TouchableOpacity>
                            <Ionicons name="checkmark-circle" size={14} color={activeColor} />
                          </View>
                          <Text style={styles.postTime}>{post.timeAgo} · {post.athlete.location}</Text>
                        </View>
                        <TouchableOpacity>
                          <Ionicons name="ellipsis-horizontal" size={20} color={Colors.textDim} />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.postContent}>{post.content}</Text>
                      {post.image && (
                        <TouchableOpacity activeOpacity={0.9} onPress={() => setSelectedProfileId(post.athlete.id)} style={styles.postImageContainer}>
                          <Image source={post.image} style={styles.postImage} resizeMode="cover" />
                        </TouchableOpacity>
                      )}
                      {post.workout && (
                        <View style={styles.workoutCard}>
                          <View style={styles.workoutHeader}>
                            <Ionicons name={post.workout.type === 'Running' ? 'walk' : 'water'} size={20} color={activeColor} />
                            <Text style={styles.workoutType}>{post.workout.title || post.workout.type}</Text>
                          </View>
                          <View style={styles.workoutStats}>
                            <View style={styles.workoutStat}><Text style={styles.workoutValue}>{post.workout.distance}</Text><Text style={styles.workoutLabel}>Distance</Text></View>
                            <View style={styles.workoutStat}><Text style={styles.workoutValue}>{post.workout.duration}</Text><Text style={styles.workoutLabel}>Time</Text></View>
                            <View style={styles.workoutStat}><Text style={styles.workoutValue}>{post.workout.pace}</Text><Text style={styles.workoutLabel}>Pace</Text></View>
                          </View>
                        </View>
                      )}
                      {post.achievement && (
                        <View style={styles.achievementBadge}>
                          <Text style={styles.achievementIcon}>{post.achievement.icon}</Text>
                          <Text style={styles.achievementTitle}>{post.achievement.title}</Text>
                        </View>
                      )}
                      {post.event && (
                        <View style={styles.eventMini}>
                          <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: activeColor, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 18 }}>📅</Text></View>
                          <View>
                            <Text style={styles.eventMiniName}>{post.event.name}</Text>
                            <Text style={styles.eventMiniDate}>{post.event.date}</Text>
                          </View>
                        </View>
                      )}
                      <View style={styles.postActions}>
                        <TouchableOpacity style={styles.postAction}><Ionicons name="heart-outline" size={22} color={Colors.textDim} /><Text style={styles.postActionText}>{post.likes}</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.postAction}><Ionicons name="chatbubble-outline" size={20} color={Colors.textDim} /><Text style={styles.postActionText}>{post.comments}</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.postAction}><Ionicons name="share-outline" size={22} color={Colors.textDim} /></TouchableOpacity>
                        <TouchableOpacity style={[styles.postAction, { marginLeft: 'auto' }]}><Ionicons name="bookmark-outline" size={22} color={Colors.textDim} /></TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </>
              ) : feedMode === 'pulse' ? (
                <>
                  {/* Compose Pulse */}
                  <View style={styles.composePulse}>
                    <View style={styles.composeAvatar}><Ionicons name="person" size={20} color="white" /></View>
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowComposeModal(true)}>
                      <Text style={styles.composePlaceholder}>What's on your mind?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.composeBtn, { backgroundColor: activeColor }]} onPress={() => setShowComposeModal(true)}>
                      <Text style={styles.composeBtnText}>Post</Text>
                    </TouchableOpacity>
                  </View>

                  {pulsePosts.map(post => (
                    <View key={post.id} style={styles.pulsePost}>
                      <TouchableOpacity onPress={() => setSelectedProfileId(post.athlete.id)}>
                        <Image source={post.athlete.avatar} style={styles.pulseAvatar} />
                      </TouchableOpacity>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <TouchableOpacity onPress={() => setSelectedProfileId(post.athlete.id)}>
                            <Text style={styles.pulseName}>{post.athlete.name}</Text>
                          </TouchableOpacity>
                          <Ionicons name="checkmark-circle" size={12} color={activeColor} />
                          <Text style={styles.pulseTime}>· {post.timeAgo}</Text>
                        </View>
                        <Text style={styles.pulseContent}>{post.content}</Text>
                        {post.image && (
                          <TouchableOpacity onPress={() => setSelectedProfileId(post.athlete.id)} activeOpacity={0.9} style={{ marginBottom: 12, borderRadius: 12, overflow: 'hidden' }}>
                            <Image source={post.image} style={{ width: '100%', height: 200, backgroundColor: '#2a2a35' }} resizeMode="cover" />
                          </TouchableOpacity>
                        )}
                        <View style={styles.pulseActions}>
                          <TouchableOpacity style={styles.pulseAction}>
                            <Ionicons name="heart-outline" size={18} color={Colors.textDim} />
                            <Text style={styles.pulseActionText}>{post.likes}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.pulseAction}>
                            <Ionicons name="chatbubble-outline" size={16} color={Colors.textDim} />
                            <Text style={styles.pulseActionText}>{post.comments}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.pulseAction}>
                            <Ionicons name="repeat" size={18} color={Colors.textDim} />
                            <Text style={styles.pulseActionText}>{post.reposts}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.pulseAction}>
                            <Ionicons name="share-outline" size={18} color={Colors.textDim} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))}
                </>
              ) : (
                <>
                  {/* Forum Header / Tags */}
                  <View style={{ marginBottom: 16 }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                      {['All', 'Strategy', 'Gear', 'Matchmaking', 'Wins', 'Nutrition'].map((tag) => (
                        <TouchableOpacity
                          key={tag}
                          onPress={() => setForumFilter(tag)}
                          style={{
                            backgroundColor: forumFilter === tag ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 20
                          }}
                        >
                          <Text style={{ color: forumFilter === tag ? 'white' : Colors.textDim, fontWeight: '600', fontSize: 13 }}>{tag}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  {/* Forum Threads */}
                  {FORUM_THREADS
                    .filter(thread => forumFilter === 'All' || thread.tag === forumFilter)
                    .map((thread) => (
                      <TouchableOpacity
                        key={thread.id}
                        onPress={() => {
                          Alert.alert('Thread Clicked', `Thread ID: ${thread.id}`);
                          setSelectedThread(thread.id);
                        }}
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          borderRadius: 16,
                          padding: 16,
                          marginBottom: 12,
                          borderWidth: 1,
                          borderColor: 'rgba(255,255,255,0.05)'
                        }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <View style={{ flex: 1, marginRight: 12 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                              <View style={{ backgroundColor: 'rgba(0,206,209,0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginRight: 8 }}>
                                <Text style={{ color: Colors.fun, fontSize: 10, fontWeight: '800', textTransform: 'uppercase' }}>{thread.tag}</Text>
                              </View>
                              <Text style={{ color: Colors.textDim, fontSize: 12 }}>@{thread.author} • {thread.time}</Text>
                            </View>
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: '700', lineHeight: 22, marginBottom: 4 }}>{thread.title}</Text>

                            <View style={{ flexDirection: 'row', marginTop: 8, gap: 16 }}>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialCommunityIcons name="comment-outline" size={16} color={Colors.textDim} />
                                <Text style={{ color: Colors.textDim, fontSize: 13, marginLeft: 4 }}>{thread.answers} comments</Text>
                              </View>
                            </View>
                          </View>

                          <View style={{ alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12, paddingVertical: 6, width: 40 }}>
                            <Ionicons name="caret-up" size={18} color={activeColor} />
                            <Text style={{ color: 'white', fontWeight: '700', fontSize: 12, marginVertical: 1 }}>{thread.upvotes}</Text>
                            <Ionicons name="caret-down" size={18} color={Colors.textDim} />
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}

                  <TouchableOpacity style={{ alignItems: 'center', padding: 20 }}>
                    <Text style={{ color: Colors.textDim }}>View all topics...</Text>
                  </TouchableOpacity>

                  <View style={{ height: 60 }} />
                </>
              )}
            </ScrollView>
          </View>
        );
      case 'market':
        if (marketView === 'all_lives') {
          const filteredLives = MARKET_LIVE_STREAMS.filter(stream =>
            liveCategory === 'all' || stream.category === liveCategory
          );

          return (
            <View style={styles.container}>
              {/* Header */}
              <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <TouchableOpacity onPress={() => setMarketView('home')} style={{ padding: 4 }}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.sectionTitle}>🔥 Live Auctions</Text>
              </View>

              {/* Categories */}
              <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {MARKET_CATEGORIES.map(cat => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[styles.tag, { backgroundColor: liveCategory === cat.id ? activeColor : Colors.surface, borderWidth: 0 }]}
                      onPress={() => setLiveCategory(cat.id)}
                    >
                      <Text style={[styles.tagText, { color: liveCategory === cat.id ? 'white' : Colors.textDim }]}>{cat.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Grid */}
              <ScrollView style={styles.scrollContent} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                  {filteredLives.map(stream => (
                    <TouchableOpacity key={stream.id} style={{ width: '48%', aspectRatio: 0.7, borderRadius: 16, overflow: 'hidden', backgroundColor: Colors.surface, marginBottom: 16 }}>
                      <Image source={stream.image} style={{ width: '100%', height: '100%' }} />
                      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120 }} />

                      <View style={{ position: 'absolute', top: 8, left: 8, backgroundColor: '#FF0000', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                        <Text style={{ color: 'white', fontSize: 10, fontWeight: '800' }}>LIVE</Text>
                      </View>

                      <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="eye" size={10} color="white" style={{ marginRight: 4 }} />
                        <Text style={{ color: 'white', fontSize: 10 }}>{(stream.viewers / 1000).toFixed(1)}k</Text>
                      </View>

                      <View style={{ position: 'absolute', bottom: 12, left: 12, right: 12 }}>
                        <Text style={{ color: 'white', fontWeight: '700', fontSize: 14, marginBottom: 4 }} numberOfLines={2}>{stream.title}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Image source={stream.avatar} style={{ width: 16, height: 16, borderRadius: 8, marginRight: 6 }} />
                          <Text style={{ color: Colors.textDim, fontSize: 12 }} numberOfLines={1}>{stream.host}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          );
        }

        // Market Home View
        const filteredProducts = MARKET_PRODUCTS.filter(p => {
          const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
          const matchesSearch = p.name.toLowerCase().includes(marketSearch.toLowerCase());
          const matchesCondition = p.condition === (showUsed ? 'Used' : 'New');
          return matchesCategory && matchesSearch && matchesCondition;
        });

        return (
          <View style={styles.container}>
            {/* Market Header */}
            <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
              <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 12, paddingHorizontal: 12, height: 44 }}>
                  <Ionicons name="search" size={20} color={Colors.textDim} />
                  <TextInput
                    style={{ flex: 1, color: 'white', marginLeft: 8, fontSize: 16 }}
                    placeholder="Search gear, tickets..."
                    placeholderTextColor={Colors.textDim}
                    value={marketSearch}
                    onChangeText={setMarketSearch}
                  />
                </View>
                <TouchableOpacity
                  style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => setShowScanner(true)}
                >
                  <Ionicons name="camera" size={24} color={Colors.fun} />
                </TouchableOpacity>
              </View>

              {/* Categories */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {MARKET_CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.tag, { backgroundColor: selectedCategory === cat.id ? activeColor : Colors.surface, borderWidth: 0 }]}
                    onPress={() => setSelectedCategory(cat.id)}
                  >
                    <Text style={[styles.tagText, { color: selectedCategory === cat.id ? 'white' : Colors.textDim }]}>{cat.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <ScrollView style={styles.scrollContent} contentContainerStyle={{ paddingBottom: 100 }}>
              {/* Live Auctions Section */}
              <View style={{ marginBottom: 24 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 }}>
                  <Text style={styles.sectionTitle}>🔥 Live Auctions</Text>
                  <TouchableOpacity onPress={() => setMarketView('all_lives')}><Text style={{ color: Colors.fun }}>See All</Text></TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
                  {MARKET_LIVE_STREAMS.slice(0, 3).map(stream => (
                    <TouchableOpacity key={stream.id} style={{ width: 140, height: 200, borderRadius: 16, overflow: 'hidden', backgroundColor: Colors.surface }}>
                      <Image source={stream.image} style={{ width: '100%', height: '100%' }} />
                      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100 }} />

                      <View style={{ position: 'absolute', top: 8, left: 8, backgroundColor: '#FF0000', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                        <Text style={{ color: 'white', fontSize: 10, fontWeight: '800' }}>LIVE</Text>
                      </View>

                      <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="eye" size={10} color="white" style={{ marginRight: 4 }} />
                        <Text style={{ color: 'white', fontSize: 10 }}>{(stream.viewers / 1000).toFixed(1)}k</Text>
                      </View>

                      <View style={{ position: 'absolute', bottom: 12, left: 12, right: 12 }}>
                        <Text style={{ color: 'white', fontWeight: '700', fontSize: 14, marginBottom: 4 }} numberOfLines={2}>{stream.title}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Image source={stream.avatar} style={{ width: 16, height: 16, borderRadius: 8, marginRight: 6 }} />
                          <Text style={{ color: Colors.textDim, fontSize: 12 }}>{stream.host}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Products Section */}
              <View style={{ paddingHorizontal: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Text style={styles.sectionTitle}>Top Picks</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 20, padding: 4 }}>
                    <TouchableOpacity
                      style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: !showUsed ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                      onPress={() => setShowUsed(false)}
                    >
                      <Text style={{ color: !showUsed ? 'white' : Colors.textDim, fontSize: 12, fontWeight: '600' }}>New</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: showUsed ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                      onPress={() => setShowUsed(true)}
                    >
                      <Text style={{ color: showUsed ? 'white' : Colors.textDim, fontSize: 12, fontWeight: '600' }}>Used</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                  {filteredProducts.map(product => (
                    <TouchableOpacity key={product.id} style={{ width: '48%', backgroundColor: Colors.surface, borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
                      <View style={{ height: 150, backgroundColor: '#fff' }}>
                        <Image source={product.image} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                        {product.condition === 'Used' && (
                          <View style={{ position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}>
                            <Text style={{ color: 'white', fontSize: 10, fontWeight: '700' }}>USED</Text>
                          </View>
                        )}
                      </View>

                      <View style={{ padding: 12 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                          <Text style={{ color: Colors.textDim, fontSize: 10, textTransform: 'uppercase' }}>{product.category}</Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="star" size={10} color="#FFD700" />
                            <Text style={{ color: 'white', fontSize: 10, marginLeft: 2 }}>{product.rating}</Text>
                          </View>
                        </View>

                        <Text style={{ color: 'white', fontWeight: '600', fontSize: 14, marginBottom: 4 }} numberOfLines={2}>{product.name}</Text>
                        <Text style={{ color: 'white', fontWeight: '800', fontSize: 16 }}>${product.price}</Text>

                        {product.prime && (
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                            <Ionicons name="checkmark-circle" size={12} color={Colors.fun} />
                            <Text style={{ color: Colors.fun, fontSize: 10, marginLeft: 4, fontWeight: '700' }}>PRIME</Text>
                          </View>
                        )}
                        <Text style={{ color: Colors.textDim, fontSize: 10, marginTop: 4 }}>Sold by {product.seller}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            {/* Simulated AI Scanner Modal */}
            <Modal visible={showScanner} animationType="slide" transparent>
              <View style={{ flex: 1, backgroundColor: 'black' }}>
                <SafeAreaView style={{ flex: 1 }}>
                  {/* Camera Header */}
                  <View style={{ padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                    <TouchableOpacity onPress={() => setShowScanner(false)}>
                      <Ionicons name="close" size={28} color="white" />
                    </TouchableOpacity>
                    <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>AI Product Scanner</Text>
                    <Ionicons name="flash-off" size={24} color="white" />
                  </View>

                  {/* Camera Viewfinder (Simulated) */}
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {/* Background Camera Feed Simulation */}
                    <Image
                      source={require('./assets/images/market_nike.png')}
                      style={{ position: 'absolute', width: '80%', height: '40%', opacity: 0.5 }}
                      resizeMode="contain"
                    />
                    <Text style={{ position: 'absolute', color: 'rgba(255,255,255,0.3)', top: '20%' }}>Simulated Camera Feed</Text>

                    {/* Scanning Frame */}
                    <View style={{ width: 300, height: 300, borderWidth: 2, borderColor: isScanning ? Colors.fun : 'white', borderRadius: 24, justifyContent: 'center', alignItems: 'center' }}>
                      {isScanning && (
                        <Animated.View style={{
                          width: '100%',
                          height: 2,
                          backgroundColor: Colors.fun,
                          shadowColor: Colors.fun,
                          shadowOpacity: 1,
                          shadowRadius: 10,
                          top: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 290] })
                        }} />
                      )}
                      {!isScanning && !scanResult && <Text style={{ color: 'white', fontWeight: '600' }}>Align product in frame</Text>}
                    </View>

                    {/* HUD Overlay */}
                    {isScanning && (
                      <View style={{ position: 'absolute', bottom: 150, padding: 16, backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: 12 }}>
                        <Text style={{ color: Colors.fun, fontWeight: '700' }}>Analyzing object...</Text>
                        <Text style={{ color: 'white', fontSize: 12 }}>Identifying features...</Text>
                      </View>
                    )}
                  </View>

                  {/* Camera Controls / Result */}
                  <View style={{ padding: 32, alignItems: 'center' }}>
                    {!scanResult ? (
                      <TouchableOpacity
                        style={{ width: 80, height: 80, borderRadius: 40, borderWidth: 6, borderColor: 'white', justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => {
                          setIsScanning(true);
                          SoundEffects.playBeep();

                          // Simulate scanning process
                          Animated.loop(
                            Animated.sequence([
                              Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: false }),
                              Animated.timing(pulseAnim, { toValue: 0, duration: 1000, useNativeDriver: false })
                            ])
                          ).start();

                          setTimeout(() => {
                            setIsScanning(false);
                            SoundEffects.playSuccess();
                            setScanResult(MARKET_PRODUCTS[0]); // Find Nike Metcon result
                          }, 3000);
                        }}
                      >
                        <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: 'white' }} />
                      </TouchableOpacity>
                    ) : (
                      // Result Card
                      <View style={{ width: '100%', backgroundColor: Colors.surface, padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                        <Image source={scanResult.image} style={{ width: 60, height: 60, borderRadius: 8, backgroundColor: 'white' }} resizeMode="contain" />
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: Colors.fun, fontSize: 12, fontWeight: '700' }}>MATCH FOUND!</Text>
                          <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>{scanResult.name}</Text>
                          <Text style={{ color: Colors.textDim, fontSize: 14 }}>${scanResult.price} · {scanResult.seller}</Text>
                        </View>
                        <TouchableOpacity
                          style={{ backgroundColor: Colors.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 }}
                          onPress={() => { setShowScanner(false); setScanResult(null); }}
                        >
                          <Text style={{ color: 'white', fontWeight: '700' }}>View</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </SafeAreaView>
              </View>
            </Modal>
          </View>
        );
      case 'profile':
        return (
          <ScrollView style={styles.scrollContent} contentContainerStyle={{ paddingBottom: 100 }}>
            {/* 1. Header Section */}
            <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 24 }}>
              <View style={styles.avatarCircle}>
                <MaterialCommunityIcons name="account" size={60} color={Colors.textDim} />
                <View style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: selectedGoal === 'race' ? Colors.race : Colors.fun,
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 3,
                  borderColor: Colors.background
                }}>
                  <MaterialCommunityIcons
                    name={selectedGoal === 'race' ? "trophy-variant-outline" : "party-popper"}
                    size={18}
                    color="white"
                  />
                </View>
              </View>
              <Text style={styles.profileName}>Guest Athlete</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                  <MaterialCommunityIcons name={selectedGender === 'male' ? "gender-male" : selectedGender === 'female' ? "gender-female" : "gender-male-female"} size={14} color={Colors.textDim} />
                  <Text style={{ color: Colors.textDim, fontSize: 13, marginLeft: 4 }}>{selectedGender ? selectedGender.charAt(0).toUpperCase() + selectedGender.slice(1) : 'Not Set'}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                  <Ionicons name="location-outline" size={14} color={Colors.textDim} />
                  <Text style={{ color: Colors.textDim, fontSize: 13, marginLeft: 4 }}>New York, NY</Text>
                </View>
              </View>
            </View>

            {/* 1.5 Growth Hack: Trophy Case */}
            <View style={{ marginBottom: 24, paddingHorizontal: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={styles.sectionTitle}>🏆 Badges</Text>
                <TouchableOpacity onPress={() => {
                  // Growth Hack: Simulate Share
                  if (!unlockedBadges.includes('hype')) {
                    SoundEffects.playSuccess();
                    setUnlockedBadges(prev => [...prev, 'hype']);
                    alert("🔥 HYPE BADGE UNLOCKED! Thanks for sharing!");
                  }
                }}>
                  <Text style={{ color: Colors.fun, fontWeight: '700', fontSize: 13 }}>Share & Earn</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 16 }}>
                {BADGES.map(badge => {
                  const isUnlocked = unlockedBadges.includes(badge.id);
                  return (
                    <View key={badge.id} style={{
                      alignItems: 'center',
                      backgroundColor: isUnlocked ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                      padding: 12,
                      borderRadius: 16,
                      minWidth: 100,
                      borderWidth: 1,
                      borderColor: isUnlocked ? 'rgba(255,255,255,0.2)' : 'transparent'
                    }}>
                      <View style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: isUnlocked ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.05)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 8,
                        opacity: isUnlocked ? 1 : 0.3
                      }}>
                        <MaterialCommunityIcons name={badge.icon as any} size={24} color={isUnlocked ? badge.color : 'white'} />
                      </View>
                      <Text style={{ color: isUnlocked ? 'white' : Colors.textDim, fontWeight: '700', fontSize: 13 }}>{badge.label}</Text>
                      <Text style={{ color: Colors.textDim, fontSize: 10, marginTop: 2 }}>{badge.description}</Text>
                      {!isUnlocked && (
                        <View style={{ position: 'absolute', top: 8, right: 8 }}>
                          <Ionicons name="lock-closed" size={10} color={Colors.textDim} />
                        </View>
                      )}
                    </View>
                  );
                })}
              </ScrollView>
            </View>

            {/* 2. Stats Grid (Placeholder) */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, marginBottom: 32 }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: '800', color: 'white' }}>12</Text>
                <Text style={{ fontSize: 12, color: Colors.textDim, marginTop: 4 }}>Workouts</Text>
              </View>
              <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} />
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: '800', color: 'white' }}>4</Text>
                <Text style={{ fontSize: 12, color: Colors.textDim, marginTop: 4 }}>Events</Text>
              </View>
              <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} />
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: '800', color: 'white' }}>88</Text>
                <Text style={{ fontSize: 12, color: Colors.textDim, marginTop: 4 }}>Followers</Text>
              </View>
            </View>

            {/* 3. Helper: Section Header */}
            <View style={{ paddingHorizontal: 16 }}>

              {/* HYROX DNA */}
              <View style={{ marginBottom: 32 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <Text style={styles.sectionTitle}>🧬 Your HYROX DNA</Text>
                  <TouchableOpacity>
                    <MaterialCommunityIcons name="pencil-outline" size={20} color={Colors.textDim} />
                  </TouchableOpacity>
                </View>

                {/* Strengths */}
                {selectedHyroxStrengths.length > 0 && (
                  <View style={{ marginBottom: 16 }}>
                    <Text style={{ color: '#4ADE80', fontSize: 14, fontWeight: '700', marginBottom: 12, textTransform: 'uppercase' }}>Strengths</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                      {HYROX_STATIONS.filter(s => selectedHyroxStrengths.includes(s.id)).map(station => (
                        <View key={station.id} style={[styles.hyroxChipSimple, { backgroundColor: '#4ADE80', borderColor: '#4ADE80' }]}>
                          <MaterialCommunityIcons name={station.icon as any} size={18} color="black" />
                          <Text style={[styles.hyroxChipLabel, { color: 'black' }]}>{station.label}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Weaknesses */}
                {selectedHyroxWeaknesses.length > 0 && (
                  <View>
                    <Text style={{ color: '#FB7185', fontSize: 14, fontWeight: '700', marginBottom: 12, textTransform: 'uppercase' }}>Needs Work</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                      {HYROX_STATIONS.filter(s => selectedHyroxWeaknesses.includes(s.id)).map(station => (
                        <View key={station.id} style={[styles.hyroxChipSimple, { backgroundColor: '#FB7185', borderColor: '#FB7185' }]}>
                          <MaterialCommunityIcons name={station.icon as any} size={18} color="black" />
                          <Text style={[styles.hyroxChipLabel, { color: 'black' }]}>{station.label}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {selectedHyroxStrengths.length === 0 && selectedHyroxWeaknesses.length === 0 && (
                  <Text style={{ color: Colors.textDim, fontStyle: 'italic' }}>No HYROX data set yet. Edit profile to add.</Text>
                )}
              </View>

              {/* Vibe Check */}
              <View style={{ marginBottom: 32 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <Text style={styles.sectionTitle}>✨ Your Vibe</Text>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  {VIBES.filter(v => selectedVibes.includes(v.id)).map(vibe => (
                    <View key={vibe.id} style={styles.activityChip}>
                      <Text style={styles.activityChipText}>{vibe.label}</Text>
                    </View>
                  ))}
                  {selectedVibes.length === 0 && (
                    <Text style={{ color: Colors.textDim, fontStyle: 'italic' }}>No vibes selected.</Text>
                  )}
                </View>
              </View>

              {/* Settings / Actions */}
              <TouchableOpacity style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255,255,255,0.05)',
                padding: 16,
                borderRadius: 16,
                marginBottom: 16
              }}>
                <Ionicons name="settings-outline" size={20} color="white" />
                <Text style={{ color: 'white', fontWeight: '700', marginLeft: 8 }}>Settings</Text>
              </TouchableOpacity>

              <Text style={{ color: Colors.textDim, textAlign: 'center', fontSize: 12 }}>Version 1.0.0 (Beta)</Text>

            </View>
          </ScrollView>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{activeTab.toUpperCase()}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>{renderContent()}</View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity key={tab.name} style={styles.tabItem} onPress={() => setActiveTab(tab.name)}>
            <Ionicons name={tab.icon} size={24} color={activeTab === tab.name ? activeColor : Colors.textDim} />
            <Text style={[styles.tabLabel, { color: activeTab === tab.name ? activeColor : Colors.textDim }]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Forum Thread Modal - Root Level */}
      {selectedThread && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.95)' }}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => setSelectedThread(null)}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: '700' }}>Discussion</Text>
              <TouchableOpacity>
                <Ionicons name="ellipsis-horizontal" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1, padding: 16 }}>
              {/* Original Post */}
              <View style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 16, marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <View style={{ backgroundColor: 'rgba(0,206,209,0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginRight: 8 }}>
                    <Text style={{ color: Colors.fun, fontSize: 10, fontWeight: '800' }}>GEAR</Text>
                  </View>
                  <Text style={{ color: Colors.textDim, fontSize: 12 }}>@Sarahfit • 2h ago</Text>
                </View>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Best shoes for Hyrox Manchester? 👟</Text>
                <Text style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 20 }}>
                  Looking for recommendations for Hyrox Manchester in 3 weeks. I usually wear Nike Metcons but wondering if I should switch to something lighter for the running. What do you all think?
                </Text>
              </View>

              {/* Comments */}
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '700', marginBottom: 16 }}>34 Comments</Text>

              {[
                { author: 'CoachMike', time: '1h ago', content: 'I swear by On Cloudmonsters for HYROX. Great cushioning for the runs and stable enough for the stations.' },
                { author: 'FitJess', time: '45m ago', content: 'Agree with CoachMike! Also the Hoka Speedgoats are 🔥' },
                { author: 'BeastMode', time: '30m ago', content: 'Metcons are fine if you\'re used to them. Don\'t change shoes close to race day!' }
              ].map((comment, i) => (
                <View key={i} style={{ flexDirection: 'row', marginBottom: 20 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', marginRight: 12 }} />
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                      <Text style={{ color: 'white', fontWeight: '700', marginRight: 8 }}>@{comment.author}</Text>
                      <Text style={{ color: Colors.textDim, fontSize: 12 }}>{comment.time}</Text>
                    </View>
                    <Text style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 20 }}>{comment.content}</Text>
                    <View style={{ flexDirection: 'row', marginTop: 8, gap: 16 }}>
                      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="heart-outline" size={16} color={Colors.textDim} />
                        <Text style={{ color: Colors.textDim, fontSize: 13, marginLeft: 4 }}>12</Text>
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Text style={{ color: Colors.textDim, fontSize: 13 }}>Reply</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </SafeAreaView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { justifyContent: 'center', alignItems: 'center' },
  logo: { fontSize: 48, fontWeight: '800', color: 'white' },

  // Onboarding
  onboardingContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  onboardingEmoji: { fontSize: 80, marginBottom: 24 },
  onboardingTitle: { fontSize: 32, fontWeight: '800', color: 'white', textAlign: 'center', marginBottom: 12 },
  onboardingSubtitle: { fontSize: 18, color: Colors.textDim, textAlign: 'center', marginBottom: 40 },
  modeButtons: { width: '100%', gap: 16 },
  modeButton: { padding: 20, borderRadius: 16, alignItems: 'center' },
  modeButtonText: { fontSize: 18, fontWeight: '800', color: 'white' },
  nextButton: { backgroundColor: Colors.primary, paddingHorizontal: 32, paddingVertical: 16, borderRadius: 30 },
  nextButtonText: { fontSize: 18, fontWeight: '700', color: 'white' },
  progressDots: { flexDirection: 'row', gap: 8, marginTop: 40 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.2)' },
  dotActive: { backgroundColor: Colors.primary, width: 24 },

  // Goal Selection
  goalButton: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  goalButtonTitle: { fontSize: 22, fontWeight: '800', color: 'white', marginBottom: 4 },
  goalButtonSubtitle: { fontSize: 14, color: Colors.textDim, textAlign: 'center' },

  // Activity Chips
  activityChip: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  activityChipText: { fontSize: 14, fontWeight: '600', color: 'white' },

  // HYROX Station Chips - Simple
  hyroxChipSimple: {
    backgroundColor: Colors.surface,
    borderRadius: 30, // Pill shape
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  hyroxChipLabel: { fontSize: 13, fontWeight: '600', color: 'white' },

  // Gender Options
  genderOption: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  genderOptionText: { fontSize: 17, fontWeight: '600', color: 'white' },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: Platform.OS === 'web' ? 16 : 50, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: 'white' },
  modeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  modeDot: { width: 8, height: 8, borderRadius: 4 },
  modeLabel: { fontSize: 12, color: Colors.textDim, textTransform: 'uppercase' },
  modeChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  modeChipText: { fontSize: 16 },

  // Content
  content: { flex: 1 },
  scrollContent: { flex: 1 },
  cardContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  card: { width: Math.min(width - 32, 360), height: Math.min(height * 0.55, 460), borderRadius: 24, backgroundColor: '#2a2a35', overflow: 'hidden' },
  cardGradient: { ...StyleSheet.absoluteFillObject },
  modeBadge: { position: 'absolute', top: 16, right: 16, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  modeBadgeText: { fontSize: 12, fontWeight: '700', color: 'white' },
  cardContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20 },
  athleteName: { fontSize: 28, fontWeight: '800', color: 'white' },
  locationText: { fontSize: 14, color: Colors.textDim, marginTop: 4 },
  bioText: { fontSize: 15, color: 'rgba(255,255,255,0.8)', marginTop: 8 },
  tag: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginTop: 12, alignSelf: 'flex-start' },
  tagText: { fontSize: 13, color: 'white' },
  actionButtons: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 20 },
  skipButton: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  likeButton: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },

  // Stats
  sectionTitle: { fontSize: 20, fontWeight: '800', color: 'white', marginBottom: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { width: '47%', backgroundColor: Colors.surface, padding: 20, borderRadius: 16, alignItems: 'center' },
  statValue: { fontSize: 32, fontWeight: '800', color: 'white' },
  statLabel: { fontSize: 12, color: Colors.textDim, marginTop: 4 },

  // Profile
  avatarCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 3, marginBottom: 16 },
  profileName: { fontSize: 24, fontWeight: '800', color: 'white', marginBottom: 16 },
  modeToggle: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  modeToggleText: { fontSize: 16, fontWeight: '700', color: 'white' },

  // Tab Bar
  tabBar: { flexDirection: 'row', backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', height: Platform.OS === 'web' ? 70 : 90, paddingBottom: Platform.OS === 'web' ? 10 : 30, paddingTop: 10 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabLabel: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', marginTop: 4 },

  // Feed - Stories
  storyBubble: { alignItems: 'center', marginRight: 16 },
  storyRing: { width: 64, height: 64, borderRadius: 32, padding: 3, alignItems: 'center', justifyContent: 'center' },
  storyAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  storyName: { fontSize: 11, color: Colors.textDim, marginTop: 6 },

  // Feed - Posts
  feedPost: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, marginBottom: 16 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  postAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  postAvatarImg: { width: 44, height: 44, borderRadius: 22, marginRight: 12, borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)' },
  postAuthor: { fontSize: 15, fontWeight: '700', color: 'white' },
  postTime: { fontSize: 12, color: Colors.textDim },
  postTypeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  postTypeText: { fontSize: 14 },
  postContent: { fontSize: 15, color: 'white', lineHeight: 22, marginBottom: 12 },
  postImageContainer: { marginHorizontal: -16, marginBottom: 12 },
  postImage: { width: '100%', height: 280, backgroundColor: Colors.surface },

  // Feed - Workout Card
  workoutCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 12, marginBottom: 12 },
  workoutHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  workoutType: { fontSize: 14, fontWeight: '600', color: 'white' },
  workoutStats: { flexDirection: 'row', justifyContent: 'space-around' },
  workoutStat: { alignItems: 'center' },
  workoutValue: { fontSize: 18, fontWeight: '800', color: 'white' },
  workoutLabel: { fontSize: 11, color: Colors.textDim, marginTop: 2 },

  // Feed - Achievement
  achievementBadge: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,215,0,0.15)', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, marginBottom: 12 },
  achievementIcon: { fontSize: 32 },
  achievementTitle: { fontSize: 16, fontWeight: '700', color: '#FFD700' },

  // Feed - Event Mini
  eventMini: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, marginBottom: 12 },
  eventMiniName: { fontSize: 14, fontWeight: '600', color: 'white' },
  eventMiniDate: { fontSize: 12, color: Colors.textDim },

  // Feed - Actions
  postActions: { flexDirection: 'row', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  postAction: { flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 20 },
  postActionText: { fontSize: 14, color: Colors.textDim },

  // Feed Toggle
  feedToggle: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: 12, padding: 4, marginBottom: 16 },
  feedToggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10 },
  feedToggleText: { fontSize: 14, fontWeight: '600', color: Colors.textDim },

  // Story Avatar Image
  storyAvatarImg: { width: 56, height: 56, borderRadius: 28 },

  // Compose Pulse
  composePulse: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 12, padding: 12, marginBottom: 16, gap: 12 },
  composeAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  composePlaceholder: { flex: 1, color: Colors.textDim, fontSize: 14 },
  composeBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  composeBtnText: { color: 'white', fontWeight: '700', fontSize: 14 },

  // Pulse Posts (Twitter/Threads style)
  pulsePost: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: 12, padding: 16, marginBottom: 12, gap: 12 },
  pulseAvatar: { width: 40, height: 40, borderRadius: 20 },
  pulseName: { fontSize: 15, fontWeight: '700', color: 'white' },
  pulseTime: { fontSize: 13, color: Colors.textDim },
  pulseContent: { fontSize: 15, color: 'white', lineHeight: 22, marginBottom: 10 },
  pulseActions: { flexDirection: 'row', gap: 24 },
  pulseAction: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pulseActionText: { fontSize: 13, color: Colors.textDim },
  eventHeaderCard: {
    width: 140,
    height: 100,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    justifyContent: 'flex-end',
    padding: 8,
  },
  eventHeaderImg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#2a2a35',
  },
  eventHeaderGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  eventHeaderName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  eventHeaderDate: {
    color: Colors.textDim,
    fontSize: 10,
    fontWeight: '600',
  },
  attendeeBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  attendeeCount: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  matchEventBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#FF4757',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  matchEventText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
  },
});
