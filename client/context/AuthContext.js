import React, { createContext, useState, useEffect, useContext } from "react";
import { getCurrentUser } from "../services/userService";
import { getLicensePlatesByUser } from "../services/userLicensePlateService";
import { getCurrentTrip } from "../services/tripService";

const AuthContext = createContext();
export const useGlobalContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userLicensePlates, setUserLicensePlates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTrip, setCurrentTrip] = useState(null);

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
    if (!user) return;
    fetchLicensePlates();
    fetchCurrentTrip();
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

  const fetchCurrentTrip = async () => {
    try {
      const currentTrip = await getCurrentTrip();
      setCurrentTrip(currentTrip);
    } catch (error) {
      console.error("Error fetching current trip:", error);
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
        fetchLicensePlates,
        currentTrip,
        setCurrentTrip,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
