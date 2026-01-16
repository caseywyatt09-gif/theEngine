import { ImageSourcePropType } from 'react-native';

export interface Workout {
    id: number;
    title: string;
    description: string;
    intensity: 'High' | 'Medium' | 'Low';
    duration: string;
}

export interface StationData {
    id: number;
    name: string;
    description: string; // The short tagline e.g. "Technique & Rhythm"
    image: any;
    workouts: Workout[];
}

export const STATION_DATA: StationData[] = [
    {
        id: 1,
        name: "SkiErg Mastery",
        description: "Technique & Rhythm",
        image: require('../../assets/images/station_clear_skierg.png'),
        workouts: [
            { id: 1, title: "Sprint Intervals", description: "30s max effort, 30s rest. Repeat 10x.", intensity: "High", duration: "10 mins" },
            { id: 2, title: "Endurance Pull", description: "Steady state 5000m at race pace + 5s.", intensity: "Medium", duration: "25 mins" },
            { id: 3, title: "Power Strokes", description: "10 pulls max watts, 50s recovery paddle. 8 rounds.", intensity: "High", duration: "8 mins" },
            { id: 4, title: "Pyramid", description: "100m, 200m, 300m, 400m, 300m, 200m, 100m. 1:1 rest.", intensity: "High", duration: "15 mins" }
        ]
    },
    {
        id: 2,
        name: "Sled Push",
        description: "Drive Power",
        image: require('../../assets/images/station_clear_sled_push.png'),
        workouts: [
            { id: 1, title: "Heavy Singles", description: "Push 150kg for 15m. Rest 90s. 5 rounds.", intensity: "High", duration: "10 mins" },
            { id: 2, title: "Speed Drills", description: "Light weight (75kg). Sprint 20m. Walk back. 10 rounds.", intensity: "Medium", duration: "12 mins" },
            { id: 3, title: "Volume Loading", description: "Push 100kg for 400m total distance in segments.", intensity: "Medium", duration: "20 mins" },
            { id: 4, title: "Comp Sim", description: "Push 125kg for 50m unbroken. Rest 2 min. 3 rounds.", intensity: "High", duration: "10 mins" }
        ]
    },
    {
        id: 3,
        name: "Sled Pull",
        description: "Back & Grip",
        image: require('../../assets/images/station_clear_sled_pull.png'),
        workouts: [
            { id: 1, title: "Grip Failure", description: "Heavy pull 100kg, 10m. Hold rope for 30s. 4 rounds.", intensity: "High", duration: "12 mins" },
            { id: 2, title: "Technique Flow", description: "Continuous movement practice. 50kg for 10 mins non-stop.", intensity: "Low", duration: "10 mins" },
            { id: 3, title: "Intervals", description: "Pull 15m fast, jog back. 8 rounds.", intensity: "Medium", duration: "15 mins" },
            { id: 4, title: "Race Weight", description: "75kg pull for 50m. Time trial.", intensity: "High", duration: "5 mins" }
        ]
    },
    {
        id: 4,
        name: "Burpee Broad",
        description: "Explosive Hips",
        image: require('../../assets/images/station_clear_burpee.png'),
        workouts: [
            { id: 1, title: "EMOM 10", description: "10 Burpee Broad Jumps every minute on the minute.", intensity: "High", duration: "10 mins" },
            { id: 2, title: "Ladder Down", description: "20-18-16...2 reps. Rest as needed.", intensity: "Medium", duration: "15 mins" },
            { id: 3, title: "Broad Jump Focus", description: "3 jumps max distance. Reset. 10 rounds.", intensity: "Low", duration: "15 mins" },
            { id: 4, title: "Density", description: "Max reps in 5 mins. Pace yourself.", intensity: "High", duration: "5 mins" }
        ]
    },
    {
        id: 5,
        name: "Rowing",
        description: "Pacing Strategy",
        image: require('../../assets/images/station_clear_rowing.png'),
        workouts: [
            { id: 1, title: "500m Repeats", description: "Row 500m @ 2k pace. Rest 1:1. 6 rounds.", intensity: "High", duration: "25 mins" },
            { id: 2, title: "Stroke Rate Ladder", description: "4 mins @ 18spm, 3 @ 20, 2 @ 22, 1 @ 24.", intensity: "Medium", duration: "10 mins" },
            { id: 3, title: "Power 10s", description: "10 hard strokes every minute for 20 mins.", intensity: "Medium", duration: "20 mins" },
            { id: 4, title: "Race Sim", description: "1000m @ Hyrox pace. Rest 3 mins. x3.", intensity: "High", duration: "20 mins" }
        ]
    },
    {
        id: 6,
        name: "Farmers Carry",
        description: "Grip Endurance",
        image: require('../../assets/images/station_action_farmers_carry.png'),
        workouts: [
            { id: 1, title: "Heavy Hold", description: "Hold 32kg KBs for max time. 4 sets.", intensity: "Medium", duration: "10 mins" },
            { id: 2, title: "Track Walk", description: "Walk 400m with 24kg KBs. Drop = 10 pushups.", intensity: "Medium", duration: "15 mins" },
            { id: 3, title: "Speed Carries", description: "24kg KBs. 50m sprint walk. 8 rounds.", intensity: "High", duration: "12 mins" },
            { id: 4, title: "Grip Switch", description: "Carry 100m, hang from pullup bar 30s. 3 rounds.", intensity: "Medium", duration: "12 mins" }
        ]
    },
    {
        id: 7,
        name: "Sandbag Lunges",
        description: "Leg Stamina",
        image: require('../../assets/images/station_action_lunges.png'),
        workouts: [
            { id: 1, title: "Track Intervals", description: "Lunge 50m, Run 200m. 4 rounds.", intensity: "High", duration: "15 mins" },
            { id: 2, title: "Heavy Bag", description: "30kg bag. Lunge 20m. Rest 1 min. 6 rounds.", intensity: "High", duration: "15 mins" },
            { id: 3, title: "Volume Legs", description: "200m walking lunge (bodyweight) for time.", intensity: "Medium", duration: "10-15 mins" },
            { id: 4, title: "Sandbag Squats", description: "10 squats every 10m of lunging. 100m total.", intensity: "High", duration: "12 mins" }
        ]
    },
    {
        id: 8,
        name: "Wall Balls",
        description: "Cycle Speed",
        image: require('../../assets/images/station_action_wallballs.png'),
        workouts: [
            { id: 1, title: "Karen (Hyrox Style)", description: "150 reps for time. Break strategic.", intensity: "High", duration: "5-10 mins" },
            { id: 2, title: "EMOM 12", description: "15 reps every minute.", intensity: "High", duration: "12 mins" },
            { id: 3, title: "Unbroken Practice", description: "Max unbroken set. Rest 3 min. 3 attempts.", intensity: "Medium", duration: "15 mins" },
            { id: 4, title: "Squat Depth", description: "Slow tempo wall balls. 3s down, explode up. 5x10.", intensity: "Low", duration: "10 mins" }
        ]
    },
];
