import { Text, View, Alert } from "react-native";
import React, { useRef, useState } from "react";
import Button from "../../components/Button";
import CustomTextInput from "../../components/CustomTextInput";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { signUp, signIn } from "../../services/authService";
import { useGlobalContext } from "../../context/AuthContext";
import { getCurrentUser } from "../../services/userService";

const SignUp = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const handleSignUp = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      const userData = { username, email, password, first_name, last_name };
      const response = await signUp(userData);

      if (response.success) {
        const credentials = { email, password };
        await handleSignIn(credentials); // Sign in after successful sign up
      } else {
        Alert.alert(
          "Error",
          response.message || "Sign-up failed. Please try again."
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Sign-up failed. Please try again."
      );
    }
  };

  const handleSignIn = async (credentials) => {
    try {
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
      Alert.alert(
        "Error",
        error.message || "Sign-in failed. Please try again."
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-accent">
      <View className="flex-1 justify-between">
        <View className="items-center">
          <Text className="text-4xl font-abold text-primary my-8">Sign up</Text>
        </View>
        <KeyboardAwareScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: 20 }}
          extraScrollHeight={20}
          enableOnAndroid={true}
        >
          <View className="flex-row justify-between">
            <View className="flex-1 mr-2">
              <CustomTextInput
                label="First name"
                placeholder="First name"
                handleChangeText={setFirstName}
                value={first_name}
                returnKeyType="next"
                onSubmitEditing={() => lastNameRef.current.focus()}
                blurOnSubmit={false}
                ref={firstNameRef}
              />
            </View>
            <View className="flex-1 ml-2">
              <CustomTextInput
                label="Last name"
                placeholder="Last name"
                handleChangeText={setLastName}
                value={last_name}
                returnKeyType="next"
                onSubmitEditing={() => usernameRef.current.focus()}
                blurOnSubmit={false}
                ref={lastNameRef}
              />
            </View>
          </View>
          <CustomTextInput
            label="Username"
            placeholder="Username"
            handleChangeText={setUsername}
            value={username}
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current.focus()}
            blurOnSubmit={false}
            ref={usernameRef}
          />
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
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordRef.current.focus()}
            blurOnSubmit={true}
            ref={passwordRef}
          />
          <CustomTextInput
            label="Confirm Password"
            placeholder="Confirm Password"
            handleChangeText={setConfirmPassword}
            value={confirmPassword}
            secureTextEntry={true}
            returnKeyType="done"
            onSubmitEditing={handleSignUp}
            blurOnSubmit={true}
            ref={confirmPasswordRef}
          />
        </KeyboardAwareScrollView>
        <View className="px-4 mb-4">
          <Button title="Sign up" handlePress={handleSignUp} color="primary" />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
