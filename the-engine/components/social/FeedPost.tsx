import { View, Text, TouchableOpacity, Image, Dimensions, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Post } from '../../data/mockPosts';
import { Colors } from '../../constants/Colors';
import { useState, useRef } from 'react';
import { Video, ResizeMode } from 'expo-av';

const { width } = Dimensions.get('window');

interface FeedPostProps {
    post: Post;
    onLike?: () => void;
    onComment?: () => void;
    onShare?: () => void;
    onProfile?: () => void;
}

export function FeedPost({ post, onLike, onComment, onShare, onProfile }: FeedPostProps) {
    const [isLiked, setIsLiked] = useState(post.isLiked || false);
    const [likeCount, setLikeCount] = useState(post.likes);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<Video>(null);

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
        onLike?.();
    };

    return (
        <View style={styles.container}>
            {/* Header Row - IG style */}
            <TouchableOpacity onPress={onProfile} style={styles.header}>
                <Image source={post.authorAvatar} style={styles.avatar} />
                <View style={styles.headerText}>
                    <View style={styles.nameRow}>
                        <Text style={styles.authorName}>{post.authorName}</Text>
                        {post.authorVerified && (
                            <Ionicons name="checkmark-circle" size={14} color={Colors.secondary} />
                        )}
                    </View>
                    {post.location && (
                        <Text style={styles.location}>{post.location}</Text>
                    )}
                </View>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-horizontal" size={20} color="white" />
                </TouchableOpacity>
            </TouchableOpacity>

            {/* Media Content */}
            <TouchableOpacity
                activeOpacity={0.95}
                onPress={() => {
                    if (post.isVideo) {
                        setIsPlaying(!isPlaying);
                        isPlaying ? videoRef.current?.pauseAsync() : videoRef.current?.playAsync();
                    } else {
                        handleLike();
                    }
                }}
                style={{ position: 'relative' }}
            >
                {post.isVideo && post.videoUrl ? (
                    <Video
                        ref={videoRef}
                        style={styles.postImage}
                        source={{ uri: post.videoUrl }}
                        useNativeControls={false}
                        resizeMode={ResizeMode.COVER}
                        isLooping
                        shouldPlay={isPlaying}
                    />
                ) : (
                    <Image
                        source={post.image || post.authorAvatar}
                        style={styles.postImage}
                        resizeMode="cover"
                    />
                )}

                {/* Video UI Overlay - Show when paused/stopped */}
                {post.isVideo && !isPlaying && (
                    <View style={styles.videoOverlay}>
                        <View style={styles.playButton}>
                            <Ionicons name="play" size={32} color="white" style={{ marginLeft: 4 }} />
                        </View>
                    </View>
                )}
            </TouchableOpacity>

            {/* Action Bar - Engine style */}
            <View style={styles.actionBar}>
                <View style={styles.leftActions}>
                    <TouchableOpacity onPress={handleLike} style={styles.actionBtn}>
                        <Ionicons
                            name={isLiked ? "flame" : "flame-outline"}
                            size={28}
                            color={isLiked ? '#FF6B35' : 'white'}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onComment} style={styles.actionBtn}>
                        <Ionicons name="chatbubble-outline" size={26} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onShare} style={styles.actionBtn}>
                        <Ionicons name="rocket-outline" size={26} color="white" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity>
                    <Ionicons name="trophy-outline" size={26} color="white" />
                </TouchableOpacity>
            </View>

            {/* Likes */}
            <Text style={styles.likes}>{likeCount.toLocaleString()} likes</Text>

            {/* Caption */}
            <View style={styles.caption}>
                <Text style={styles.captionText}>
                    <Text style={styles.captionAuthor}>{post.authorName.split(' ')[0].toLowerCase()}</Text>
                    {' '}{post.content}
                </Text>
            </View>

            {/* Comments Link */}
            {post.comments > 0 && (
                <TouchableOpacity style={styles.commentsLink}>
                    <Text style={styles.commentsText}>View all {post.comments} comments</Text>
                </TouchableOpacity>
            )}

            {/* Timestamp */}
            <Text style={styles.timestamp}>{post.timestamp}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        borderBottomWidth: 1,
        borderBottomColor: '#262626',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    headerText: {
        flex: 1,
        marginLeft: 10,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    authorName: {
        color: 'white',
        fontWeight: '600',
        fontSize: 13,
    },
    location: {
        color: '#888',
        fontSize: 11,
        marginTop: 1,
    },
    postImage: {
        width: width,
        height: width,
    },
    actionBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    leftActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionBtn: {
        marginRight: 14,
    },
    likes: {
        color: 'white',
        fontWeight: '600',
        fontSize: 13,
        paddingHorizontal: 12,
        marginBottom: 6,
    },
    caption: {
        paddingHorizontal: 12,
    },
    captionText: {
        color: 'white',
        fontSize: 13,
        lineHeight: 18,
    },
    captionAuthor: {
        fontWeight: '600',
    },
    commentsLink: {
        paddingHorizontal: 12,
        marginTop: 4,
    },
    commentsText: {
        color: '#888',
        fontSize: 13,
    },
    timestamp: {
        color: '#888',
        fontSize: 10,
        textTransform: 'uppercase',
        paddingHorizontal: 12,
        marginTop: 6,
        marginBottom: 12,
    },
    videoOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    playButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    durationBadge: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    durationText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
