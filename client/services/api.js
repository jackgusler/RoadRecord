import Constants from "expo-constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Main API instance with /api prefix
const api = axios.create({
  baseURL: `${Constants.expoConfig.extra.apiUrl}/api`,
  withCredentials: true,
});

// Separate instance for CSRF token request without /api prefix
const csrfApi = axios.create({
  baseURL: `${Constants.expoConfig.extra.apiUrl}`,
  withCredentials: true,
});

export const fetchCsrfToken = async () => {
  try {
    const response = await csrfApi.get("/csrf-token");
    const csrfToken = response.data.csrf_token;
    await AsyncStorage.setItem("csrf_token", csrfToken);
    return csrfToken;
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
    throw error;
  }
};

export default api;