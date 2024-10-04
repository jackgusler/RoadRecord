import { View } from "react-native";
import { Stack } from "expo-router";
import ProfileHeader from "../../../components/ProfileHeader";
import { useGlobalContext } from "../../../context/AuthContext";

const ProfileLayout = () => {
  const { user } = useGlobalContext();
  return (
    <View className="flex-1">
      {user && <ProfileHeader />}
      <Stack>
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="states/[state]" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
};

export default ProfileLayout;
