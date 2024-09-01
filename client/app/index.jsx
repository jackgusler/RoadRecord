import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";
import { useState } from "react";
import Button from "../components/Button";

export default function App() {
  const { isLoggedIn, setIsLoggedIn } = useState(false);

  if (!isLoggedIn) {
    return (
      <SafeAreaView className="bg-primary h-full flex items-center justify-center">
        <View className="p-4">
          <Button
            title="Sign in"
            handlePress={() => router.push("/sign-in")}
            color="secondary"
          />
        </View>
        <View className="p-4">
          <Button
            title="Sign up"
            handlePress={() => router.push("/sign-up")}
            color="secondary"
          />
        </View>
      </SafeAreaView>
    );
  }

  return <Redirect href="/home" />;
}
