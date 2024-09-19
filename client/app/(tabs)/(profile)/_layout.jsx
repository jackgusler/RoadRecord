import { View } from "react-native";
import { Stack } from "expo-router";
import ProfileHeader from "../../../components/ProfileHeader";

const ProfileLayout = () => {
  return (
    <View className="flex-1">
      <ProfileHeader />
      <Stack>
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="states/[state]" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
};

export default ProfileLayout;
