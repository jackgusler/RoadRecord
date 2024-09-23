import { Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter, usePathname } from "expo-router";
import { useGlobalContext } from "../context/AuthContext";

const StateButton = ({ state, type }) => {
  const { fetchLicensePlates } = useGlobalContext();
  const router = useRouter();
  const pathname = usePathname();

  const handlePress = () => {
    const basePath =
      type === "home"
        ? "/(home)/states/[state]"
        : "/(profile)/states/[state]";

    if (pathname.includes("/states")) {
      router.back();
    } else {
      if (type === "home") {
        fetchLicensePlates();
      }
      router.push({
        pathname: basePath,
        params: { state: encodeURIComponent(JSON.stringify(state)) },
      });
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
      <View className="w-100 bg-muted rounded-md border-2 border-secondary items-center">
        <Text className="font-ubold text-3xl text-primary p-4">
          {state.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default StateButton;
