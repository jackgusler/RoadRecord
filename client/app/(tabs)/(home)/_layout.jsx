import { View } from "react-native";
import { Stack } from "expo-router";

const HomeLayout = () => {
  return (
    <View className="flex-1">
      <Stack>
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="states/[state]" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
};

export default HomeLayout;
