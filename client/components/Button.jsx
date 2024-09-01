import { TouchableOpacity, Text } from "react-native";
import React from "react";

const Button = ({
  title,
  handlePress,
  color,
  containerStyle,
  textSyle,
  disabled,
}) => {
  return (
    <TouchableOpacity
      className={`bg-${color} rounded-xl min-h-[62px] min-w-[100px] justify-center items-center ${containerStyle}`}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Text className={`text-accent text-lg font-asemibold ${textSyle}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
