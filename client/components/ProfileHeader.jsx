import { Alert, Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useGlobalContext } from "../context/AuthContext";
import IconButton from "./IconButton";
import { icons } from "../constants";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { updateUser } from "../services/userService";
import { signOut } from "../services/authService";
import { router } from "expo-router";

const ProfileHeader = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();

  const handleEditProfileImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      try {
        // Resize the image to 512x512 pixels
        const manipResult = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 512, height: 512 } }],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );

        const formData = new FormData();

        // Add other user data
        for (const key in user) {
          if (user.hasOwnProperty(key)) {
            formData.append(key, user[key]);
          }
        }

        // Add the resized profile image as a file
        const localUri = manipResult.uri;
        const filename = localUri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append("profile_img", {
          uri: localUri,
          name: filename,
          type: type,
        });

        const updatedUser = await updateUser(user.id, formData);
        setUser(updatedUser);
      } catch (error) {
        Alert.alert("Error updating profile image", error.message);
      }
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);
    router.replace("/");
  };

  return (
    <View className="bg-primary pt-36">
      <View className="flex items-center">
        <Text className="font-abold text-4xl text-accent mb-2">
          {user.first_name} {user.last_name}
        </Text>
        <View className="relative">
          <View className="rounded-full border-4 border-accent">
            <Image
              source={{ uri: user.profile_img }}
              className="w-32 h-32 rounded-full"
            />
          </View>
          <IconButton
            icon={icons.pencil}
            iconFilled={icons.pencilFill}
            handlePress={handleEditProfileImage}
            positionStyles="absolute bottom-0 right-0 rounded-full border-4 border-accent "
          />
        </View>
        <Text className="font-abold text-2xl text-accent">
          @{user.username}
        </Text>
      </View>
    </View>
  );
};

export default ProfileHeader;
