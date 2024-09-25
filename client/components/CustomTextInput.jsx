import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { forwardRef, useState } from "react";

const CustomTextInput = forwardRef(
  (
    {
      label,
      placeholder,
      handleChangeText,
      value,
      containerStyles,
      inputStyles,
      textColor,
      labelColor,
      secureTextEntry,
      returnKeyType,
      onSubmitEditing,
      blurOnSubmit,
      search,
      children,
      onFocus, // Add onFocus prop
      onBlur, // Add onBlur prop
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
      setIsFocused(true);
      if (onFocus) onFocus(); // Call the passed onFocus prop
    };

    const handleBlur = () => {
      setIsFocused(false);
      if (onBlur) onBlur(); // Call the passed onBlur prop
    };

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className={containerStyles}>
          {label && <Text className={`text-lg font-usemibold mb-2 text-${labelColor}`}>{label}</Text>}
          <View
            className={`flex-row items-center border-2 rounded-2xl overflow-hidden border-secondary ${search ? "bg-primary" : ""}`}
          >
            <TextInput
              className={`flex-1 px-4 font-usemibold bg-primary ${inputStyles}`}
              placeholder={placeholder}
              placeholderTextColor={isFocused ? `${textColor}95` : `${textColor}50`} // 50% opacity when not focused
              onChangeText={handleChangeText}
              value={value}
              secureTextEntry={secureTextEntry}
              returnKeyType={returnKeyType}
              onSubmitEditing={onSubmitEditing}
              blurOnSubmit={blurOnSubmit}
              ref={ref}
              onFocus={handleFocus} // Use handleFocus
              onBlur={handleBlur} // Use handleBlur
            />

            {search && children({ isFocused })}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
);

export default CustomTextInput;