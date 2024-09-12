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
    "Archivo-Black": require("../assets/fonts/Archivo-Black.ttf"),
    "Archivo-Bold": require("../assets/fonts/Archivo-Bold.ttf"),
    "Archivo-ExtraBold": require("../assets/fonts/Archivo-ExtraBold.ttf"),
    "Archivo-ExtraLight": require("../assets/fonts/Archivo-ExtraLight.ttf"),
    "Archivo-Light": require("../assets/fonts/Archivo-Light.ttf"),
    "Archivo-Medium": require("../assets/fonts/Archivo-Medium.ttf"),
    "Archivo-Regular": require("../assets/fonts/Archivo-Regular.ttf"),
    "Archivo-SemiBold": require("../assets/fonts/Archivo-SemiBold.ttf"),
    "Archivo-Thin": require("../assets/fonts/Archivo-Thin.ttf"),
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
