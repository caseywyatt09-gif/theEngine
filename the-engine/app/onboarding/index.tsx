import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Share, Platform, Alert, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppStore, UserProfile } from '../../store/useAppStore';
import { Colors } from '../../constants/Colors';

const { width, height } = Dimensions.get('window');

// Sports options
const SPORTS = [
    { id: 'hyrox', label: 'HYROX', emoji: '🏋️' },
    { id: 'running', label: 'Running', emoji: '🏃' },
    { id: 'crossfit', label: 'CrossFit', emoji: '💪' },
    { id: 'cycling', label: 'Cycling', emoji: '🚴' },
    { id: 'triathlon', label: 'Triathlon', emoji: '🏊' },
    { id: 'gym', label: 'Gym', emoji: '🏋️‍♂️' },
];

const LEVELS = [
    { id: 'beginner', label: 'Beginner', desc: 'Just starting out' },
    { id: 'intermediate', label: 'Intermediate', desc: '1-3 years training' },
    { id: 'advanced', label: 'Advanced', desc: '3+ years, competing regularly' },
    { id: 'elite', label: 'Elite', desc: 'Pro or semi-pro athlete' },
];

const GOALS = [
    { id: 'hyrox', label: 'Compete in HYROX', emoji: '🏆' },
    { id: 'partners', label: 'Find training partners', emoji: '🤝' },
    { id: 'fitness', label: 'Improve my fitness', emoji: '📈' },
    { id: 'community', label: 'Join the community', emoji: '👥' },
    { id: 'events', label: 'Discover events', emoji: '📅' },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const scrollRef = useRef<ScrollView>(null);
    const { mode, setMode, setOnboardingComplete, setUserProfile, referral } = useAppStore();

    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedSport, setSelectedSport] = useState<string | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
    const [displayName, setDisplayName] = useState('');

    const totalSlides = 5;

    const goToSlide = (index: number) => {
        scrollRef.current?.scrollTo({ x: index * width, animated: true });
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        if (currentSlide < totalSlides - 1) {
            goToSlide(currentSlide + 1);
        }
    };

    const handleComplete = () => {
        const profile: UserProfile = {
            displayName: displayName || 'Athlete',
            avatarUri: null,
            primarySport: selectedSport || 'hyrox',
            experienceLevel: (selectedLevel as any) || 'intermediate',
            goal: selectedGoals[0] || 'hyrox',
        };
        setUserProfile(profile);
        setOnboardingComplete(true);
        router.replace('/(tabs)/social');
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Join me on The Engine – the ultimate fitness community! Use my code ${referral.code} to get started. 🔥💪`,
                url: 'https://theengine.app/invite',
            });
        } catch (error) {
            console.error('Share error:', error);
        }
    };

    const toggleGoal = (goalId: string) => {
        setSelectedGoals(prev =>
            prev.includes(goalId)
                ? prev.filter(g => g !== goalId)
                : [...prev, goalId]
        );
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                key="brunette-rope-remote"
                source={{ uri: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=1200&q=80' }}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
            />
            <LinearGradient
                colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
                style={StyleSheet.absoluteFill}
            />

            {/* Progress Dots */}
            <View style={styles.progressContainer}>
                {Array.from({ length: totalSlides }).map((_, idx) => (
                    <View
                        key={idx}
                        style={[
                            styles.progressDot,
                            currentSlide === idx && styles.progressDotActive,
                            currentSlide > idx && styles.progressDotComplete,
                        ]}
                    />
                ))}
            </View>

            {/* Skip Button */}
            {currentSlide < totalSlides - 1 && (
                <TouchableOpacity style={styles.skipButton} onPress={handleComplete}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            )}

            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                style={styles.scrollView}
            >
                {/* Slide 1: Welcome */}
                <View style={styles.slide}>
                    <View style={styles.slideContent}>
                        <View style={styles.logoContainer}>
                            <LinearGradient
                                colors={[Colors.race, Colors.primary]}
                                style={styles.logoGradient}
                            >
                                <Text style={styles.logoEmoji}>⚡</Text>
                            </LinearGradient>
                        </View>
                        <Text style={styles.welcomeTitle}>THE ENGINE</Text>
                        <Text style={styles.welcomeTagline}>Train. Compete. Connect.</Text>
                        <Text style={styles.welcomeDesc}>
                            Join the world's most driven fitness community.
                            Find training partners, compete in events, and push your limits.
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.primaryButton} onPress={nextSlide}>
                        <Text style={styles.primaryButtonText}>Get Started</Text>
                        <Ionicons name="arrow-forward" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Slide 2: Choose Mode */}
                <View style={styles.slide}>
                    <View style={styles.slideContent}>
                        <Text style={styles.slideTitle}>Choose Your Mode</Text>
                        <Text style={styles.slideSubtitle}>How do you want to train?</Text>

                        <View style={styles.modeContainer}>
                            <TouchableOpacity
                                style={[styles.modeCard, mode === 'race' && styles.modeCardActive]}
                                onPress={() => setMode('race')}
                            >
                                <LinearGradient
                                    colors={mode === 'race' ? [Colors.race, '#CC2952'] : ['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.4)']}
                                    style={styles.modeGradient}
                                >
                                    <Text style={styles.modeEmoji}>🏁</Text>
                                    <Text style={styles.modeTitle}>RACE MODE</Text>
                                    <Text style={styles.modeDesc}>
                                        Competitive matching based on pace, power, and performance metrics.
                                    </Text>
                                    {mode === 'race' && (
                                        <View style={styles.modeCheck}>
                                            <Ionicons name="checkmark" size={18} color="white" />
                                        </View>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modeCard, mode === 'fun' && styles.modeCardActive]}
                                onPress={() => setMode('fun')}
                            >
                                <LinearGradient
                                    colors={mode === 'fun' ? [Colors.fun, '#00CC6A'] : ['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.4)']}
                                    style={styles.modeGradient}
                                >
                                    <Text style={styles.modeEmoji}>🎉</Text>
                                    <Text style={[styles.modeTitle, mode === 'fun' && { color: '#0A0A0A' }]}>FUN MODE</Text>
                                    <Text style={[styles.modeDesc, mode === 'fun' && { color: '#0A0A0A99' }]}>
                                        Casual matching based on interests, location, and shared activities.
                                    </Text>
                                    {mode === 'fun' && (
                                        <View style={[styles.modeCheck, { backgroundColor: '#0A0A0A' }]}>
                                            <Ionicons name="checkmark" size={18} color={Colors.fun} />
                                        </View>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.primaryButton} onPress={nextSlide}>
                        <Text style={styles.primaryButtonText}>Continue</Text>
                        <Ionicons name="arrow-forward" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Slide 3: Sport & Level */}
                <View style={styles.slide}>
                    <ScrollView style={styles.slideScrollContent} showsVerticalScrollIndicator={false}>
                        <Text style={styles.slideTitle}>Your Fitness Profile</Text>
                        <Text style={styles.slideSubtitle}>Tell us about your training</Text>

                        <Text style={styles.sectionLabel}>Primary Sport</Text>
                        <View style={styles.sportGrid}>
                            {SPORTS.map(sport => (
                                <TouchableOpacity
                                    key={sport.id}
                                    style={[styles.sportCard, selectedSport === sport.id && styles.sportCardActive]}
                                    onPress={() => setSelectedSport(sport.id)}
                                >
                                    <Text style={styles.sportEmoji}>{sport.emoji}</Text>
                                    <Text style={[styles.sportLabel, selectedSport === sport.id && styles.sportLabelActive]}>
                                        {sport.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.sectionLabel}>Experience Level</Text>
                        <View style={styles.levelList}>
                            {LEVELS.map(level => (
                                <TouchableOpacity
                                    key={level.id}
                                    style={[styles.levelCard, selectedLevel === level.id && styles.levelCardActive]}
                                    onPress={() => setSelectedLevel(level.id)}
                                >
                                    <View style={styles.levelInfo}>
                                        <Text style={[styles.levelTitle, selectedLevel === level.id && styles.levelTitleActive]}>
                                            {level.label}
                                        </Text>
                                        <Text style={styles.levelDesc}>{level.desc}</Text>
                                    </View>
                                    {selectedLevel === level.id && (
                                        <Ionicons name="checkmark-circle" size={24} color={Colors.fun} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                    <TouchableOpacity
                        style={[styles.primaryButton, (!selectedSport || !selectedLevel) && styles.disabledButton]}
                        onPress={nextSlide}
                        disabled={!selectedSport || !selectedLevel}
                    >
                        <Text style={styles.primaryButtonText}>Continue</Text>
                        <Ionicons name="arrow-forward" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Slide 4: Goals */}
                <View style={styles.slide}>
                    <View style={styles.slideContent}>
                        <Text style={styles.slideTitle}>What's Your Goal?</Text>
                        <Text style={styles.slideSubtitle}>Select all that apply</Text>

                        <View style={styles.goalsList}>
                            {GOALS.map(goal => (
                                <TouchableOpacity
                                    key={goal.id}
                                    style={[styles.goalCard, selectedGoals.includes(goal.id) && styles.goalCardActive]}
                                    onPress={() => toggleGoal(goal.id)}
                                >
                                    <Text style={styles.goalEmoji}>{goal.emoji}</Text>
                                    <Text style={[styles.goalLabel, selectedGoals.includes(goal.id) && styles.goalLabelActive]}>
                                        {goal.label}
                                    </Text>
                                    {selectedGoals.includes(goal.id) && (
                                        <Ionicons name="checkmark-circle" size={22} color={Colors.fun} style={styles.goalCheck} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <TouchableOpacity
                        style={[styles.primaryButton, selectedGoals.length === 0 && styles.disabledButton]}
                        onPress={nextSlide}
                        disabled={selectedGoals.length === 0}
                    >
                        <Text style={styles.primaryButtonText}>Continue</Text>
                        <Ionicons name="arrow-forward" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Slide 5: Invite Friends (Growth Hook) */}
                <View style={styles.slide}>
                    <View style={styles.slideContent}>
                        <View style={styles.inviteHeader}>
                            <Text style={styles.inviteEmoji}>🎁</Text>
                            <Text style={styles.slideTitle}>Train Better Together</Text>
                            <Text style={styles.slideSubtitle}>
                                Invite friends and earn rewards! Get 1 month of Pro for each friend who joins.
                            </Text>
                        </View>

                        <View style={styles.referralCard}>
                            <Text style={styles.referralLabel}>Your Referral Code</Text>
                            <View style={styles.referralCodeBox}>
                                <Text style={styles.referralCode}>{referral.code}</Text>
                                <TouchableOpacity style={styles.copyButton}>
                                    <Ionicons name="copy-outline" size={20} color={Colors.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                            <Ionicons name="share-outline" size={22} color="white" />
                            <Text style={styles.shareButtonText}>Share Invite Link</Text>
                        </TouchableOpacity>

                        <View style={styles.rewardsInfo}>
                            <View style={styles.rewardItem}>
                                <View style={styles.rewardIcon}>
                                    <Ionicons name="people" size={20} color={Colors.fun} />
                                </View>
                                <View style={styles.rewardText}>
                                    <Text style={styles.rewardTitle}>Refer a Friend</Text>
                                    <Text style={styles.rewardDesc}>1 month Pro free</Text>
                                </View>
                            </View>
                            <View style={styles.rewardItem}>
                                <View style={styles.rewardIcon}>
                                    <Ionicons name="trophy" size={20} color={Colors.primary} />
                                </View>
                                <View style={styles.rewardText}>
                                    <Text style={styles.rewardTitle}>Refer 5 Friends</Text>
                                    <Text style={styles.rewardDesc}>Exclusive merch pack</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.finalButtons}>
                        <TouchableOpacity style={styles.skipInviteButton} onPress={handleComplete}>
                            <Text style={styles.skipInviteText}>Maybe Later</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.enterButton} onPress={handleComplete}>
                            <Text style={styles.enterButtonText}>Enter The Engine</Text>
                            <Ionicons name="flash" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        paddingTop: 60,
        paddingBottom: 20,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    progressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.gray[700],
    },
    progressDotActive: {
        width: 24,
        backgroundColor: Colors.primary,
    },
    progressDotComplete: {
        backgroundColor: Colors.fun,
    },
    skipButton: {
        position: 'absolute',
        top: 55,
        right: 20,
        zIndex: 10,
        padding: 10,
    },
    skipText: {
        color: Colors.textDim,
        fontSize: 15,
    },
    scrollView: {
        flex: 1,
    },
    slide: {
        width,
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 100,
        paddingBottom: 40,
        justifyContent: 'space-between',
    },
    slideContent: {
        flex: 1,
    },
    slideScrollContent: {
        flex: 1,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoGradient: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoEmoji: {
        fontSize: 48,
    },
    welcomeTitle: {
        fontSize: 36,
        fontWeight: '900',
        color: Colors.white,
        textAlign: 'center',
        letterSpacing: 2,
    },
    welcomeTagline: {
        fontSize: 18,
        color: Colors.primary,
        textAlign: 'center',
        marginTop: 8,
        fontWeight: '600',
    },
    welcomeDesc: {
        fontSize: 16,
        color: Colors.textDim,
        textAlign: 'center',
        marginTop: 24,
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    slideTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.white,
        textAlign: 'center',
        marginBottom: 8,
    },
    slideSubtitle: {
        fontSize: 16,
        color: Colors.textDim,
        textAlign: 'center',
        marginBottom: 32,
    },
    modeContainer: {
        gap: 16,
    },
    modeCard: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    modeCardActive: {},
    modeGradient: {
        padding: 20,
        position: 'relative',
    },
    modeEmoji: {
        fontSize: 36,
        marginBottom: 12,
    },
    modeTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.white,
        marginBottom: 8,
    },
    modeDesc: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        lineHeight: 20,
    },
    modeCheck: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textDim,
        marginBottom: 12,
        marginTop: 24,
    },
    sportGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    sportCard: {
        width: '31%',
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    sportCardActive: {
        borderColor: Colors.primary,
        backgroundColor: `${Colors.primary}15`,
    },
    sportEmoji: {
        fontSize: 28,
        marginBottom: 8,
    },
    sportLabel: {
        fontSize: 12,
        color: Colors.textDim,
        fontWeight: '600',
    },
    sportLabelActive: {
        color: Colors.white,
    },
    levelList: {
        gap: 10,
        paddingBottom: 100,
    },
    levelCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    levelCardActive: {
        borderColor: Colors.fun,
        backgroundColor: `${Colors.fun}15`,
    },
    levelInfo: {
        flex: 1,
    },
    levelTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.white,
        marginBottom: 2,
    },
    levelTitleActive: {
        color: Colors.fun,
    },
    levelDesc: {
        fontSize: 13,
        color: Colors.textDim,
    },
    goalsList: {
        gap: 12,
    },
    goalCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    goalCardActive: {
        borderColor: Colors.fun,
        backgroundColor: `${Colors.fun}15`,
    },
    goalEmoji: {
        fontSize: 24,
        marginRight: 12,
    },
    goalLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textDim,
    },
    goalLabelActive: {
        color: Colors.white,
    },
    goalCheck: {
        marginLeft: 8,
    },
    inviteHeader: {
        alignItems: 'center',
        marginBottom: 32,
    },
    inviteEmoji: {
        fontSize: 56,
        marginBottom: 16,
    },
    referralCard: {
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
    },
    referralLabel: {
        fontSize: 12,
        color: Colors.textDim,
        textAlign: 'center',
        marginBottom: 12,
    },
    referralCodeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.background,
        borderRadius: 12,
        padding: 16,
        gap: 12,
    },
    referralCode: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.white,
        letterSpacing: 2,
    },
    copyButton: {
        padding: 8,
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: Colors.primary,
        borderRadius: 30,
        paddingVertical: 16,
        marginBottom: 24,
    },
    shareButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    rewardsInfo: {
        gap: 12,
    },
    rewardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        borderRadius: 16,
        padding: 16,
    },
    rewardIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.gray[800],
        alignItems: 'center',
        justifyContent: 'center',
    },
    rewardText: {
        flex: 1,
    },
    rewardTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.white,
    },
    rewardDesc: {
        fontSize: 13,
        color: Colors.textDim,
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: Colors.primary,
        borderRadius: 30,
        paddingVertical: 18,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 17,
        fontWeight: '700',
    },
    disabledButton: {
        opacity: 0.5,
    },
    finalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    skipInviteButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 30,
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
    },
    skipInviteText: {
        color: Colors.textDim,
        fontSize: 15,
        fontWeight: '600',
    },
    enterButton: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: Colors.fun,
        borderRadius: 30,
        paddingVertical: 18,
    },
    enterButtonText: {
        color: '#0A0A0A',
        fontSize: 17,
        fontWeight: '700',
    },
});
