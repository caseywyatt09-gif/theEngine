// Hyrox Station Images - require() for local assets
export const STATION_IMAGES = {
    skierg: require('../assets/stations/skierg.png'),
    sled_push: require('../assets/stations/sled_push.png'),
    sled_pull: require('../assets/stations/sled_pull.png'),
    burpee: require('../assets/stations/burpee.png'),
    rowing: require('../assets/stations/rowing.png'),
    farmers_carry: require('../assets/stations/farmers_carry.png'),
    lunges: require('../assets/stations/lunges.png'),
    wallballs: require('../assets/stations/wallballs.png'),
};

export interface StationWorkout {
    id: string;
    title: string;
    duration: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite';
    description: string;
    reps?: string;
}

export interface HyroxStation {
    id: string;
    name: string;
    emoji: string;
    color: string;
    imageKey: keyof typeof STATION_IMAGES;
    workouts: StationWorkout[];
}

export const HYROX_STATIONS: HyroxStation[] = [
    {
        id: 's1',
        name: 'SkiErg',
        emoji: '🎿',
        color: '#3B82F6',
        imageKey: 'skierg',
        workouts: [
            { id: 's1w1', title: 'SkiErg Intervals', duration: '20 min', difficulty: 'Beginner', description: '5x 500m with 1 min rest', reps: '5 rounds' },
            { id: 's1w2', title: 'Race Pace Simulation', duration: '30 min', difficulty: 'Intermediate', description: '1000m at race pace, 2x', reps: '2 rounds' },
            { id: 's1w3', title: 'Endurance Builder', duration: '45 min', difficulty: 'Advanced', description: '3x 1000m + 1 mile run between', reps: '3 rounds' },
            { id: 's1w4', title: 'Sprint Ladder', duration: '25 min', difficulty: 'Elite', description: '100-200-300-400-500m with decreasing rest', reps: 'Ladder' },
        ],
    },
    {
        id: 's2',
        name: 'Sled Push',
        emoji: '🛷',
        color: '#EF4444',
        imageKey: 'sled_push',
        workouts: [
            { id: 's2w1', title: 'Heavy Singles', duration: '15 min', difficulty: 'Beginner', description: '4x 25m heavy push with full recovery', reps: '4 rounds' },
            { id: 's2w2', title: 'Race Weight Practice', duration: '20 min', difficulty: 'Intermediate', description: '6x 50m at race weight', reps: '6 rounds' },
            { id: 's2w3', title: 'Sled + Run Combo', duration: '30 min', difficulty: 'Advanced', description: '50m push + 400m run, 5 rounds', reps: '5 rounds' },
            { id: 's2w4', title: 'Competition Simulation', duration: '25 min', difficulty: 'Elite', description: '50m all-out, minimal rest, repeat 4x', reps: '4 rounds' },
        ],
    },
    {
        id: 's3',
        name: 'Sled Pull',
        emoji: '⛓️',
        color: '#F97316',
        imageKey: 'sled_pull',
        workouts: [
            { id: 's3w1', title: 'Arm Over Arm Basics', duration: '15 min', difficulty: 'Beginner', description: 'Focus on technique, 4x 25m', reps: '4 rounds' },
            { id: 's3w2', title: 'Speed Pulls', duration: '20 min', difficulty: 'Intermediate', description: '8x 50m for time', reps: '8 rounds' },
            { id: 's3w3', title: 'Push-Pull Superset', duration: '35 min', difficulty: 'Advanced', description: 'Alternate 50m push + 50m pull', reps: '6 rounds' },
            { id: 's3w4', title: 'Race Day Prep', duration: '25 min', difficulty: 'Elite', description: 'Full 50m at competition speed, 4x', reps: '4 rounds' },
        ],
    },
    {
        id: 's4',
        name: 'Burpee Broad Jump',
        emoji: '🦘',
        color: '#8B5CF6',
        imageKey: 'burpee',
        workouts: [
            { id: 's4w1', title: 'Technique Focus', duration: '15 min', difficulty: 'Beginner', description: '5x 10 reps, focus on form', reps: '50 total' },
            { id: 's4w2', title: 'Distance Challenge', duration: '20 min', difficulty: 'Intermediate', description: '4x 20m for distance', reps: '4 rounds' },
            { id: 's4w3', title: 'EMOM Burpees', duration: '20 min', difficulty: 'Advanced', description: 'EMOM 20: 8 burpee broad jumps', reps: '160 total' },
            { id: 's4w4', title: '80m Race Simulation', duration: '25 min', difficulty: 'Elite', description: '80m unbroken x3 with 3 min rest', reps: '3 rounds' },
        ],
    },
    {
        id: 's5',
        name: 'Rowing',
        emoji: '🚣',
        color: '#06B6D4',
        imageKey: 'rowing',
        workouts: [
            { id: 's5w1', title: 'Steady State Row', duration: '30 min', difficulty: 'Beginner', description: '3x 1000m at conversational pace', reps: '3 rounds' },
            { id: 's5w2', title: 'Interval Sprints', duration: '25 min', difficulty: 'Intermediate', description: '8x 250m with 45s rest', reps: '8 rounds' },
            { id: 's5w3', title: 'Race Pace Repeats', duration: '35 min', difficulty: 'Advanced', description: '4x 1000m at race pace', reps: '4 rounds' },
            { id: 's5w4', title: 'Negative Split Challenge', duration: '20 min', difficulty: 'Elite', description: '2000m with each 500m faster', reps: '1 round' },
        ],
    },
    {
        id: 's6',
        name: 'Farmers Carry',
        emoji: '🏋️',
        color: '#10B981',
        imageKey: 'farmers_carry',
        workouts: [
            { id: 's6w1', title: 'Grip Endurance', duration: '15 min', difficulty: 'Beginner', description: '4x 50m with moderate weight', reps: '4 rounds' },
            { id: 's6w2', title: 'Heavy Carries', duration: '20 min', difficulty: 'Intermediate', description: '6x 50m with competition weight', reps: '6 rounds' },
            { id: 's6w3', title: 'Carry + Lunges', duration: '30 min', difficulty: 'Advanced', description: '50m carry + 20 walking lunges, 5x', reps: '5 rounds' },
            { id: 's6w4', title: '200m Race Simulation', duration: '25 min', difficulty: 'Elite', description: '200m unbroken x3 with 2 min rest', reps: '3 rounds' },
        ],
    },
    {
        id: 's7',
        name: 'Sandbag Lunges',
        emoji: '🦵',
        color: '#EC4899',
        imageKey: 'lunges',
        workouts: [
            { id: 's7w1', title: 'Lunge Technique', duration: '15 min', difficulty: 'Beginner', description: '4x 25m focus on depth', reps: '4 rounds' },
            { id: 's7w2', title: 'Weighted Progression', duration: '25 min', difficulty: 'Intermediate', description: '50m light, 50m medium, 50m heavy', reps: '3 rounds' },
            { id: 's7w3', title: 'Lunge + Run', duration: '35 min', difficulty: 'Advanced', description: '50m lunges + 200m run, 6x', reps: '6 rounds' },
            { id: 's7w4', title: '100m Unbroken', duration: '20 min', difficulty: 'Elite', description: '100m at race weight, no stops, 3x', reps: '3 rounds' },
        ],
    },
    {
        id: 's8',
        name: 'Wall Balls',
        emoji: '🏐',
        color: '#F59E0B',
        imageKey: 'wallballs',
        workouts: [
            { id: 's8w1', title: 'Wall Ball Basics', duration: '15 min', difficulty: 'Beginner', description: '5x 20 reps with 1 min rest', reps: '100 total' },
            { id: 's8w2', title: 'EMOM Wall Balls', duration: '20 min', difficulty: 'Intermediate', description: 'EMOM 20: 15 wall balls', reps: '300 total' },
            { id: 's8w3', title: 'Chipper Challenge', duration: '25 min', difficulty: 'Advanced', description: '75 wall balls for time, rest, repeat', reps: '150 total' },
            { id: 's8w4', title: 'Race Simulation', duration: '20 min', difficulty: 'Elite', description: '100 unbroken wall balls, 2x', reps: '200 total' },
        ],
    },
];

// Meal Images - require() for local assets
export const MEAL_IMAGES = {
    oatmeal: require('../assets/meals/oatmeal.png'),
    smoothie: require('../assets/meals/smoothie.png'),
    breakfast: require('../assets/meals/breakfast.png'),
    salmon: require('../assets/meals/salmon.png'),
    chicken: require('../assets/meals/chicken.png'),
    pancakes: require('../assets/meals/pancakes.png'),
    pasta: require('../assets/meals/pasta.png'),
    yogurt: require('../assets/meals/oatmeal.png'), // Using oatmeal as placeholder for now
};

export interface MealPlan {
    id: string;
    title: string;
    timing: 'Pre-Workout' | 'Post-Workout' | 'Race Day' | 'Recovery';
    calories: number;
    protein: number;
    carbs: number;
    ingredients: string[];
    emoji: string;
    imageKey: keyof typeof MEAL_IMAGES;
}

export const MEAL_PLANS: MealPlan[] = [
    {
        id: 'm1',
        title: 'Power Oatmeal',
        timing: 'Pre-Workout',
        calories: 450,
        protein: 20,
        carbs: 65,
        ingredients: ['1 cup Oats', '1 Banana', '2 tbsp Peanut Butter', '1 tbsp Honey', '1 scoop Whey Protein'],
        emoji: '🥣',
        imageKey: 'oatmeal',
    },
    {
        id: 'm2',
        title: 'Recovery Smoothie',
        timing: 'Post-Workout',
        calories: 380,
        protein: 35,
        carbs: 45,
        ingredients: ['1 cup Frozen Berries', '1 cup Greek Yogurt', '1 cup Spinach', '1 scoop Protein Powder', '1 cup Almond Milk'],
        emoji: '🥤',
        imageKey: 'smoothie',
    },
    {
        id: 'm3',
        title: 'Race Day Breakfast',
        timing: 'Race Day',
        calories: 600,
        protein: 25,
        carbs: 90,
        ingredients: ['1 Bagel', '2 tbsp Cream Cheese', '3 Eggs', '1 cup Orange Juice', '1 Banana'],
        emoji: '🏁',
        imageKey: 'breakfast',
    },
    {
        id: 'm4',
        title: 'Salmon Power Bowl',
        timing: 'Recovery',
        calories: 550,
        protein: 40,
        carbs: 50,
        ingredients: ['6 oz Salmon Fillet', '1 cup Brown Rice', '1/2 Avocado', '1/2 cup Edamame', '2 tbsp Soy Sauce'],
        emoji: '🍣',
        imageKey: 'salmon',
    },
    {
        id: 'm5',
        title: 'Chicken & Rice',
        timing: 'Pre-Workout',
        calories: 520,
        protein: 45,
        carbs: 55,
        ingredients: ['8 oz Chicken Breast', '1 cup White Rice', '1 cup Broccoli', '1 tbsp Olive Oil', '2 cloves Garlic'],
        emoji: '🍗',
        imageKey: 'chicken',
    },
    {
        id: 'm6',
        title: 'Protein Pancakes',
        timing: 'Post-Workout',
        calories: 480,
        protein: 35,
        carbs: 60,
        ingredients: ['1 scoop Protein Powder', '1/2 cup Oat Flour', '2 Eggs', '1 Banana', '2 tbsp Maple Syrup'],
        emoji: '🥞',
        imageKey: 'pancakes',
    },
    {
        id: 'm7',
        title: 'Pasta Fuel',
        timing: 'Race Day',
        calories: 650,
        protein: 25,
        carbs: 100,
        ingredients: ['3 oz Pasta', '1/2 cup Marinara Sauce', '4 oz Ground Turkey', '2 tbsp Parmesan', '1 tbsp Fresh Basil'],
        emoji: '🍝',
        imageKey: 'pasta',
    },
    {
        id: 'm8',
        title: 'Greek Yogurt Bowl',
        timing: 'Recovery',
        calories: 350,
        protein: 30,
        carbs: 40,
        ingredients: ['1.5 cups Greek Yogurt', '1 tbsp Honey', '1/4 cup Granola', '1/2 cup Mixed Berries', '2 tbsp Almonds'],
        emoji: '🥛',
        imageKey: 'yogurt',
    },
];
