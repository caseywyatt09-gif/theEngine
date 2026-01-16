import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Image,
    Animated,
    Dimensions,
    ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface MatchCelebrationProps {
    visible: boolean;
    onClose: () => void;
    onSendMessage: () => void;
    userPhoto: ImageSourcePropType;
    matchPhoto: ImageSourcePropType;
    matchName: string;
    matchBio?: string;
}

// Confetti particle component
const ConfettiParticle = ({ delay, startX }: { delay: number; startX: number }) => {
    const translateY = useRef(new Animated.Value(-50)).current;
    const translateX = useRef(new Animated.Value(0)).current;
    const rotate = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: height + 100,
                    duration: 3000,
                    useNativeDriver: true,
                }),
                Animated.timing(translateX, {
                    toValue: (Math.random() - 0.5) * 200,
                    duration: 3000,
                    useNativeDriver: true,
                }),
                Animated.timing(rotate, {
                    toValue: Math.random() * 10,
                    duration: 3000,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 3000,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, []);

    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    return (
        <Animated.View
            style={[
                styles.confetti,
                {
                    left: startX,
                    backgroundColor: randomColor,
                    transform: [
                        { translateY },
                        { translateX },
                        {
                            rotate: rotate.interpolate({
                                inputRange: [0, 10],
                                outputRange: ['0deg', '360deg'],
                            })
                        },
                    ],
                    opacity,
                },
            ]}
        />
    );
};

export default function MatchCelebration({
    visible,
    onClose,
    onSendMessage,
    userPhoto,
    matchPhoto,
    matchName,
    matchBio,
}: MatchCelebrationProps) {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Reset animations
            scaleAnim.setValue(0);
            glowAnim.setValue(0);
            textOpacity.setValue(0);

            // Start entrance animations
            Animated.sequence([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.timing(textOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            // Glow pulse animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(glowAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [visible]);

    // Generate confetti particles
    const confettiParticles = Array.from({ length: 30 }, (_, i) => (
        <ConfettiParticle
            key={i}
            delay={i * 50}
            startX={Math.random() * width}
        />
    ));

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <LinearGradient
                    colors={['rgba(255, 107, 107, 0.95)', 'rgba(78, 205, 196, 0.95)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    {/* Confetti */}
                    {confettiParticles}

                    {/* Main content */}
                    <Animated.View
                        style={[
                            styles.content,
                            {
                                transform: [{ scale: scaleAnim }],
                            },
                        ]}
                    >
                        {/* Match text */}
                        <Animated.View style={{ opacity: textOpacity }}>
                            <Text style={styles.matchTitle}>GAME ON!</Text>
                            <Text style={styles.matchSubtitle}>
                                You connected with {matchName}
                            </Text>
                        </Animated.View>

                        {/* Profile photos */}
                        <View style={styles.photosContainer}>
                            <Animated.View
                                style={[
                                    styles.photoWrapper,
                                    {
                                        shadowOpacity: glowAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.3, 0.8],
                                        }),
                                    },
                                ]}
                            >
                                <Image source={userPhoto} style={styles.photo} />
                            </Animated.View>

                            <View style={styles.heartContainer}>
                                <Ionicons name="heart" size={40} color="#FF6B6B" />
                            </View>

                            <Animated.View
                                style={[
                                    styles.photoWrapper,
                                    {
                                        shadowOpacity: glowAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.3, 0.8],
                                        }),
                                    },
                                ]}
                            >
                                <Image source={matchPhoto} style={styles.photo} />
                            </Animated.View>
                        </View>

                        {/* Bio snippet */}
                        {matchBio && (
                            <Animated.View style={{ opacity: textOpacity }}>
                                <Text style={styles.bio} numberOfLines={2}>
                                    "{matchBio}"
                                </Text>
                            </Animated.View>
                        )}

                        {/* Action buttons */}
                        <Animated.View style={[styles.actions, { opacity: textOpacity }]}>
                            <TouchableOpacity
                                style={styles.messageButton}
                                onPress={onSendMessage}
                            >
                                <Ionicons name="chatbubble" size={24} color="#fff" />
                                <Text style={styles.messageButtonText}>Send Message</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.keepSwipingButton}
                                onPress={onClose}
                            >
                                <Text style={styles.keepSwipingText}>Keep Swiping</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </Animated.View>
                </LinearGradient>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    confetti: {
        position: 'absolute',
        width: 10,
        height: 10,
        borderRadius: 2,
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    matchTitle: {
        fontSize: 42,
        fontWeight: '800',
        color: '#fff',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    matchSubtitle: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 30,
    },
    photosContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    photoWrapper: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#fff',
        overflow: 'hidden',
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 20,
        elevation: 10,
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    heartContainer: {
        marginHorizontal: -15,
        zIndex: 1,
        backgroundColor: '#fff',
        borderRadius: 25,
        padding: 5,
    },
    bio: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    actions: {
        width: '100%',
        alignItems: 'center',
    },
    messageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 30,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#fff',
    },
    messageButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        marginLeft: 10,
    },
    keepSwipingButton: {
        paddingVertical: 12,
        paddingHorizontal: 30,
    },
    keepSwipingText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 16,
        fontWeight: '600',
    },
});
