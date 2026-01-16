import { AppMode } from '../store/useAppStore';

interface CoachResponse {
    keywords: string[];
    response: string;
}

const RACE_RESPONSES: CoachResponse[] = [
    {
        keywords: ['run', 'faster', 'speed', 'pace'],
        response: "To improve your speed, focus on interval training. Try 4x800m repeats at your goal 5K pace with 2 minutes rest. Consistency is key, athlete. ⚡️",
    },
    {
        keywords: ['hyrox', 'stations', 'plan', 'workout'],
        response: "Hyrox Protocol Loaded:\n1. 1km Run\n2. 1000m SkiErg\n3. 1km Run\n4. 50m Sled Push\n5. 1km Run\n6. 50m Sled Pull\n7. 1km Run\n8. 80m Burpee Broad Jumps\n9. 1km Run\n10. 1000m Row\n11. 1km Run\n12. 200m Farmers Carry\n13. 1km Run\n14. 100m Sandbag Lunges\n15. 1km Run\n16. 75/100 Wall Balls\n\nStay hard.",
    },
    {
        keywords: ['sled', 'push', 'pull'],
        response: "For the Sleds: Keep your hips low and drive with your legs. Do not stop. Momentum is your friend.",
    },
    {
        keywords: ['wall', 'ball'],
        response: "Wall Balls are mental. Break them into sets of 15 or 20. Do not go to failure properly or you won't clear the line. Breathe.",
    },
    {
        keywords: ['injury', 'pain', 'hurt', 'knee'],
        response: "Listen to your body. If you're feeling sharp pain, stop immediately. RICE (Rest, Ice, Compression, Elevation) and consider cross-training with swimming or cycling to maintain fitness.",
    },
    {
        keywords: ['race', 'ready', 'plan'],
        response: "We're 4 weeks out. Focus on volume maintenance but start sharpening your intensity. Have you visualized the course profile yet?",
    },
    {
        keywords: ['fuel', 'eat', 'nutrition'],
        response: "Carb load 2 days before the big race, not just the night before. And don't try anything new on race day! Stick to what your stomach knows.",
    }
];

const FUN_RESPONSES: CoachResponse[] = [
    {
        keywords: ['date', 'meet', 'people', 'love'],
        response: "Looking to connect? The Saturday morning coffee run is the best spot. Low pressure, high caffeine. ☕️",
    },
    {
        keywords: ['vibe', 'fun', 'party'],
        response: "The Engine House is hosting a post-run mixer this Friday. DJ, drinks, and recovery boots. You should definitely be there!",
    },
    {
        keywords: ['sarah', 'talk', 'conversation'],
        response: "Just be yourself! Ask about their next race or favorite trail. Athletes love talking shop. 🏃‍♀️💨",
    },
    {
        keywords: ['tired', 'motivation', 'lazy'],
        response: "It's okay to take a rest day! Life isn't just about PRs. Go for a walk, grab a donut, and reset. The road will be there tomorrow. 🍩",
    }
];

const DEFAULT_RACE_RESPONSE = "I'm analyzing your training metrics... focus on your next Hyrox station. How's your Sled Push form looking?";
const DEFAULT_FUN_RESPONSE = "Systems functional. Social battery charging. 🔋 Need a run club recommendation?";

export function getCoachResponse(message: string, mode: AppMode): string {
    const responses = mode === 'race' ? RACE_RESPONSES : FUN_RESPONSES;
    const lowerMsg = message.toLowerCase();

    const match = responses.find(r => r.keywords.some(k => lowerMsg.includes(k)));

    if (match) return match.response;
    return mode === 'race' ? DEFAULT_RACE_RESPONSE : DEFAULT_FUN_RESPONSE;
}
