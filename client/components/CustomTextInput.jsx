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
      secureTextEntry,
      returnKeyType,
      onSubmitEditing,
      blurOnSubmit,
    },
    ref
  ) => {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="mb-4 w-full">
          {label && <Text className="text-lg font-semibold mb-2">{label}</Text>}
          <TextInput
            className="border-2 border-muted h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary"
            placeholder={placeholder}
            placeholderTextColor={"#748B75"}
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
