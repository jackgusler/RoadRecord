import React, { createContext, useState, useEffect, useContext } from "react";
import { getCurrentUser } from "../services/userService";
import { getLicensePlatesByUser } from "../services/userLicensePlateService";
import { getLicensePlatesDetailsByUser } from "../services/licensePlateService";

const AuthContext = createContext();
export const useGlobalContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userLicensePlates, setUserLicensePlates] = useState([]);
  const [userLicensePlatesDetails, setUserLicensePlatesDetails] = useState([]);
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
        const userPlates = await getLicensePlatesByUser(user.id);
        setUserLicensePlates(userPlates);

        // Fetch license plates details
        const plates = await getLicensePlatesDetailsByUser(user.id);
        setUserLicensePlatesDetails(plates);
      } catch (error) {
        console.error("Error fetching license plates:", error);
      }
    }
  };

  const removeLicensePlate = (id) => {
    setUserLicensePlates((prevPlates) =>
      prevPlates.filter((plate) => plate.id !== id)
    );
    setUserLicensePlatesDetails((prevPlates) =>
      prevPlates.filter((plate) => plate.id !== id)
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        userLicensePlates,
        setUserLicensePlates,
        userLicensePlatesDetails,
        setUserLicensePlatesDetails,
        isLoading,
        setIsLoading,
        fetchLicensePlates,
        removeLicensePlate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
