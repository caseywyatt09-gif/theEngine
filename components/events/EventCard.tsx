import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { HyroxEvent, getDaysUntil, formatEventDate, getSpotsPercentage } from '../../data/mockEvents';
import { FacePile, Attendee } from './FacePile';
import { Colors } from '../../constants/Colors';

interface EventCardProps {
    event: HyroxEvent;
    onPress: () => void;
    onRegister?: () => void;
    attendees?: Attendee[];
}

export function EventCard({ event, onPress, onRegister, attendees = [] }: EventCardProps) {
    const daysUntil = getDaysUntil(event.date);
    const spotsPercentage = getSpotsPercentage(event);
    const isRegistered = !!event.userRegistration;
    const isSoldOut = event.status === 'sold_out';
    const isFillingFast = event.status === 'filling_fast' || spotsPercentage < 30;

    const getStatusColor = () => {
        if (isRegistered) return Colors.fun;
        if (isSoldOut) return Colors.gray[600];
        if (isFillingFast) return Colors.race;
        return Colors.primary;
    };

    const getStatusText = () => {
        if (isRegistered) return 'REGISTERED';
        if (isSoldOut) return 'SOLD OUT';
        if (isFillingFast) return 'FILLING FAST';
        return 'OPEN';
    };

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
            <View style={styles.card}>
                {/* Header with gradient */}
                <LinearGradient
                    colors={[event.color, `${event.color}99`]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.header}
                >
                    {/* Top Row */}
                    <View style={styles.topRow}>
                        <Text style={styles.emoji}>{event.emoji}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
                            <Text style={styles.statusText}>{getStatusText()}</Text>
                        </View>
                    </View>

                    {/* Event Info */}
                    <View style={styles.eventInfo}>
                        <Text style={styles.eventName}>{event.name}</Text>
                        <View style={styles.locationRow}>
                            <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.8)" />
                            <Text style={styles.venue}>{event.venue}</Text>
                        </View>
                    </View>
                </LinearGradient>

                {/* Details Section */}
                <View style={styles.details}>
                    {/* Date & Countdown */}
                    <View style={styles.dateSection}>
                        <View style={styles.dateRow}>
                            <Ionicons name="calendar-outline" size={18} color={Colors.white} />
                            <Text style={styles.dateText}>{formatEventDate(event.date)}</Text>
                        </View>
                        {daysUntil > 0 && (
                            <View style={[styles.countdownBadge, { backgroundColor: daysUntil < 30 ? Colors.race : Colors.surface }]}>
                                <Text style={styles.countdownText}>
                                    {daysUntil} {daysUntil === 1 ? 'day' : 'days'} away
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Spots Remaining */}
                    {!isSoldOut && !isRegistered && (
                        <View style={styles.spotsSection}>
                            <View style={styles.spotsHeader}>
                                <Text style={styles.spotsLabel}>Spots remaining</Text>
                                <Text style={styles.spotsCount}>
                                    {event.spotsRemaining.toLocaleString()} / {event.spotsTotal.toLocaleString()}
                                </Text>
                            </View>
                            <View style={styles.progressBarBg}>
                                <View
                                    style={[
                                        styles.progressBarFill,
                                        {
                                            width: `${spotsPercentage}%`,
                                            backgroundColor: isFillingFast ? Colors.race : Colors.fun,
                                        }
                                    ]}
                                />
                            </View>
                        </View>
                    )}

                    {/* Attendees FacePile */}
                    {attendees.length > 0 && (
                        <View style={styles.attendeesSection}>
                            <FacePile attendees={attendees} size="medium" />
                            <Text style={styles.attendeesText}>
                                {(event.spotsTotal - event.spotsRemaining).toLocaleString()} going
                            </Text>
                        </View>
                    )}

                    {/* Registered Info */}
                    {isRegistered && event.userRegistration && (
                        <View style={styles.registeredSection}>
                            <View style={styles.registeredRow}>
                                <Ionicons name="checkmark-circle" size={20} color={Colors.fun} />
                                <Text style={styles.registeredText}>
                                    {event.userRegistration.category} • Wave {event.userRegistration.waveTime}
                                </Text>
                            </View>
                            <Text style={styles.confirmationCode}>
                                {event.userRegistration.confirmationCode}
                            </Text>
                        </View>
                    )}

                    {/* Price & CTA Row */}
                    <View style={styles.bottomRow}>
                        <View style={styles.priceSection}>
                            <Text style={styles.priceLabel}>From</Text>
                            <Text style={styles.priceValue}>${event.priceRange.min}</Text>
                        </View>

                        {!isRegistered && !isSoldOut && (
                            <TouchableOpacity
                                style={[styles.registerButton, { backgroundColor: event.color }]}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    onRegister?.();
                                }}
                            >
                                <Text style={styles.registerButtonText}>Register Now</Text>
                                <Ionicons name="arrow-forward" size={16} color="white" />
                            </TouchableOpacity>
                        )}

                        {isRegistered && (
                            <TouchableOpacity style={styles.viewTicketButton}>
                                <Ionicons name="qr-code-outline" size={18} color={Colors.fun} />
                                <Text style={styles.viewTicketText}>View Ticket</Text>
                            </TouchableOpacity>
                        )}

                        {isSoldOut && (
                            <TouchableOpacity style={styles.waitlistButton}>
                                <Text style={styles.waitlistText}>Join Waitlist</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Highlights */}
                    <View style={styles.highlightsRow}>
                        {event.highlights.slice(0, 3).map((highlight, idx) => (
                            <View key={idx} style={styles.highlightPill}>
                                <Text style={styles.highlightText}>{highlight}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.surface,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 16,
    },
    header: {
        padding: 16,
        minHeight: 120,
        justifyContent: 'space-between',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    emoji: {
        fontSize: 32,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    eventInfo: {
        marginTop: 8,
    },
    eventName: {
        color: 'white',
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    venue: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 13,
    },
    details: {
        padding: 16,
    },
    dateSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dateText: {
        color: Colors.white,
        fontSize: 15,
        fontWeight: '600',
    },
    countdownBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    countdownText: {
        color: 'white',
        fontSize: 11,
        fontWeight: '600',
    },
    spotsSection: {
        marginBottom: 16,
    },
    spotsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    spotsLabel: {
        color: Colors.textDim,
        fontSize: 12,
    },
    spotsCount: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: '600',
    },
    progressBarBg: {
        height: 6,
        backgroundColor: Colors.gray[800],
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    registeredSection: {
        backgroundColor: `${Colors.fun}15`,
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
    },
    registeredRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    registeredText: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    confirmationCode: {
        color: Colors.textDim,
        fontSize: 12,
        marginTop: 4,
        marginLeft: 28,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    priceSection: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    priceLabel: {
        color: Colors.textDim,
        fontSize: 12,
    },
    priceValue: {
        color: Colors.white,
        fontSize: 24,
        fontWeight: '800',
    },
    registerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    registerButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '700',
    },
    viewTicketButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.fun,
    },
    viewTicketText: {
        color: Colors.fun,
        fontSize: 14,
        fontWeight: '600',
    },
    waitlistButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.gray[600],
    },
    waitlistText: {
        color: Colors.textDim,
        fontSize: 14,
        fontWeight: '600',
    },
    highlightsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    highlightPill: {
        backgroundColor: Colors.gray[800],
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    highlightText: {
        color: Colors.textDim,
        fontSize: 11,
    },
    attendeesSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: Colors.gray[800],
        borderRadius: 12,
    },
    attendeesText: {
        color: Colors.white,
        fontSize: 13,
        fontWeight: '600',
    },
});
