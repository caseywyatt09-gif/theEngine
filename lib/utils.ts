export function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export interface Segment {
    id: number;
    name: string;
    type: 'run' | 'station';
    time: number; // in seconds
}

export function calculatePacing(targetTimeMinutes: number): Segment[] {
    const totalSeconds = targetTimeMinutes * 60;

    // 50% for runs, 50% for stations
    const totalRunTime = totalSeconds * 0.5;
    const totalStationTime = totalSeconds * 0.5;

    const numSegments = 8;
    const decayRate = 0.05; // 5%

    // Calculate Base Run Time
    // Sum of geometric series: S = a * (1 - r^n) / (1 - r)
    // totalRunTime = base * (1 - (1.05)^8) / (1 - 1.05)
    // base = totalRunTime * (1 - 1.05) / (1 - (1.05)^8)

    const r = 1 + decayRate;
    const baseRunTime = totalRunTime * (1 - r) / (1 - Math.pow(r, numSegments));

    // Stations are assumed constant for MVP (or could apply similar logic, but manifesto says "runs")
    const avgStationTime = totalStationTime / numSegments;

    const segments: Segment[] = [];

    const runNames = ["1km Run 1", "1km Run 2", "1km Run 3", "1km Run 4", "1km Run 5", "1km Run 6", "1km Run 7", "1km Run 8"];
    const stationNames = [
        "1000m SkiErg", "50m Sled Push", "50m Sled Pull", "80m Burpee Broad Jumps",
        "1000m Row", "200m Farmers Carry", "100m Sandbag Lunges", "100 Wall Balls"
    ];

    for (let i = 0; i < numSegments; i++) {
        const runTime = baseRunTime * Math.pow(r, i);
        segments.push({
            id: i * 2,
            name: runNames[i],
            type: 'run',
            time: runTime
        });

        segments.push({
            id: i * 2 + 1,
            name: stationNames[i],
            type: 'station',
            time: avgStationTime
        });
    }

    return segments;
}
