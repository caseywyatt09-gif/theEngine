import "../global.css";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { Colors } from "../constants/Colors";

export default function RootLayout() {
    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <StatusBar style="light" />
            <Slot />
        </View>
    );
}
