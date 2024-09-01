import { Text, View, ScrollView } from "react-native";
import React, { useState } from "react";
import Button from "../../components/Button";
import CustomTextInput from "../../components/CustomTextInput";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-accent">
      <View className="flex-1 justify-between">
        <View className="items-center">
          <Text className="text-4xl font-abold text-primary mb-8">Sign up</Text>
        </View>
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <CustomTextInput
            label="Username"
            placeholder="Username"
            handleChangeText={setUsername}
            value={username}
          />
          <CustomTextInput
            label="Email"
            placeholder="Email"
            handleChangeText={setEmail}
            value={email}
          />
          <CustomTextInput
            label="Password"
            placeholder="Password"
            handleChangeText={setPassword}
            value={password}
            secureTextEntry={true}
          />
          <CustomTextInput
            label="Confirm Password"
            placeholder="Confirm Password"
            handleChangeText={setConfirmPassword}
            value={confirmPassword}
            secureTextEntry={true}
          />
        </ScrollView>
        <View className="px-4 mb-4">
          <Button title="Sign up" handlePress={() => {}} color="primary" />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
