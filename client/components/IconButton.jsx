import { Image, TouchableOpacity, View } from "react-native";
import React from "react";

const IconButton = ({ icon, handlePress, positionStyles }) => {
  return (
    <TouchableOpacity
      className={`bg-secondary p-1 rounded-full border-4 border-accent ${positionStyles}`}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image source={icon} className="w-6 h-6" tintColor="#F5FBEF" />
    </TouchableOpacity>
  );
};

export default IconButton;
