import { Text, View, ImageBackground, TouchableOpacity } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { icons } from "../constants";

const StateFolder = ({ state }) => {
  return (
    <Link
      href={{
        pathname: "/states/[state]",
        params: { state: encodeURIComponent(JSON.stringify(state)) },
      }}
      asChild
    >
      <TouchableOpacity
      activeOpacity={0.7}
      >
        {/* <View className="w-20 h-20 mb-14 mr-4 rounded-lg overflow-hidden">
          <ImageBackground
            source={icons.foldersFill}
            className="flex-1 justify-end items-start p-2"
            tintColor="#92AD94"
          >
            <Text className="font-abold text-lg text-accent m-1">
              {state.abbreviation}
            </Text>
          </ImageBackground>
        </View> */}
        <View className="w-100 bg-muted rounded-md border-2 border-secondary items-center">
          {/* <Text className="font-abold text-3xl text-primary px-1 pt-1">
            {state.abbreviation}
          </Text> */}
          <Text className="font-abold text-3xl text-primary p-4">
            {state.name}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default StateFolder;