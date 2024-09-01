// services/authService.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { fetchCsrfToken } from "./api";

export const handleRequest = async (requestFunction) => {
  try {
    const response = await requestFunction();
    console.log("Request succeeded:", response);
    return response; // Ensure the response is returned
  } catch (error) {
    console.error("Request failed:", error);
    if (error.response && error.response.status === 419) {
      await fetchCsrfToken();
      return await requestFunction();
    } else {
      console.error(
        "Request failed:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }
};

export const signIn = async (credentials) => {
  await fetchCsrfToken();
  return await handleRequest(async () => {
    const csrfToken = await AsyncStorage.getItem("csrf_token");
    const response = await api.post("/auth/sign-in", credentials, {
      headers: {
        "X-CSRF-TOKEN": csrfToken,
      },
    });
    return {
      success: response.status === 200,
      ...response.data,
    };
  });
};

export const signUp = async (userData) => {
  return await handleRequest(async () => {
    const csrfToken = await AsyncStorage.getItem("csrf_token");
    const response = await api.post("/auth/sign-up", userData, {
      headers: {
        "X-CSRF-TOKEN": csrfToken,
      },
    });
    return response;
  });
};

export const signOut = async () => {
  await fetchCsrfToken(); // Ensure CSRF token is fetched before sign-out
  return await handleRequest(async () => {
    const csrfToken = await AsyncStorage.getItem("csrf_token");
    const response = await api.post(
      "/auth/sign-out",
      {},
      {
        headers: {
          "X-CSRF-TOKEN": csrfToken,
        },
      }
    );
  });
};

export const checkAuthStatus = async () => {
  try {
    const csrfToken = await AsyncStorage.getItem("csrf_token");
    const response = await api.post(
      "/auth/status",
      {},
      {
        headers: {
          "X-CSRF-TOKEN": csrfToken,
        },
      }
    );
    return response.data.authenticated;
  } catch (error) {
    console.error(
      "Error checking auth status:",
      error.response ? error.response.data : error.message
    );
    return false;
  }
};