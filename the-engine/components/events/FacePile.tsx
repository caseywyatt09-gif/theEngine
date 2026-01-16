import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

export interface Attendee {
    id: string;
    avatar_url: string | null;
    displayName?: string;
}

interface FacePileProps {
    attendees: Attendee[];
    maxVisible?: number;
    size?: 'small' | 'medium' | 'large';
    showCount?: boolean;
}

export function FacePile({
    attendees,
    maxVisible = 4,
    size = 'medium',
    showCount = true
}: FacePileProps) {
    const previewAttendees = attendees.slice(0, maxVisible);
    const remainingCount = attendees.length - maxVisible;

    const sizeMap = {
        small: { avatar: 24, border: 1, overlap: -8, fontSize: 10 },
        medium: { avatar: 32, border: 2, overlap: -12, fontSize: 12 },
        large: { avatar: 40, border: 2, overlap: -14, fontSize: 14 },
    };

    const config = sizeMap[size];

    if (attendees.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.avatarRow}>
                {previewAttendees.map((user, index) => (
                    <Image
                        key={user.id}
                        source={{
                            uri: user.avatar_url || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop'
                        }}
                        style={[
                            styles.avatar,
                            {
                                width: config.avatar,
                                height: config.avatar,
                                borderRadius: config.avatar / 2,
                                borderWidth: config.border,
                                marginLeft: index === 0 ? 0 : config.overlap,
                                zIndex: previewAttendees.length - index,
                            }
                        ]}
                    />
                ))}
            </View>
            {showCount && remainingCount > 0 && (
                <Text style={[styles.remainingText, { fontSize: config.fontSize }]}>
                    +{remainingCount} more
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarRow: {
        flexDirection: 'row',
        marginRight: 8,
    },
    avatar: {
        borderColor: Colors.background,
        backgroundColor: Colors.gray[700],
    },
    remainingText: {
        color: Colors.textDim,
        fontWeight: '600',
    },
});
