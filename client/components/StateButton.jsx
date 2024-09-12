import { Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Link, useRouter, usePathname } from "expo-router";
import { icons } from "../constants";

const StateButton = ({ state }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handlePress = () => {
    if (pathname.includes("/states")) {
      router.back();
    } else {
      router.push({
        pathname: "/states/[state]",
        params: { state: encodeURIComponent(JSON.stringify(state)) },
      });
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
      <View className="w-100 bg-muted rounded-md border-2 border-secondary items-center">
        <Text className="font-abold text-3xl text-primary p-4">
          {state.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default StateButton;
