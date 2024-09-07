import { Stack } from "expo-router";

const HomeLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="states/[state]" options={{ headerShown: false }} />
    </Stack>
  );
};

export default HomeLayout;