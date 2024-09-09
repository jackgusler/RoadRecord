import Constants from "expo-constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Main API instance with /api prefix
const api = axios.create({
  baseURL: `${Constants.expoConfig.extra.apiUrl}/api`,
});

// Interceptor to add Sanctum token to headers
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("sanctum_token");
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;