import { View, TouchableOpacity, Image } from "react-native";
import { Stack, useRouter } from "expo-router";
import SearchInput from "../../../components/SearchInput";
import { icons } from "../../../constants";

const Header = () => {
  const router = useRouter();
  const showBackArrow = router.canGoBack();

  return (
    <View className="bg-dark h-32 px-4 justify-end">
      <View className="flex-row">
        {showBackArrow && (
          <TouchableOpacity
            className="flex-row mt-2 mr-2"
            onPress={() => router.back()}
          >
            <Image
              source={icons.arrowLeft}
              className="w-8 h-8"
              tintColor="#748B75"
            />
          </TouchableOpacity>
        )}
        <View className="flex-1">
          <SearchInput />
        </View>
      </View>
    </View>
  );
};

const HomeLayout = () => {
  return (
    <View style={{ flex: 1 }}>
      <Header />
      <Stack>
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="states/[state]" options={{ headerShown: false }} />
        <Stack.Screen name="search/[query]" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
};

export default HomeLayout;