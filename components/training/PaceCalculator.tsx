import React, { useState } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedView } from '../common/ThemedView';
import { ThemedText } from '../common/ThemedText';
import { Button } from '../common/Button';
import { calculatePacing, formatTime, Segment } from '../../lib/utils';
import { Colors } from '../../constants/Colors';

const CATEGORIES = [
    "Men's Open", "Women's Open",
    "Men's Pro", "Women's Pro",
    "Doubles Men", "Doubles Women", "Doubles Mixed",
    "Relay"
];

export default function PaceCalculator() {
    const [targetTime, setTargetTime] = useState('');
    const [segments, setSegments] = useState<Segment[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("Men's Open");

    const handleCalculate = () => {
        const time = parseFloat(targetTime);
        if (!isNaN(time) && time > 0) {
            const results = calculatePacing(time);
            setSegments(results);
        }
    };

    return (
        <ThemedView className="p-4 rounded-xl bg-surface mb-4 w-full">
            <ThemedText className="text-xl font-bold mb-4 text-primary">RACE PACING STRATEGY</ThemedText>

            {/* Category Selection */}
            <View className="mb-6">
                <ThemedText className="mb-2 text-textDim">Select Category</ThemedText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2 pb-2">
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            onPress={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full border ${selectedCategory === cat ? 'bg-primary border-primary' : 'bg-transparent border-gray-700'}`}
                        >
                            <ThemedText className={`font-bold ${selectedCategory === cat ? 'text-background' : 'text-textDim'}`}>
                                {cat}
                            </ThemedText>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View className="mb-4">
                <ThemedText className="mb-2 text-textDim">Target Time (minutes)</ThemedText>
                <TextInput
                    className="bg-background text-text p-4 rounded-lg border border-gray-700 font-bold text-lg"
                    placeholder="e.g. 70"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                    value={targetTime}
                    onChangeText={setTargetTime}
                />
            </View>

            <Button title="Generate Pacing" onPress={handleCalculate} className="mb-6" />

            {segments.length > 0 && (
                <View className="mb-4">
                    <ThemedText className="font-bold text-lg mb-2 text-white">SEGMENT BREAKDOWN ({selectedCategory})</ThemedText>
                    {segments.map((seg) => (
                        <View key={seg.id} className="flex-row justify-between items-center py-2 border-b border-gray-800">
                            <View className="flex-1">
                                <ThemedText className={seg.type === 'run' ? 'text-primary font-bold' : 'text-text'}>
                                    {seg.name}
                                </ThemedText>
                            </View>
                            <ThemedText className="font-mono text-lg">{formatTime(seg.time)}</ThemedText>
                        </View>
                    ))}
                </View>
            )}
        </ThemedView>
    );
}
