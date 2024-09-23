import { SplashScreen, Stack, useSegments } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { AuthProvider } from "../context/AuthContext"; // Import AuthProvider
import React from "react";
import { useRouter } from "expo-router";
import { icons } from "../constants";
import SearchInput from "../components/SearchInput";
import { View, TouchableOpacity, Image } from "react-native";

SplashScreen.preventAutoHideAsync();

const Header = () => {
  return (
    <View className="bg-dark h-32 px-4 justify-end rounded-b-[32px] absolute left-0 top-0 right-0 z-10">
      <SearchInput />
    </View>
  );
};

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Urbanist-Black": require("../assets/fonts/Urbanist-Black.ttf"),
    "Urbanist-Bold": require("../assets/fonts/Urbanist-Bold.ttf"),
    "Urbanist-ExtraBold": require("../assets/fonts/Urbanist-ExtraBold.ttf"),
    "Urbanist-ExtraLight": require("../assets/fonts/Urbanist-ExtraLight.ttf"),
    "Urbanist-Light": require("../assets/fonts/Urbanist-Light.ttf"),
    "Urbanist-Medium": require("../assets/fonts/Urbanist-Medium.ttf"),
    "Urbanist-Regular": require("../assets/fonts/Urbanist-Regular.ttf"),
    "Urbanist-SemiBold": require("../assets/fonts/Urbanist-SemiBold.ttf"),
    "Urbanist-Thin": require("../assets/fonts/Urbanist-Thin.ttf"),
  });

  const segments = useSegments(); // Get current segments for navigation

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  const showHeader = segments.includes("(tabs)") || segments.includes("search");

  return (
    <AuthProvider>
      {showHeader && <Header />}
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="search/[query]" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
};

export default RootLayout;
