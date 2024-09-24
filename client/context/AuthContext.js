import React, { createContext, useState, useEffect, useContext } from "react";
import { getCurrentUser } from "../services/userService";
import { getLicensePlatesByUser } from "../services/userLicensePlateService";

const AuthContext = createContext();
export const useGlobalContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userLicensePlates, setUserLicensePlates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await getCurrentUser();
        if (res) {
          setIsLoggedIn(true);
          setUser(res.user);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    fetchLicensePlates();
  }, [user]);

  const fetchLicensePlates = async () => {
    if (user) {
      try {
        // Fetch license plates
        const userPlates = await getLicensePlatesByUser();
        setUserLicensePlates(userPlates);
      } catch (error) {
        console.error("Error fetching license plates:", error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        userLicensePlates,
        setUserLicensePlates,
        isLoading,
        setIsLoading,
        fetchLicensePlates,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
