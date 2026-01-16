// AI-generated match hints based on shared activities and goals

export interface MatchHint {
    athleteId: string;
    hints: string[];
    compatibilityScore: number; // 0-100
    sharedInterests: string[];
}

// Generate dynamic hints based on athlete data
export const generateMatchHints = (
    athleteActivities: string[],
    athleteGoal?: string,
    athleteLevel?: string
): string[] => {
    const hints: string[] = [];

    // Activity-based hints
    if (athleteActivities.includes('Running')) {
        hints.push('🏃 You both love running! Maybe a morning jog together?');
    }
    if (athleteActivities.includes('CrossFit')) {
        hints.push('💪 Fellow CrossFitter! Compare your Fran times');
    }
    if (athleteActivities.includes('Cycling')) {
        hints.push('🚴 Cyclist like you! Great for group rides');
    }
    if (athleteActivities.includes('Swimming')) {
        hints.push('🏊 Another swimmer! Perfect lane partner');
    }
    if (athleteActivities.includes('Yoga')) {
        hints.push('🧘 Yoga enthusiast! Great for active recovery sessions');
    }
    if (athleteActivities.includes('HIIT')) {
        hints.push('🔥 HIIT lover! Push each other in workouts');
    }
    if (athleteActivities.includes('Trail')) {
        hints.push('🥾 Trail runner! Explore new routes together');
    }

    // Goal-based hints
    if (athleteGoal?.toLowerCase().includes('marathon')) {
        hints.push('🏅 Training for a marathon too! Long run buddy potential');
    }
    if (athleteGoal?.toLowerCase().includes('hyrox')) {
        hints.push('⚡ HYROX training partner! Practice those sled pushes');
    }
    if (athleteGoal?.toLowerCase().includes('weight')) {
        hints.push('💪 Similar fitness goals! Accountability partner');
    }

    // Level-based hints
    if (athleteLevel === 'Advanced' || athleteLevel === 'Elite') {
        hints.push('🎯 Serious athlete - they can push you to new PRs');
    }
    if (athleteLevel === 'Beginner') {
        hints.push('🌱 Could use a mentor - share your experience!');
    }

    // If no specific hints, add general ones
    if (hints.length === 0) {
        hints.push('✨ Similar vibe - give it a shot!');
        hints.push('🤝 Shared passion for fitness');
    }

    return hints.slice(0, 2); // Return max 2 hints
};

// Pre-generated hints for mock athletes (keyed by athlete ID)
export const MOCK_MATCH_HINTS: Record<string, MatchHint> = {
    '1': {
        athleteId: '1',
        hints: [
            '🏃 You both love running! Maybe a morning jog together?',
            '🏅 Training for Boston like you - long run partner!',
        ],
        compatibilityScore: 92,
        sharedInterests: ['Running', 'Cycling', 'Early Bird'],
    },
    '2': {
        athleteId: '2',
        hints: [
            '⚡ HYROX training partner! Practice those sled pushes',
            '💪 CrossFitter like you - compare WOD times',
        ],
        compatibilityScore: 88,
        sharedInterests: ['CrossFit', 'HYROX', 'Strength Training'],
    },
    '3': {
        athleteId: '3',
        hints: [
            '🚴 Cyclist like you! Great for group rides',
            '🎯 Competitive spirit - they\'ll push you!',
        ],
        compatibilityScore: 85,
        sharedInterests: ['Cycling', 'Trail Running'],
    },
    '4': {
        athleteId: '4',
        hints: [
            '🧘 Yoga enthusiast like you! Active recovery sessions',
            '🏊 Swimmers connect! Lane partner potential',
        ],
        compatibilityScore: 78,
        sharedInterests: ['Yoga', 'Swimming', 'Recovery'],
    },
    '5': {
        athleteId: '5',
        hints: [
            '🔥 HIIT lover! Push each other in workouts',
            '☀️ Morning person too - early gym sessions?',
        ],
        compatibilityScore: 90,
        sharedInterests: ['HIIT', 'Early Bird', 'Cardio'],
    },
};

// Get hint for an athlete, with fallback generation
export const getMatchHint = (athleteId: string, activities?: string[]): string => {
    const preGenerated = MOCK_MATCH_HINTS[athleteId];
    if (preGenerated && preGenerated.hints.length > 0) {
        return preGenerated.hints[0];
    }

    if (activities && activities.length > 0) {
        const hints = generateMatchHints(activities);
        return hints[0] || '✨ Could be a great training partner!';
    }

    return '✨ Similar fitness goals - worth a swipe!';
};

// Get compatibility score
export const getCompatibilityScore = (athleteId: string): number => {
    return MOCK_MATCH_HINTS[athleteId]?.compatibilityScore || Math.floor(Math.random() * 30) + 70;
};
