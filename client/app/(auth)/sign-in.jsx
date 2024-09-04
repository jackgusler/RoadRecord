// sign-in.jsx
import { Alert, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import Button from "../../components/Button";
import CustomTextInput from "../../components/CustomTextInput";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { router } from "expo-router";
import { signIn } from "../../services/authService";
import { useGlobalContext } from "../../context/AuthContext";
import { getCurrentUser } from "../../services/userService";

const SignIn = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSignIn = async () => {
    try {
      const credentials = { email, password };
      const response = await signIn(credentials);

      if (response.success) {
        const res = await getCurrentUser();
        setUser(res.user);
        setIsLoggedIn(true);
        router.replace("/home");
      } else {
        Alert.alert(
          "Error",
          response.message || "Sign-in failed. Please try again."
        );
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-accent">
      <View className="flex-1 justify-between">
        <View className="items-center">
          <Text className="text-4xl font-abold text-primary my-8">Sign in</Text>
        </View>
        <KeyboardAwareScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: 20 }}
          extraScrollHeight={20}
          enableOnAndroid={true}
        >
          <CustomTextInput
            label="Email"
            placeholder="Email"
            handleChangeText={setEmail}
            value={email}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current.focus()}
            blurOnSubmit={false}
            ref={emailRef}
          />
          <CustomTextInput
            label="Password"
            placeholder="Password"
            handleChangeText={setPassword}
            value={password}
            secureTextEntry={true}
            returnKeyType="done"
            onSubmitEditing={handleSignIn}
            blurOnSubmit={false}
            ref={passwordRef}
          />
        </KeyboardAwareScrollView>
        <View className="px-4 mb-4">
          <Button title="Sign in" handlePress={handleSignIn} color="primary" />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
