import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

interface ShareCardProps {
    type: 'event' | 'match' | 'achievement';
    title: string;
    subtitle?: string;
    emoji?: string;
    color?: string;
    shareMessage?: string;
}

export function ShareCard({ type, title, subtitle, emoji = '🔥', color = Colors.primary, shareMessage }: ShareCardProps) {
    const handleShare = async () => {
        const message = shareMessage || `${title} on The Engine! Join me: https://theengine.app`;

        try {
            await Share.share({
                message,
                url: 'https://theengine.app',
            });
        } catch (error) {
            console.error('Share error:', error);
        }
    };

    const getTypeConfig = () => {
        switch (type) {
            case 'event':
                return {
                    icon: 'calendar',
                    label: 'I\'m Racing!',
                    buttonText: 'Share Commitment',
                };
            case 'match':
                return {
                    icon: 'people',
                    label: 'New Training Partner',
                    buttonText: 'Challenge a Friend',
                };
            case 'achievement':
                return {
                    icon: 'trophy',
                    label: 'Achievement Unlocked',
                    buttonText: 'Share Achievement',
                };
            default:
                return {
                    icon: 'share',
                    label: 'Share',
                    buttonText: 'Share',
                };
        }
    };

    const config = getTypeConfig();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[color, `${color}77`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
            >
                <View style={styles.header}>
                    <View style={styles.badge}>
                        <Ionicons name={config.icon as any} size={14} color="white" />
                        <Text style={styles.badgeText}>{config.label}</Text>
                    </View>
                    <Text style={styles.emoji}>{emoji}</Text>
                </View>

                <View style={styles.content}>
                    <Text style={styles.title}>{title}</Text>
                    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                </View>

                <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                    <Ionicons name="share-outline" size={18} color={color} />
                    <Text style={[styles.shareText, { color }]}>{config.buttonText}</Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
}

// Compact share banner for post-action prompts
interface ShareBannerProps {
    message: string;
    shareContent: string;
    onDismiss?: () => void;
}

export function ShareBanner({ message, shareContent, onDismiss }: ShareBannerProps) {
    const handleShare = async () => {
        try {
            await Share.share({
                message: shareContent,
                url: 'https://theengine.app',
            });
            onDismiss?.();
        } catch (error) {
            console.error('Share error:', error);
        }
    };

    return (
        <View style={styles.banner}>
            <View style={styles.bannerContent}>
                <Text style={styles.bannerEmoji}>🚀</Text>
                <Text style={styles.bannerText}>{message}</Text>
            </View>
            <View style={styles.bannerActions}>
                <TouchableOpacity style={styles.shareSmallButton} onPress={handleShare}>
                    <Ionicons name="share-outline" size={16} color="white" />
                    <Text style={styles.shareSmallText}>Share</Text>
                </TouchableOpacity>
                {onDismiss && (
                    <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
                        <Ionicons name="close" size={18} color={Colors.textDim} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

// Referral progress card for profile
interface ReferralProgressProps {
    code: string;
    count: number;
    target?: number;
}

export function ReferralProgress({ code, count, target = 5 }: ReferralProgressProps) {
    const progress = Math.min(count / target, 1);

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Join me on The Engine! Use my code ${code} to get started. 🔥💪 https://theengine.app/invite`,
            });
        } catch (error) {
            console.error('Share error:', error);
        }
    };

    return (
        <View style={styles.referralCard}>
            <View style={styles.referralHeader}>
                <View>
                    <Text style={styles.referralTitle}>Invite Friends</Text>
                    <Text style={styles.referralSubtitle}>
                        {count} of {target} referrals for merch pack
                    </Text>
                </View>
                <View style={styles.referralBadge}>
                    <Text style={styles.referralCode}>{code}</Text>
                </View>
            </View>

            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                </View>
                <View style={styles.progressLabels}>
                    {Array.from({ length: target }).map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.progressDot,
                                i < count && styles.progressDotFilled
                            ]}
                        />
                    ))}
                </View>
            </View>

            <TouchableOpacity style={styles.inviteButton} onPress={handleShare}>
                <Ionicons name="share-social" size={18} color="white" />
                <Text style={styles.inviteText}>Share Invite Link</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    card: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(0,0,0,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    emoji: {
        fontSize: 32,
    },
    content: {
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: 'white',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: 'white',
        borderRadius: 25,
        paddingVertical: 12,
    },
    shareText: {
        fontSize: 15,
        fontWeight: '700',
    },
    // Banner styles
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: Colors.gray[700],
    },
    bannerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    bannerEmoji: {
        fontSize: 20,
    },
    bannerText: {
        fontSize: 14,
        color: Colors.white,
        flex: 1,
    },
    bannerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    shareSmallButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    shareSmallText: {
        color: 'white',
        fontSize: 13,
        fontWeight: '600',
    },
    dismissButton: {
        padding: 4,
    },
    // Referral card styles
    referralCard: {
        backgroundColor: Colors.surface,
        borderRadius: 20,
        padding: 20,
    },
    referralHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    referralTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.white,
        marginBottom: 2,
    },
    referralSubtitle: {
        fontSize: 13,
        color: Colors.textDim,
    },
    referralBadge: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    referralCode: {
        color: 'white',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
    },
    progressContainer: {
        marginBottom: 16,
    },
    progressBar: {
        height: 8,
        backgroundColor: Colors.gray[800],
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.fun,
        borderRadius: 4,
    },
    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    progressDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.gray[700],
        borderWidth: 2,
        borderColor: Colors.gray[600],
    },
    progressDotFilled: {
        backgroundColor: Colors.fun,
        borderColor: Colors.fun,
    },
    inviteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: Colors.primary,
        borderRadius: 25,
        paddingVertical: 14,
    },
    inviteText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '700',
    },
});
