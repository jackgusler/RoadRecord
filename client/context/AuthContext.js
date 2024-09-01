// AuthContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { checkAuthStatus } from "../services/authService";
import { fetchCsrfToken } from "@/services/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await fetchCsrfToken();
        const status = await checkAuthStatus();
        setIsLoggedIn(status);
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
