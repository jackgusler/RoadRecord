import { Image, TouchableOpacity, View } from "react-native";
import React from "react";

const IconButton = ({ icon, handlePress, positionStyles }) => {
  return (
    <View className={`${positionStyles}`}>
      <TouchableOpacity
        className="bg-secondary p-1 rounded-full"
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Image source={icon} className="w-6 h-6" tintColor="#F5FBEF" />
      </TouchableOpacity>
    </View>
  );
};

export default IconButton;