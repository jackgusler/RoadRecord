import { Text } from "react-native";
import React from "react";
import Button from "../../components/Button";
import CustomTextInput from "../../components/CustomTextInput";
import { SafeAreaView } from "react-native-safe-area-context";

const SignIn = () => {
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-accent p-4">
      <Text className="text-4xl font-abold text-primary mb-8">Sign in</Text>
      <CustomTextInput
        label="Username or Email"
        placeholder="Username"
        handleChangeText={() => {}}
        value=""
      />
      <CustomTextInput
        label="Password"
        placeholder="Password"
        handleChangeText={() => {}}
        value=""
        secureTextEntry={true}
      />
      <Button title="Sign in" handlePress={() => {}} color="primary" />
    </SafeAreaView>
  );
};

export default SignIn;
