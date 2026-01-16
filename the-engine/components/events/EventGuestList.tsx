import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { HyroxEvent, formatEventDate } from '../../data/mockEvents';
import { MOCK_ATHLETES, Athlete } from '../../data/mockAthletes';
import { Colors } from '../../constants/Colors';

const { width, height } = Dimensions.get('window');

interface EventGuestListProps {
    visible: boolean;
    event: HyroxEvent | null;
    isLoggedIn: boolean;
    onClose: () => void;
    onSignUpPrompt: () => void;
    onMatch: (athlete: Athlete) => void;
}

export function EventGuestList({
    visible,
    event,
    isLoggedIn,
    onClose,
    onSignUpPrompt,
    onMatch
}: EventGuestListProps) {
    const [mode, setMode] = useState<'race' | 'fun'>('race');
    const [viewMode, setViewMode] = useState<'list' | 'swipe'>('list');
    const [currentSwipeIndex, setCurrentSwipeIndex] = useState(0);

    if (!event) return null;

    // Mock attendees - in production, fetch from Supabase based on event check-ins
    const attendees = MOCK_ATHLETES.map(a => ({
        ...a,
        pb: a.racePace || 'N/A',
        pace: a.vo2Max ? `VO2: ${a.vo2Max}` : 'N/A',
        vibes: a.favoriteActivities?.slice(0, 2) || ['Competitive', 'Social'],
        checkedIn: Math.random() > 0.3, // Mock check-in status
    }));

    // Sort based on mode
    const sortedAttendees = [...attendees].sort((a, b) => {
        if (mode === 'race') {
            // Sort by VO2 max (higher is better)
            return (b.vo2Max || 0) - (a.vo2Max || 0);
        } else {
            // Sort by favorite activities count (more social)
            return (b.favoriteActivities?.length || 0) - (a.favoriteActivities?.length || 0);
        }
    });

    const visibleCount = isLoggedIn ? sortedAttendees.length : 3;
    const hiddenCount = sortedAttendees.length - visibleCount;

    const handleSwipe = (direction: 'left' | 'right') => {
        if (direction === 'right') {
            onMatch(sortedAttendees[currentSwipeIndex]);
        }
        setCurrentSwipeIndex(prev => prev + 1);
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color={Colors.white} />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>Guest List</Text>
                        <Text style={styles.headerSubtitle}>{event.name}</Text>
                    </View>
                    <View style={{ width: 40 }} />
                </View>

                {/* Event Summary Bar */}
                <LinearGradient
                    colors={[event.color, `${event.color}77`]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.eventBar}
                >
                    <View style={styles.eventBarContent}>
                        <Text style={styles.eventEmoji}>{event.emoji}</Text>
                        <View style={styles.eventBarText}>
                            <Text style={styles.eventBarTitle}>{event.name}</Text>
                            <Text style={styles.eventBarDate}>{formatEventDate(event.date)}</Text>
                        </View>
                    </View>
                    <View style={styles.attendeeCount}>
                        <Ionicons name="people" size={16} color="white" />
                        <Text style={styles.attendeeCountText}>{attendees.length}</Text>
                    </View>
                </LinearGradient>

                {/* Race vs Fun Toggle */}
                <View style={styles.modeToggleContainer}>
                    <View style={styles.modeToggle}>
                        <TouchableOpacity
                            style={[styles.modeButton, mode === 'race' && styles.modeButtonActiveRace]}
                            onPress={() => setMode('race')}
                        >
                            <Text style={styles.modeEmoji}>🏁</Text>
                            <Text style={[styles.modeText, mode === 'race' && styles.modeTextActive]}>
                                Race Mode
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modeButton, mode === 'fun' && styles.modeButtonActiveFun]}
                            onPress={() => setMode('fun')}
                        >
                            <Text style={styles.modeEmoji}>🎉</Text>
                            <Text style={[styles.modeText, mode === 'fun' && { color: '#0A0A0A' }]}>
                                Fun Mode
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* View Toggle */}
                    <View style={styles.viewToggle}>
                        <TouchableOpacity
                            style={[styles.viewButton, viewMode === 'list' && styles.viewButtonActive]}
                            onPress={() => setViewMode('list')}
                        >
                            <Ionicons name="list" size={18} color={viewMode === 'list' ? Colors.white : Colors.textDim} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.viewButton, viewMode === 'swipe' && styles.viewButtonActive]}
                            onPress={() => setViewMode('swipe')}
                        >
                            <Ionicons name="swap-horizontal" size={18} color={viewMode === 'swipe' ? Colors.white : Colors.textDim} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Mode Description */}
                <Text style={styles.modeDescription}>
                    {mode === 'race'
                        ? '⚡ Sorted by pace & performance — find your race partner'
                        : '🎊 Sorted by vibe & interests — find your after-party crew'
                    }
                </Text>

                {viewMode === 'list' ? (
                    <ScrollView style={styles.guestList} showsVerticalScrollIndicator={false}>
                        {sortedAttendees.slice(0, visibleCount).map((athlete, index) => (
                            <TouchableOpacity key={athlete.id} style={styles.guestCard}>
                                <Image source={athlete.avatar} style={styles.guestAvatar} />
                                <View style={styles.guestInfo}>
                                    <View style={styles.guestHeader}>
                                        <Text style={styles.guestName}>{athlete.displayName}</Text>
                                        {athlete.checkedIn && (
                                            <View style={styles.checkedInBadge}>
                                                <Ionicons name="checkmark-circle" size={12} color={Colors.fun} />
                                                <Text style={styles.checkedInText}>Checked In</Text>
                                            </View>
                                        )}
                                    </View>
                                    {mode === 'race' ? (
                                        <View style={styles.statsRow}>
                                            <View style={styles.statItem}>
                                                <Ionicons name="speedometer" size={14} color={Colors.race} />
                                                <Text style={styles.statText}>{athlete.pb}</Text>
                                            </View>
                                            <View style={styles.statItem}>
                                                <Ionicons name="trending-up" size={14} color={Colors.primary} />
                                                <Text style={styles.statText}>{athlete.pace}</Text>
                                            </View>
                                        </View>
                                    ) : (
                                        <View style={styles.vibesRow}>
                                            {athlete.vibes.map((vibe: string, i: number) => (
                                                <View key={i} style={styles.vibePill}>
                                                    <Text style={styles.vibeText}>{vibe}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                                <TouchableOpacity
                                    style={[styles.matchButton, { backgroundColor: mode === 'race' ? Colors.race : Colors.fun }]}
                                    onPress={() => onMatch(athlete)}
                                >
                                    <Ionicons name="flash" size={16} color="white" />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))}

                        {/* Blurred/Hidden Section for Non-Logged-In Users */}
                        {!isLoggedIn && hiddenCount > 0 && (
                            <View style={styles.blurredSection}>
                                {/* Blurred preview cards */}
                                {sortedAttendees.slice(visibleCount, visibleCount + 2).map((athlete) => (
                                    <View key={athlete.id} style={[styles.guestCard, styles.blurredCard]}>
                                        <View style={styles.blurredAvatar} />
                                        <View style={styles.guestInfo}>
                                            <View style={styles.blurredName} />
                                            <View style={styles.blurredStats} />
                                        </View>
                                    </View>
                                ))}

                                {/* Sign Up Overlay */}
                                <View style={styles.signUpOverlay}>
                                    <View style={styles.signUpCard}>
                                        <Ionicons name="lock-closed" size={32} color={Colors.primary} />
                                        <Text style={styles.signUpTitle}>See the Full Guest List</Text>
                                        <Text style={styles.signUpSubtitle}>
                                            +{hiddenCount} more athletes are going to this event
                                        </Text>
                                        <TouchableOpacity
                                            style={styles.signUpButton}
                                            onPress={onSignUpPrompt}
                                        >
                                            <Text style={styles.signUpButtonText}>Sign Up Free</Text>
                                            <Ionicons name="arrow-forward" size={18} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )}

                        <View style={{ height: 100 }} />
                    </ScrollView>
                ) : (
                    /* Swipe Mode - Simplified cards */
                    <View style={styles.swipeContainer}>
                        {currentSwipeIndex < sortedAttendees.length ? (
                            <>
                                <View style={styles.swipeCard}>
                                    <Image
                                        source={sortedAttendees[currentSwipeIndex].avatar}
                                        style={styles.swipeCardImage}
                                    />
                                    <LinearGradient
                                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                                        style={styles.swipeCardGradient}
                                    >
                                        <Text style={styles.swipeCardName}>
                                            {sortedAttendees[currentSwipeIndex].displayName}
                                        </Text>
                                        <Text style={styles.swipeCardBio}>
                                            {sortedAttendees[currentSwipeIndex].bio}
                                        </Text>
                                    </LinearGradient>
                                </View>
                                <View style={styles.swipeActions}>
                                    <TouchableOpacity
                                        style={[styles.swipeActionBtn, styles.skipBtn]}
                                        onPress={() => handleSwipe('left')}
                                    >
                                        <Ionicons name="close" size={28} color={Colors.race} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.swipeActionBtn, styles.matchBtn]}
                                        onPress={() => handleSwipe('right')}
                                    >
                                        <Ionicons name="flash" size={28} color={Colors.fun} />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.swipeHint}>
                                    ← Skip | Match for {event.name} →
                                </Text>
                            </>
                        ) : (
                            <View style={styles.noMoreCards}>
                                <Ionicons name="checkmark-circle" size={64} color={Colors.fun} />
                                <Text style={styles.noMoreText}>You've seen everyone!</Text>
                                <TouchableOpacity
                                    style={styles.resetButton}
                                    onPress={() => setCurrentSwipeIndex(0)}
                                >
                                    <Text style={styles.resetText}>Start Over</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenter: {
        alignItems: 'center',
    },
    headerTitle: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: '700',
    },
    headerSubtitle: {
        color: Colors.textDim,
        fontSize: 12,
        marginTop: 2,
    },
    eventBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 16,
        padding: 12,
        borderRadius: 16,
    },
    eventBarContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    eventEmoji: {
        fontSize: 28,
    },
    eventBarText: {},
    eventBarTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    eventBarDate: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
    },
    attendeeCount: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(0,0,0,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },
    attendeeCountText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '700',
    },
    modeToggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    modeToggle: {
        flexDirection: 'row',
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: 4,
    },
    modeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
    },
    modeButtonActiveRace: {
        backgroundColor: Colors.race,
    },
    modeButtonActiveFun: {
        backgroundColor: Colors.fun,
    },
    modeEmoji: {
        fontSize: 14,
    },
    modeText: {
        color: Colors.textDim,
        fontSize: 13,
        fontWeight: '600',
    },
    modeTextActive: {
        color: 'white',
    },
    viewToggle: {
        flexDirection: 'row',
        backgroundColor: Colors.surface,
        borderRadius: 10,
        padding: 4,
    },
    viewButton: {
        padding: 8,
        borderRadius: 8,
    },
    viewButtonActive: {
        backgroundColor: Colors.gray[700],
    },
    modeDescription: {
        color: Colors.textDim,
        fontSize: 12,
        textAlign: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    guestList: {
        flex: 1,
        paddingHorizontal: 16,
    },
    guestCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 12,
        marginBottom: 10,
    },
    guestAvatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        marginRight: 12,
    },
    guestInfo: {
        flex: 1,
    },
    guestHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    guestName: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    checkedInBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: `${Colors.fun}20`,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    checkedInText: {
        color: Colors.fun,
        fontSize: 10,
        fontWeight: '600',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 16,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        color: Colors.textDim,
        fontSize: 13,
    },
    vibesRow: {
        flexDirection: 'row',
        gap: 6,
    },
    vibePill: {
        backgroundColor: Colors.gray[700],
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    vibeText: {
        color: Colors.textDim,
        fontSize: 11,
    },
    matchButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    blurredSection: {
        position: 'relative',
    },
    blurredCard: {
        opacity: 0.3,
    },
    blurredAvatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: Colors.gray[700],
        marginRight: 12,
    },
    blurredName: {
        width: 100,
        height: 16,
        backgroundColor: Colors.gray[700],
        borderRadius: 4,
        marginBottom: 8,
    },
    blurredStats: {
        width: 150,
        height: 12,
        backgroundColor: Colors.gray[700],
        borderRadius: 4,
    },
    signUpOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    signUpCard: {
        backgroundColor: Colors.surface,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.gray[700],
    },
    signUpTitle: {
        color: Colors.white,
        fontSize: 20,
        fontWeight: '700',
        marginTop: 16,
        marginBottom: 8,
    },
    signUpSubtitle: {
        color: Colors.textDim,
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
    },
    signUpButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: Colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 25,
    },
    signUpButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    swipeContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    swipeHint: {
        color: Colors.textDim,
        fontSize: 14,
        marginTop: 16,
    },
    noMoreCards: {
        alignItems: 'center',
    },
    noMoreText: {
        color: Colors.white,
        fontSize: 18,
        marginTop: 16,
        marginBottom: 20,
    },
    resetButton: {
        backgroundColor: Colors.surface,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 20,
    },
    resetText: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    swipeCard: {
        width: width - 64,
        height: height * 0.5,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: Colors.surface,
    },
    swipeCardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    swipeCardGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
    },
    swipeCardName: {
        color: Colors.white,
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 4,
    },
    swipeCardBio: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        lineHeight: 20,
    },
    swipeActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 40,
        marginTop: 20,
    },
    swipeActionBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    skipBtn: {
        borderColor: Colors.race,
        backgroundColor: `${Colors.race}20`,
    },
    matchBtn: {
        borderColor: Colors.fun,
        backgroundColor: `${Colors.fun}20`,
    },
});
