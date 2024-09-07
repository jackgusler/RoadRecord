import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { forwardRef } from "react";

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
    },
    ref
  ) => {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className={containerStyles}>
          {label && <Text className="text-lg font-semibold mb-2">{label}</Text>}
          <TextInput
            className={`px-4 rounded-2xl border-2 border-muted focus:border-secondary font-amedium ${inputStyles}`}
            placeholder={placeholder}
            placeholderTextColor={textColor}
            onChangeText={handleChangeText}
            value={value}
            secureTextEntry={secureTextEntry}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            blurOnSubmit={blurOnSubmit}
            ref={ref}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
);

export default CustomTextInput;
