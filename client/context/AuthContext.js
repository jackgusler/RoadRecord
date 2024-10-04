import React, { createContext, useState, useEffect, useContext } from "react";
import { getCurrentUser, updateUser } from "../services/userService";
import { getLicensePlatesByUser } from "../services/userLicensePlateService";
import { getCurrentTrip } from "../services/tripService";
import * as Location from "expo-location";

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
          startLocationUpdates(
            res.user.id,
            res.user.location,
            res.user.timezone
          ); // Start location updates with current location and timezone
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setIsLoggedIn(false);
        }
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

  const startLocationUpdates = async (
    userId,
    currentLocation,
    currentTimezone
  ) => {
    let locationSubscription;
    const prevCoords = { latitude: null, longitude: null };

    const updateLocation = async (location) => {
      const { latitude, longitude } = location.coords;

      // Check if the coordinates have changed
      if (
        prevCoords.latitude === latitude &&
        prevCoords.longitude === longitude
      ) {
        return; // Coordinates haven't changed, so do nothing
      }

      // Update the previous coordinates
      prevCoords.latitude = latitude;
      prevCoords.longitude = longitude;

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      const town =
        data.address.city || data.address.town || data.address.village;
      const state = data.address.state;
      const newLocation = `${town}, ${state}`;

      // Get the current timezone
      const newTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Check if the new location or timezone is different from the current ones
      if (newLocation === currentLocation && newTimezone === currentTimezone) {
        return; // Location and timezone haven't changed, so do nothing
      }

      // Create FormData and append location and timezone data
      const formData = new FormData();
      formData.append("location", newLocation);
      formData.append("timezone", newTimezone);

      // Update user location and timezone in the backend
      await updateUser(userId, formData);
    };

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Permission to access location was denied");
      return;
    }

    locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 10000, // Update every 10 seconds
        distanceInterval: 50, // Update every 50 meters
      },
      updateLocation
    );

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
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
