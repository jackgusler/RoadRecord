import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";
import Button from "../components/Button";
import { useGlobalContext } from "../context/AuthContext";

export default function App() {
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (!isLoading && isLoggedIn) {
    return <Redirect href="/home" />;
  }

  return (
    <SafeAreaView className="bg-primary h-full flex items-center justify-center">
      <View className="p-4">
        <Button
          title="Sign in"
          handlePress={() => router.push("/sign-in")}
          color="secondary"
          textSyle={"text-lg"}
        />
      </View>
      <View className="p-4">
        <Button
          title="Sign up"
          handlePress={() => router.push("/sign-up")}
          color="secondary"
          textSyle={"text-lg"}
        />
      </View>
    </SafeAreaView>
  );
}
