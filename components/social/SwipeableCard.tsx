import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Athlete } from '../../data/mockAthletes';
import { Colors } from '../../constants/Colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;
const CARD_HEIGHT = Math.min(SCREEN_HEIGHT * 0.58, 480);
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

interface SwipeableCardProps {
    athlete: Athlete;
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
    onSuperLike?: () => void;
    mode: 'race' | 'fun';
    matchHint?: string; // AI-generated hint
}

export function SwipeableCard({ athlete, onSwipeLeft, onSwipeRight, onSuperLike, mode, matchHint }: SwipeableCardProps) {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const rotation = useSharedValue(0);
    const [photoIndex, setPhotoIndex] = useState(0);

    const accentColor = mode === 'race' ? Colors.race : Colors.fun;

    // Mock multiple photos (reusing avatar for demo)
    const photos = athlete.photos || [athlete.avatar, athlete.avatar, athlete.avatar];

    const handlePhotoTap = (side: 'left' | 'right') => {
        if (side === 'right' && photoIndex < photos.length - 1) {
            setPhotoIndex(photoIndex + 1);
        } else if (side === 'left' && photoIndex > 0) {
            setPhotoIndex(photoIndex - 1);
        }
    };

    const panGesture = Gesture.Pan()
        .activeOffsetX([-10, 10]) // Fail if x movement is small, to allow vertical scrolling? No, we want to CATCH horizontal
        // Actually, for a horizontal swipe card, we want to fail vertical.
        // Let's use activeOffsetX to trigger quickly on horizontal movement.
        .activeOffsetX([-20, 20])
        .onUpdate((event) => {
            translateX.value = event.translationX;
            translateY.value = event.translationY * 0.5;
            rotation.value = interpolate(
                event.translationX,
                [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
                [-15, 0, 15],
                Extrapolation.CLAMP
            );
        })
        .onEnd((event) => {
            if (event.translationX > SWIPE_THRESHOLD) {
                // Swipe Right - Like
                translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 300 }, () => {
                    runOnJS(onSwipeRight)();
                });
            } else if (event.translationX < -SWIPE_THRESHOLD) {
                // Swipe Left - Pass
                translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 300 }, () => {
                    runOnJS(onSwipeLeft)();
                });
            } else {
                // Spring back
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
                rotation.value = withSpring(0);
            }
        });

    const cardStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { rotate: `${rotation.value}deg` },
        ],
    }));

    const likeOpacity = useAnimatedStyle(() => ({
        opacity: interpolate(
            translateX.value,
            [0, SWIPE_THRESHOLD],
            [0, 1],
            Extrapolation.CLAMP
        ),
    }));

    const nopeOpacity = useAnimatedStyle(() => ({
        opacity: interpolate(
            translateX.value,
            [-SWIPE_THRESHOLD, 0],
            [1, 0],
            Extrapolation.CLAMP
        ),
    }));

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.card, cardStyle]}>
                {/* Photo with tap zones */}
                <View style={styles.photoContainer}>
                    <Image
                        source={photos[photoIndex]}
                        style={styles.photo}
                        resizeMode="cover"
                    />

                    {/* Tap zones for photo navigation */}
                    <View style={styles.tapZones}>
                        <TouchableOpacity
                            style={styles.tapZoneLeft}
                            onPress={() => handlePhotoTap('left')}
                            activeOpacity={1}
                        />
                        <TouchableOpacity
                            style={styles.tapZoneRight}
                            onPress={() => handlePhotoTap('right')}
                            activeOpacity={1}
                        />
                    </View>

                    {/* Photo dots */}
                    <View style={styles.dotsContainer}>
                        {photos.map((_, idx) => (
                            <View
                                key={idx}
                                style={[
                                    styles.dot,
                                    idx === photoIndex && styles.dotActive
                                ]}
                            />
                        ))}
                    </View>

                    {/* Like/Nope stamps */}
                    <Animated.View style={[styles.stamp, styles.likeStamp, likeOpacity]}>
                        <Text style={[styles.stampText, { color: Colors.fun }]}>LIKE</Text>
                    </Animated.View>
                    <Animated.View style={[styles.stamp, styles.nopeStamp, nopeOpacity]}>
                        <Text style={[styles.stampText, { color: Colors.race }]}>NOPE</Text>
                    </Animated.View>

                    {/* Gradient */}
                    <LinearGradient
                        colors={['transparent', 'transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.95)']}
                        locations={[0, 0.4, 0.7, 1]}
                        style={styles.gradient}
                    />

                    {/* Mode Badge */}
                    <View style={[styles.modeBadge, { backgroundColor: athlete.currentMode === 'race' ? Colors.race : Colors.fun }]}>
                        <Text style={styles.modeBadgeText}>
                            {athlete.currentMode === 'race' ? '🏁 RACE' : '🎉 FUN'}
                        </Text>
                    </View>
                </View>

                {/* Bottom Content */}
                <View style={styles.content}>
                    <View style={styles.nameRow}>
                        <Text style={styles.name}>{athlete.displayName}</Text>
                        {athlete.age && <Text style={styles.age}>{athlete.age}</Text>}
                        <View style={[styles.activeIndicator, { backgroundColor: Colors.fun }]} />
                    </View>

                    <Text style={styles.location}>
                        <Ionicons name="location" size={12} color={Colors.textDim} /> {athlete.location}
                    </Text>

                    {/* Tags */}
                    <View style={styles.tags}>
                        {mode === 'race' ? (
                            <>
                                {athlete.racePace && (
                                    <View style={styles.tag}>
                                        <Text style={styles.tagText}>{athlete.racePace}</Text>
                                    </View>
                                )}
                                {athlete.vo2Max && (
                                    <View style={styles.tag}>
                                        <Text style={styles.tagText}>VO2: {athlete.vo2Max}</Text>
                                    </View>
                                )}
                            </>
                        ) : (
                            <>
                                {athlete.vibeCheck && (
                                    <View style={styles.tag}>
                                        <Text style={styles.tagText}>{athlete.vibeCheck}</Text>
                                    </View>
                                )}
                                {athlete.favoriteActivities?.slice(0, 2).map((activity) => (
                                    <View key={activity} style={styles.tag}>
                                        <Text style={styles.tagText}>{activity}</Text>
                                    </View>
                                ))}
                            </>
                        )}
                    </View>

                    <Text style={styles.bio} numberOfLines={2}>{athlete.bio}</Text>

                    {/* AI Match Hint */}
                    {matchHint && (
                        <View style={styles.hintContainer}>
                            <Ionicons name="sparkles" size={14} color="#FFD700" />
                            <Text style={styles.hintText}>{matchHint}</Text>
                        </View>
                    )}

                    {/* Action Buttons */}
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={styles.actionBtn}
                            onPress={onSwipeLeft}
                        >
                            <Ionicons name="close" size={28} color={Colors.race} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionBtnStar}
                            onPress={onSuperLike}
                        >
                            <Ionicons name="star" size={24} color="#00D4FF" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionBtnLike, { backgroundColor: accentColor }]}
                            onPress={onSwipeRight}
                        >
                            <Ionicons name="heart" size={32} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionBtn}>
                            <Ionicons name="chatbubble" size={22} color="#A855F7" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        </GestureDetector>
    );
}

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 24,
        backgroundColor: '#1a1a1a',
        overflow: 'hidden',
        position: 'absolute',
    },
    photoContainer: {
        height: '65%',
        position: 'relative',
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    tapZones: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
    },
    tapZoneLeft: {
        flex: 1,
    },
    tapZoneRight: {
        flex: 1,
    },
    dotsContainer: {
        position: 'absolute',
        top: 12,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    dotActive: {
        backgroundColor: 'white',
        width: 20,
    },
    stamp: {
        position: 'absolute',
        top: 50,
        padding: 8,
        paddingHorizontal: 16,
        borderWidth: 4,
        borderRadius: 8,
        transform: [{ rotate: '-15deg' }],
    },
    likeStamp: {
        right: 20,
        borderColor: Colors.fun,
    },
    nopeStamp: {
        left: 20,
        borderColor: Colors.race,
    },
    stampText: {
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: 2,
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 100,
    },
    modeBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    modeBadgeText: {
        color: 'white',
        fontSize: 11,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 16,
        paddingTop: 12,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 4,
    },
    name: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'white',
    },
    age: {
        fontSize: 22,
        color: 'white',
    },
    activeIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    location: {
        fontSize: 13,
        color: Colors.textDim,
        marginBottom: 10,
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 8,
    },
    tag: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    tagText: {
        color: 'white',
        fontSize: 12,
    },
    bio: {
        color: '#aaa',
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 8,
    },
    hintContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
        backgroundColor: 'rgba(20, 20, 20, 0.8)',
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.3)',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    hintText: {
        color: '#FFD700',
        fontSize: 12,
        fontWeight: '500',
        flex: 1,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    actionBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#262626',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    actionBtnStar: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: '#262626',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    actionBtnLike: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
