import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { HyroxEvent, HyroxCategory, WAVE_TIMES, CATEGORY_PRICES, formatEventDate } from '../../data/mockEvents';
import { Colors } from '../../constants/Colors';

interface RegistrationModalProps {
    visible: boolean;
    event: HyroxEvent | null;
    onClose: () => void;
    onComplete: (registration: {
        category: HyroxCategory;
        partner?: string;
        waveTime: string;
    }) => void;
}

type Step = 'category' | 'partner' | 'wave' | 'confirm';

export function RegistrationModal({ visible, event, onClose, onComplete }: RegistrationModalProps) {
    const [step, setStep] = useState<Step>('category');
    const [selectedCategory, setSelectedCategory] = useState<HyroxCategory | null>(null);
    const [partnerName, setPartnerName] = useState('');
    const [selectedWave, setSelectedWave] = useState<string | null>(null);

    if (!event) return null;

    const isDoublesCategory = selectedCategory?.includes('Doubles') || selectedCategory === 'Relay';
    const price = selectedCategory ? CATEGORY_PRICES[selectedCategory] : 0;

    const handleNext = () => {
        if (step === 'category') {
            if (isDoublesCategory) {
                setStep('partner');
            } else {
                setStep('wave');
            }
        } else if (step === 'partner') {
            setStep('wave');
        } else if (step === 'wave') {
            setStep('confirm');
        }
    };

    const handleBack = () => {
        if (step === 'partner') {
            setStep('category');
        } else if (step === 'wave') {
            if (isDoublesCategory) {
                setStep('partner');
            } else {
                setStep('category');
            }
        } else if (step === 'confirm') {
            setStep('wave');
        }
    };

    const handleComplete = () => {
        if (selectedCategory && selectedWave) {
            onComplete({
                category: selectedCategory,
                partner: isDoublesCategory ? partnerName : undefined,
                waveTime: selectedWave,
            });
        }
    };

    const resetAndClose = () => {
        setStep('category');
        setSelectedCategory(null);
        setPartnerName('');
        setSelectedWave(null);
        onClose();
    };

    const getStepNumber = () => {
        const steps = isDoublesCategory ? ['category', 'partner', 'wave', 'confirm'] : ['category', 'wave', 'confirm'];
        return steps.indexOf(step) + 1;
    };

    const getTotalSteps = () => {
        return isDoublesCategory ? 4 : 3;
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={resetAndClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color={Colors.white} />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>Register</Text>
                        <Text style={styles.stepIndicator}>
                            Step {getStepNumber()} of {getTotalSteps()}
                        </Text>
                    </View>
                    <View style={{ width: 40 }} />
                </View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                    <View style={[styles.progressFill, { width: `${(getStepNumber() / getTotalSteps()) * 100}%` }]} />
                </View>

                {/* Event Summary */}
                <LinearGradient
                    colors={[event.color, `${event.color}77`]}
                    style={styles.eventSummary}
                >
                    <Text style={styles.eventEmoji}>{event.emoji}</Text>
                    <View style={styles.eventDetails}>
                        <Text style={styles.eventName}>{event.name}</Text>
                        <Text style={styles.eventDate}>{formatEventDate(event.date)}</Text>
                    </View>
                </LinearGradient>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Category Selection */}
                    {step === 'category' && (
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Choose Your Category</Text>
                            <Text style={styles.stepSubtitle}>Select how you want to compete</Text>

                            <View style={styles.categoryGrid}>
                                {event.categories.map((category) => (
                                    <TouchableOpacity
                                        key={category}
                                        style={[
                                            styles.categoryCard,
                                            selectedCategory === category && { borderColor: event.color, borderWidth: 2 }
                                        ]}
                                        onPress={() => setSelectedCategory(category)}
                                    >
                                        <View style={styles.categoryIcon}>
                                            <Ionicons
                                                name={
                                                    category.includes('Pro') ? 'trophy' :
                                                        category.includes('Doubles') ? 'people' :
                                                            category === 'Relay' ? 'repeat' : 'person'
                                                }
                                                size={24}
                                                color={selectedCategory === category ? event.color : Colors.textDim}
                                            />
                                        </View>
                                        <Text style={[
                                            styles.categoryName,
                                            selectedCategory === category && { color: Colors.white }
                                        ]}>
                                            {category}
                                        </Text>
                                        <Text style={styles.categoryPrice}>
                                            ${CATEGORY_PRICES[category]}
                                        </Text>
                                        {selectedCategory === category && (
                                            <View style={[styles.checkmark, { backgroundColor: event.color }]}>
                                                <Ionicons name="checkmark" size={14} color="white" />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Partner Selection */}
                    {step === 'partner' && (
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Add Your Partner</Text>
                            <Text style={styles.stepSubtitle}>
                                {selectedCategory === 'Relay'
                                    ? 'Enter your relay team members'
                                    : 'Who are you racing with?'}
                            </Text>

                            <View style={styles.partnerInput}>
                                <Ionicons name="person-add-outline" size={20} color={Colors.textDim} />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Search by name or email..."
                                    placeholderTextColor={Colors.textDim}
                                    value={partnerName}
                                    onChangeText={setPartnerName}
                                />
                            </View>

                            <Text style={styles.orText}>— or —</Text>

                            <TouchableOpacity style={styles.inviteButton}>
                                <Ionicons name="link-outline" size={20} color={event.color} />
                                <Text style={[styles.inviteText, { color: event.color }]}>
                                    Send Invite Link
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.partnerNote}>
                                <Ionicons name="information-circle-outline" size={18} color={Colors.textDim} />
                                <Text style={styles.partnerNoteText}>
                                    Your partner will receive an email to confirm their spot. You can also add them later.
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Wave Selection */}
                    {step === 'wave' && (
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Select Your Wave</Text>
                            <Text style={styles.stepSubtitle}>Choose your preferred start time</Text>

                            <View style={styles.waveGrid}>
                                {WAVE_TIMES.map((time) => {
                                    const isPeakTime = ['09:00', '09:30', '10:00', '10:30'].includes(time);
                                    return (
                                        <TouchableOpacity
                                            key={time}
                                            style={[
                                                styles.waveSlot,
                                                selectedWave === time && { backgroundColor: event.color }
                                            ]}
                                            onPress={() => setSelectedWave(time)}
                                        >
                                            <Text style={[
                                                styles.waveTime,
                                                selectedWave === time && { color: 'white' }
                                            ]}>
                                                {time}
                                            </Text>
                                            {isPeakTime && selectedWave !== time && (
                                                <View style={styles.peakBadge}>
                                                    <Text style={styles.peakText}>PEAK</Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            <View style={styles.waveNote}>
                                <Ionicons name="time-outline" size={18} color={Colors.textDim} />
                                <Text style={styles.waveNoteText}>
                                    Peak times (9-11am) fill up fastest. Early and afternoon slots are usually quieter.
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Confirmation */}
                    {step === 'confirm' && (
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Review & Confirm</Text>
                            <Text style={styles.stepSubtitle}>Double-check your registration</Text>

                            <View style={styles.summaryCard}>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Event</Text>
                                    <Text style={styles.summaryValue}>{event.name}</Text>
                                </View>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Date</Text>
                                    <Text style={styles.summaryValue}>{formatEventDate(event.date)}</Text>
                                </View>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Category</Text>
                                    <Text style={styles.summaryValue}>{selectedCategory}</Text>
                                </View>
                                {isDoublesCategory && partnerName && (
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Partner</Text>
                                        <Text style={styles.summaryValue}>{partnerName}</Text>
                                    </View>
                                )}
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Wave Time</Text>
                                    <Text style={styles.summaryValue}>{selectedWave}</Text>
                                </View>
                                <View style={[styles.summaryRow, styles.totalRow]}>
                                    <Text style={styles.totalLabel}>Total</Text>
                                    <Text style={styles.totalValue}>${price}</Text>
                                </View>
                            </View>

                            <View style={styles.termsNote}>
                                <Ionicons name="shield-checkmark-outline" size={18} color={Colors.fun} />
                                <Text style={styles.termsText}>
                                    By registering, you agree to the HYROX Terms of Service and Waiver.
                                </Text>
                            </View>
                        </View>
                    )}
                </ScrollView>

                {/* Bottom Actions */}
                <View style={styles.bottomActions}>
                    {step !== 'category' && (
                        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <Ionicons name="arrow-back" size={20} color={Colors.white} />
                            <Text style={styles.backText}>Back</Text>
                        </TouchableOpacity>
                    )}

                    {step !== 'confirm' ? (
                        <TouchableOpacity
                            style={[
                                styles.nextButton,
                                { backgroundColor: event.color },
                                (!selectedCategory || (step === 'wave' && !selectedWave)) && styles.disabledButton
                            ]}
                            onPress={handleNext}
                            disabled={!selectedCategory || (step === 'wave' && !selectedWave)}
                        >
                            <Text style={styles.nextText}>Continue</Text>
                            <Ionicons name="arrow-forward" size={20} color="white" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[styles.completeButton, { backgroundColor: Colors.fun }]}
                            onPress={handleComplete}
                        >
                            <Ionicons name="checkmark-circle" size={22} color="white" />
                            <Text style={styles.completeText}>Complete Registration</Text>
                        </TouchableOpacity>
                    )}
                </View>
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
    stepIndicator: {
        color: Colors.textDim,
        fontSize: 12,
        marginTop: 2,
    },
    progressContainer: {
        height: 3,
        backgroundColor: Colors.gray[800],
        marginHorizontal: 16,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.fun,
        borderRadius: 2,
    },
    eventSummary: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 16,
        padding: 16,
        borderRadius: 16,
        gap: 12,
    },
    eventEmoji: {
        fontSize: 36,
    },
    eventDetails: {
        flex: 1,
    },
    eventName: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
    eventDate: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 13,
        marginTop: 2,
    },
    content: {
        flex: 1,
    },
    stepContent: {
        padding: 16,
    },
    stepTitle: {
        color: Colors.white,
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 4,
    },
    stepSubtitle: {
        color: Colors.textDim,
        fontSize: 14,
        marginBottom: 24,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    categoryCard: {
        width: '47%',
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.gray[700],
        position: 'relative',
    },
    categoryIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.gray[800],
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    categoryName: {
        color: Colors.textDim,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    categoryPrice: {
        color: Colors.white,
        fontSize: 20,
        fontWeight: '800',
    },
    checkmark: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    partnerInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: 16,
        gap: 12,
        borderWidth: 1,
        borderColor: Colors.gray[700],
    },
    textInput: {
        flex: 1,
        color: Colors.white,
        fontSize: 16,
    },
    orText: {
        color: Colors.textDim,
        textAlign: 'center',
        marginVertical: 20,
    },
    inviteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.gray[700],
    },
    inviteText: {
        fontSize: 15,
        fontWeight: '600',
    },
    partnerNote: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        marginTop: 24,
        padding: 12,
        backgroundColor: Colors.surface,
        borderRadius: 12,
    },
    partnerNoteText: {
        flex: 1,
        color: Colors.textDim,
        fontSize: 13,
        lineHeight: 18,
    },
    waveGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    waveSlot: {
        width: '23%',
        paddingVertical: 14,
        backgroundColor: Colors.surface,
        borderRadius: 12,
        alignItems: 'center',
        position: 'relative',
    },
    waveTime: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    peakBadge: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: Colors.race,
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 4,
    },
    peakText: {
        color: 'white',
        fontSize: 8,
        fontWeight: '700',
    },
    waveNote: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        marginTop: 24,
        padding: 12,
        backgroundColor: Colors.surface,
        borderRadius: 12,
    },
    waveNoteText: {
        flex: 1,
        color: Colors.textDim,
        fontSize: 13,
        lineHeight: 18,
    },
    summaryCard: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray[800],
    },
    summaryLabel: {
        color: Colors.textDim,
        fontSize: 14,
    },
    summaryValue: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    totalRow: {
        borderBottomWidth: 0,
        marginTop: 8,
    },
    totalLabel: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
    totalValue: {
        color: Colors.fun,
        fontSize: 24,
        fontWeight: '800',
    },
    termsNote: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        marginTop: 24,
        padding: 12,
        backgroundColor: `${Colors.fun}15`,
        borderRadius: 12,
    },
    termsText: {
        flex: 1,
        color: Colors.textDim,
        fontSize: 13,
        lineHeight: 18,
    },
    bottomActions: {
        flexDirection: 'row',
        padding: 16,
        paddingBottom: 32,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.gray[800],
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 25,
        backgroundColor: Colors.surface,
    },
    backText: {
        color: Colors.white,
        fontSize: 15,
        fontWeight: '600',
    },
    nextButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 25,
    },
    nextText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    disabledButton: {
        opacity: 0.5,
    },
    completeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 25,
    },
    completeText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
});
