import { TouchableOpacity, Text, View, Image } from "react-native";
import React from "react";

const Button = ({
  title,
  icon,
  handlePress,
  color,
  containerStyle,
  textStyle,
  disabled,
}) => {
  return (
    <TouchableOpacity
      className={`bg-${color} rounded-xl h-[62px] w-[100px] justify-center items-center ${containerStyle}`}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={disabled}
      style={{ opacity: disabled ? 0.5 : 1 }} // Adjust opacity based on disabled prop
    >
      <View className="flex-row items-center justify-center">
        <Text className={`text-accent font-usemibold ${textStyle}`}>
          {title}
        </Text>
        {icon ? (
          <Image
            source={icon}
            className="w-6 h-6 ml-2"
            resizeMode="contain"
            tintColor={"#F5FBEF"}
          />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default Button;