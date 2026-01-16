import { ThemedView } from "../components/common/ThemedView";
import { ThemedText } from "../components/common/ThemedText";
import { Button } from "../components/common/Button";
import { Link, useRouter } from "expo-router";

export default function Index() {
    const router = useRouter();

    return (
        <ThemedView className="flex-1 justify-center items-center p-6">
            <ThemedText className="text-4xl font-bold mb-2">HYROX HUB</ThemedText>
            <ThemedText className="text-xl text-textDim mb-8">ELITE ATHLETE TRACKING</ThemedText>

            <Button title="Enter The Zone" onPress={() => router.push("/(tabs)/feed")} className="w-full mb-4" />

            <Link href="/(tabs)/feed" asChild>
                <Button title="Login with Google" variant="outline" className="w-full" />
            </Link>
        </ThemedView>
    );
}
