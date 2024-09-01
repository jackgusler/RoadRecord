import {
    View,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
  } from "react-native";
  import React from "react";
  
  const CustomTextInput = ({
    label,
    placeholder,
    handleChangeText,
    value,
    secureTextEntry,
  }) => {
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
          />
        </View>
      </TouchableWithoutFeedback>
    );
  };
  
  export default CustomTextInput;
  