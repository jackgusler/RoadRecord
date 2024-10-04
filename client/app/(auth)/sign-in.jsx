import { Alert, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import Button from "../../components/Button";
import CustomTextInput from "../../components/CustomTextInput";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { router } from "expo-router";
import { signIn } from "../../services/authService";
import { useGlobalContext } from "../../context/AuthContext";
import { getCurrentUser, updateUser } from "../../services/userService";
import * as Location from "expo-location";

const SignIn = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailRef = useRef();
  const passwordRef = useRef();

  const startLocationUpdates = async (
    userId,
    currentLocation,
    currentTimezone
  ) => {
    let locationSubscription;
    const prevCoords = { latitude: null, longitude: null };

    const updateLocation = async (location) => {
      const { latitude, longitude } = location.coords;

      // Check if the coordinates have changed
      if (
        prevCoords.latitude === latitude &&
        prevCoords.longitude === longitude
      ) {
        return; // Coordinates haven't changed, so do nothing
      }

      // Update the previous coordinates
      prevCoords.latitude = latitude;
      prevCoords.longitude = longitude;

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      const town =
        data.address.city || data.address.town || data.address.village;
      const state = data.address.state;
      const newLocation = `${town}, ${state}`;

      // Get the current timezone
      const newTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Check if the new location or timezone is different from the current ones
      if (newLocation === currentLocation && newTimezone === currentTimezone) {
        return; // Location and timezone haven't changed, so do nothing
      }

      // Create FormData and append location and timezone data
      const formData = new FormData();
      formData.append("location", newLocation);
      formData.append("timezone", newTimezone);

      // Update user location and timezone in the backend
      await updateUser(userId, formData);
    };

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Permission to access location was denied");
      return;
    }

    locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 10000, // Update every 10 seconds
        distanceInterval: 50, // Update every 50 meters
      },
      updateLocation
    );

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  };

  const handleSignIn = async () => {
    try {
      const credentials = { email, password };
      const response = await signIn(credentials);

      if (response.success) {
        const res = await getCurrentUser();
        setUser(res.user);
        setIsLoggedIn(true);

        // Start location updates with current location and timezone
        startLocationUpdates(res.user.id, res.user.location, res.user.timezone);

        router.replace("/home");
      } else {
        Alert.alert(
          "Error",
          response.message || "Sign-in failed. Please try again."
        );
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="flex-1 justify-between">
        <View className="items-center">
          <Text className="text-4xl font-ubold text-secondary my-8">
            Sign in
          </Text>
        </View>
        <KeyboardAwareScrollView
          className="px-4"
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingBottom: 35 }}
          extraScrollHeight={20}
          enableOnAndroid={true}
        >
          <CustomTextInput
            label="Email"
            labelColor="secondary"
            placeholder="Email"
            handleChangeText={setEmail}
            value={email}
            containerStyles="mb-4 w-full"
            inputStyles="h-16 bg-accent text-primary"
            textColor="#748B75"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current.focus()}
            blurOnSubmit={false}
            ref={emailRef}
          />
          <CustomTextInput
            label="Password"
            labelColor="secondary"
            placeholder="Password"
            handleChangeText={setPassword}
            value={password}
            containerStyles="mb-4 w-full"
            inputStyles="h-16 bg-accent text-primary"
            textColor="#748B75"
            secureTextEntry={true}
            returnKeyType="done"
            onSubmitEditing={handleSignIn}
            blurOnSubmit={false}
            ref={passwordRef}
          />
        </KeyboardAwareScrollView>
        <View className="px-4 mb-4 items-center w-full">
          <Button
            title="Sign in"
            handlePress={handleSignIn}
            color="secondary"
            containerStyle="w-full"
            textStyle="text-lg"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
