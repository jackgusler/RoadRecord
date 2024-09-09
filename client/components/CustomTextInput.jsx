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
      secureTextEntry,
      returnKeyType,
      onSubmitEditing,
      blurOnSubmit,
      search,
      children,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className={containerStyles}>
          {label && <Text className="text-lg font-semibold mb-2">{label}</Text>}
          <View
            className={`flex-row items-center border-2 rounded-2xl overflow-hidden ${
              isFocused ? "border-secondary" : "border-muted"
            } ${search ? "bg-primary" : ""}`}
          >
            <TextInput
              className={`flex-1 px-4 font-amedium ${inputStyles}`}
              placeholder={placeholder}
              placeholderTextColor={textColor}
              onChangeText={handleChangeText}
              value={value}
              secureTextEntry={secureTextEntry}
              returnKeyType={returnKeyType}
              onSubmitEditing={onSubmitEditing}
              blurOnSubmit={blurOnSubmit}
              ref={ref}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />

            {search && children({ isFocused })}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
);

export default CustomTextInput;