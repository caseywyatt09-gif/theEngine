import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, FlatList, Alert, Modal, Image } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/useAppStore';
import { Colors } from '../../constants/Colors';
import { ChatMessage } from '../../components/ai/ChatMessage';
import { getCoachResponse } from '../../data/mockCoachResponses';
import { HYROX_STATIONS, MEAL_PLANS, HyroxStation, MealPlan, StationWorkout, STATION_IMAGES, MEAL_IMAGES } from '../../data/mockHyrox';

type WarRoomTab = 'coach' | 'workouts' | 'nutrition';

interface ShoppingItem {
    name: string;
    checked: boolean;
}

export default function WarRoomScreen() {
    const { mode } = useAppStore();
    const [activeTab, setActiveTab] = useState<WarRoomTab>('coach');
    const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
    const [showShoppingModal, setShowShoppingModal] = useState(false);
    const [selectedStation, setSelectedStation] = useState<HyroxStation | null>(null);
    const [selectedMeal, setSelectedMeal] = useState<MealPlan | null>(null);

    // Coach state
    const [messages, setMessages] = useState<any[]>([
        {
            id: '1',
            text: mode === 'race'
                ? "Systems online. Monitoring performance metrics. How can I assist your training today?"
                : "Vibe check... passed. ✨ How's your heart rate? Or just your heart?",
            sender: 'ai',
            timestamp: new Date(),
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        setMessages([{
            id: Date.now().toString(),
            text: mode === 'race'
                ? "Systems online. Monitoring performance metrics. How can I assist your training today?"
                : "Vibe check... passed. ✨ How's your heart rate? Or just your heart?",
            sender: 'ai',
            timestamp: new Date(),
        }]);
    }, [mode]);

    const handleSend = () => {
        if (!input.trim()) return;
        const userMsg = { id: Date.now().toString(), text: input.trim(), sender: 'user', timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);
        setTimeout(() => {
            const responseText = getCoachResponse(userMsg.text, mode);
            const aiMsg = { id: (Date.now() + 1).toString(), text: responseText, sender: 'ai', timestamp: new Date() };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const addToShoppingList = (ingredients: string[]) => {
        const newItems = ingredients.filter(i => !shoppingList.some(s => s.name === i));
        if (newItems.length > 0) {
            setShoppingList(prev => [...prev, ...newItems.map(name => ({ name, checked: false }))]);
            Alert.alert('Added!', `${newItems.length} items added to shopping list`);
        } else {
            Alert.alert('Already Added', 'These items are already in your list.');
        }
    };

    const toggleShoppingItem = (name: string) => {
        setShoppingList(prev => prev.map(item =>
            item.name === name ? { ...item, checked: !item.checked } : item
        ));
    };

    const clearCheckedItems = () => {
        setShoppingList(prev => prev.filter(item => !item.checked));
    };

    const renderCoachTab = () => (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <ChatMessage message={item} />}
                contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            />
            {isTyping && (
                <View className="px-6 pb-2">
                    <Text className="text-textDim text-xs italic">{mode === 'race' ? 'Analyzing...' : 'Thinking...'}</Text>
                </View>
            )}
            <View className="p-4 bg-surface border-t border-gray-800">
                <View className="flex-row items-center gap-2">
                    <View className="flex-1 h-12 bg-black/50 rounded-full border border-gray-700 px-4 justify-center">
                        <TextInput
                            placeholder={mode === 'race' ? "Ask about training..." : "Ask for advice..."}
                            placeholderTextColor="#666"
                            className="text-white h-full"
                            value={input}
                            onChangeText={setInput}
                            onSubmitEditing={handleSend}
                            returnKeyType="send"
                            style={Platform.OS === 'web' ? { outline: 'none' } as any : {}}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={handleSend}
                        className={`w-12 h-12 rounded-full items-center justify-center ${mode === 'race' ? 'bg-race' : 'bg-fun'}`}
                        disabled={!input.trim()}
                        style={{ opacity: input.trim() ? 1 : 0.5 }}
                    >
                        <Ionicons name="arrow-up" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );

    const renderWorkoutsTab = () => (
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
            {selectedStation ? (
                // Station Detail View
                <View>
                    <TouchableOpacity onPress={() => setSelectedStation(null)} className="flex-row items-center mb-4">
                        <Ionicons name="chevron-back" size={24} color="white" />
                        <Text className="text-white font-bold text-lg ml-1">Back to Stations</Text>
                    </TouchableOpacity>

                    <View className="flex-row items-center gap-3 mb-4">
                        <Text className="text-4xl">{selectedStation.emoji}</Text>
                        <Text className="text-white font-bold text-2xl">{selectedStation.name}</Text>
                    </View>

                    {selectedStation.workouts.map((workout: StationWorkout) => (
                        <TouchableOpacity
                            key={workout.id}
                            className="bg-surface rounded-2xl p-4 mb-3 border border-gray-800"
                            onPress={() => Alert.alert('Start Workout', `Starting ${workout.title}!`)}
                        >
                            <View className="flex-row justify-between items-start mb-2">
                                <View className="flex-1">
                                    <Text className="text-white font-bold text-lg">{workout.title}</Text>
                                    <Text className="text-textDim text-xs">{workout.duration} • {workout.difficulty}</Text>
                                </View>
                                <TouchableOpacity className="bg-race/20 px-3 py-1.5 rounded-full">
                                    <Text className="text-race text-xs font-medium">Start</Text>
                                </TouchableOpacity>
                            </View>
                            <Text className="text-gray-400 text-sm">{workout.description}</Text>
                            {workout.reps && <Text className="text-secondary text-xs mt-2">{workout.reps}</Text>}
                        </TouchableOpacity>
                    ))}
                </View>
            ) : (
                // Stations Grid
                <View>
                    <Text className="text-white font-bold text-xl mb-4">Hyrox Stations</Text>
                    <View className="flex-row flex-wrap">
                        {HYROX_STATIONS.map((station: HyroxStation) => (
                            <TouchableOpacity
                                key={station.id}
                                onPress={() => setSelectedStation(station)}
                                className="w-1/2 p-1"
                            >
                                <View className="rounded-xl overflow-hidden" style={{ borderColor: station.color, borderWidth: 1.5 }}>
                                    <Image
                                        source={STATION_IMAGES[station.imageKey]}
                                        style={{ width: '100%', height: 60 }}
                                        resizeMode="cover"
                                    />
                                    <View className="bg-surface p-2">
                                        <View className="flex-row items-center gap-1.5">
                                            <Text className="text-base">{station.emoji}</Text>
                                            <Text className="text-white font-bold text-xs">{station.name}</Text>
                                        </View>
                                        <Text className="text-textDim text-[10px]">{station.workouts.length} workouts</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}
        </ScrollView>
    );

    const renderNutritionTab = () => (
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
            {/* Shopping List Button */}
            {shoppingList.length > 0 && (
                <TouchableOpacity
                    className="bg-fun/20 rounded-2xl p-4 mb-4 border border-fun/30"
                    onPress={() => setShowShoppingModal(true)}
                >
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2">
                            <Ionicons name="cart" size={20} color={Colors.fun} />
                            <Text className="text-fun font-bold">Shopping List ({shoppingList.length})</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.fun} />
                    </View>
                </TouchableOpacity>
            )}

            {selectedMeal ? (
                // Meal Detail View
                <View>
                    <TouchableOpacity onPress={() => setSelectedMeal(null)} className="flex-row items-center mb-4">
                        <Ionicons name="chevron-back" size={24} color="white" />
                        <Text className="text-white font-bold text-lg ml-1">Back to Meals</Text>
                    </TouchableOpacity>

                    <Image source={MEAL_IMAGES[selectedMeal.imageKey]} className="w-full h-48 rounded-2xl mb-4" resizeMode="cover" />

                    <View className="flex-row items-center gap-3 mb-2">
                        <Text className="text-3xl">{selectedMeal.emoji}</Text>
                        <View>
                            <Text className="text-white font-bold text-2xl">{selectedMeal.title}</Text>
                            <Text className="text-secondary text-sm">{selectedMeal.timing}</Text>
                        </View>
                    </View>

                    <View className="flex-row gap-4 my-4">
                        <View className="flex-1 bg-surface rounded-xl p-3 border border-gray-800">
                            <Text className="text-textDim text-xs">CALORIES</Text>
                            <Text className="text-white font-bold text-lg">{selectedMeal.calories}</Text>
                        </View>
                        <View className="flex-1 bg-surface rounded-xl p-3 border border-gray-800">
                            <Text className="text-textDim text-xs">PROTEIN</Text>
                            <Text className="text-white font-bold text-lg">{selectedMeal.protein}g</Text>
                        </View>
                        <View className="flex-1 bg-surface rounded-xl p-3 border border-gray-800">
                            <Text className="text-textDim text-xs">CARBS</Text>
                            <Text className="text-white font-bold text-lg">{selectedMeal.carbs}g</Text>
                        </View>
                    </View>

                    <Text className="text-white font-bold mb-2">Ingredients</Text>
                    {selectedMeal.ingredients.map((ing, idx) => (
                        <View key={idx} className="flex-row items-center gap-2 py-2 border-b border-gray-800">
                            <Ionicons name="checkmark-circle-outline" size={20} color={Colors.fun} />
                            <Text className="text-white">{ing}</Text>
                        </View>
                    ))}

                    <TouchableOpacity
                        onPress={() => addToShoppingList(selectedMeal.ingredients)}
                        className="bg-fun/20 py-3 rounded-xl flex-row items-center justify-center gap-2 mt-4"
                    >
                        <Ionicons name="cart-outline" size={20} color={Colors.fun} />
                        <Text className="text-fun font-bold">Add All to Shopping List</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                // Meals Grid
                <View>
                    <Text className="text-white font-bold text-xl mb-4">Meal Plans</Text>
                    <View className="flex-row flex-wrap">
                        {MEAL_PLANS.map((meal: MealPlan) => (
                            <TouchableOpacity
                                key={meal.id}
                                onPress={() => setSelectedMeal(meal)}
                                className="w-1/2 p-1"
                            >
                                <View className="rounded-xl overflow-hidden bg-surface border border-gray-800">
                                    <Image source={MEAL_IMAGES[meal.imageKey]} style={{ width: '100%', height: 60 }} resizeMode="cover" />
                                    <View className="p-2">
                                        <View className="flex-row items-center gap-1.5">
                                            <Text className="text-base">{meal.emoji}</Text>
                                            <Text className="text-white font-bold text-xs" numberOfLines={1}>{meal.title}</Text>
                                        </View>
                                        <Text className="text-textDim text-[10px]">{meal.timing} • {meal.calories} cal</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}
        </ScrollView>
    );

    return (
        <View className="flex-1 bg-background pt-14">
            {/* Header */}
            <View className="px-6 pb-4 border-b border-gray-900 flex-row justify-between items-center">
                <View>
                    <Text className="text-2xl font-bold text-white tracking-tighter">WAR ROOM</Text>
                    <View className="flex-row items-center gap-2 mt-1">
                        <View className={`w-2 h-2 rounded-full ${mode === 'race' ? 'bg-race' : 'bg-fun'}`} />
                        <Text className="text-textDim text-xs uppercase tracking-widest">
                            {mode === 'race' ? 'Performance Mode' : 'Social Mode'}
                        </Text>
                    </View>
                </View>
                <View className="flex-row gap-3">
                    <TouchableOpacity onPress={() => Alert.alert('AI Referee', 'Camera rep counter coming soon!')}>
                        <Ionicons name="eye-outline" size={28} color={Colors.textDim} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="ellipsis-horizontal-circle" size={32} color={Colors.textDim} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Tab Bar */}
            <View className="flex-row bg-surface border-b border-gray-800">
                {[
                    { key: 'coach', label: 'Coach', icon: 'chatbubble-ellipses' },
                    { key: 'workouts', label: 'Workouts', icon: 'fitness' },
                    { key: 'nutrition', label: 'Nutrition', icon: 'restaurant' },
                ].map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        onPress={() => setActiveTab(tab.key as WarRoomTab)}
                        className={`flex-1 py-3 items-center border-b-2 ${activeTab === tab.key ? (mode === 'race' ? 'border-race' : 'border-fun') : 'border-transparent'
                            }`}
                    >
                        <Ionicons
                            name={tab.icon as any}
                            size={20}
                            color={activeTab === tab.key ? (mode === 'race' ? Colors.race : Colors.fun) : Colors.textDim}
                        />
                        <Text className={`text-xs mt-1 ${activeTab === tab.key ? 'text-white font-medium' : 'text-textDim'}`}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Tab Content */}
            {activeTab === 'coach' && renderCoachTab()}
            {activeTab === 'workouts' && renderWorkoutsTab()}
            {activeTab === 'nutrition' && renderNutritionTab()}

            {/* Shopping List Modal */}
            <Modal visible={showShoppingModal} animationType="slide" presentationStyle="pageSheet">
                <View className="flex-1 bg-background pt-6">
                    <View className="flex-row justify-between items-center px-6 pb-4 border-b border-gray-800">
                        <Text className="text-white font-bold text-xl">Shopping List</Text>
                        <TouchableOpacity onPress={() => setShowShoppingModal(false)}>
                            <Ionicons name="close" size={28} color="white" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="flex-1 px-6 pt-4">
                        {shoppingList.map((item, idx) => (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => toggleShoppingItem(item.name)}
                                className="flex-row items-center gap-3 py-3 border-b border-gray-800"
                            >
                                <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${item.checked ? 'bg-fun border-fun' : 'border-gray-600'
                                    }`}>
                                    {item.checked && <Ionicons name="checkmark" size={16} color="white" />}
                                </View>
                                <Text className={`text-lg ${item.checked ? 'text-textDim line-through' : 'text-white'}`}>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View className="p-6 border-t border-gray-800">
                        <TouchableOpacity
                            onPress={clearCheckedItems}
                            className="bg-race/20 py-3 rounded-xl flex-row items-center justify-center gap-2"
                        >
                            <Ionicons name="trash-outline" size={20} color={Colors.race} />
                            <Text className="text-race font-bold">Clear Checked Items</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
