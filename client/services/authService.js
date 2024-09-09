// services/authService.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

export const signIn = async (credentials) => {
  try {
    const response = await api.post("/auth/sign-in", credentials);
    const { access_token, token_type } = response.data;
    const fullToken = `${token_type} ${access_token}`;

    await AsyncStorage.setItem("sanctum_token", fullToken);
    api.defaults.headers.common["Authorization"] = fullToken;

    return { success: true, token: fullToken };
  } catch (error) {
    console.error("Sign in failed:", error);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const signUp = async (userData) => {
  try {
    const response = await api.post("/auth/sign-up", userData);
    const { access_token, token_type } = response.data;
    const fullToken = `${token_type} ${access_token}`;

    await AsyncStorage.setItem("sanctum_token", fullToken);
    api.defaults.headers.common["Authorization"] = fullToken;

    return { success: true, token: fullToken };
  } catch (error) {
    console.error("Sign up failed:", error);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const signOut = async () => {
  try {
    const token = await AsyncStorage.getItem("sanctum_token");
    if (token) {
      api.defaults.headers.common["Authorization"] = token;
      await api.post("/auth/sign-out");
      await AsyncStorage.removeItem("sanctum_token");
      delete api.defaults.headers.common["Authorization"];
      return { success: true };
    } else {
      console.error("Sign out failed: No token found");
      throw new Error("No token found");
    }
  } catch (error) {
    console.error("Sign out failed:", error);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const checkAuthStatus = async () => {
  try {
    const token = await AsyncStorage.getItem("sanctum_token");
    if (token) {
      api.defaults.headers.common["Authorization"] = token;
      const response = await api.post("/auth/status");
      return response.data.authenticated;
    }
    return false;
  } catch (error) {
    console.error(
      "Error checking auth status:",
      error.response ? error.response.data : error.message
    );
    return false;
  }
};