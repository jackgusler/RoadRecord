import { Text, View } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getTripsByUser,
  createTrip,
  deleteTrip,
} from "../../services/tripService";
import { useFocusEffect } from "expo-router";
import Button from "../../components/Button";
import CustomTextInput from "../../components/CustomTextInput";
import CustomModal from "../../components/CustomModal";
import TripCard from "../../components/TripCard";

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    starting_location: "",
    ending_location: "",
  });

  const nameRef = useRef();
  const startLocationRef = useRef();
  const endLocationRef = useRef();

  useFocusEffect(
    useCallback(() => {
      const fetchTrips = async () => {
        try {
          const data = await getTripsByUser();
          setTrips(data);
        } catch (error) {
          console.error("Error fetching trips:", error);
        }
      };

      fetchTrips();
    }, [])
  );

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateTrip = async () => {
    const placeholderTime = "00:00";
    const currentDateTime = new Date().toISOString();
    const placeholderDateTime = "9999-12-31T23:59:59Z";

    const tripData = {
      ...formData,
      time: placeholderTime,
      starting_date: currentDateTime,
      ending_date: placeholderDateTime,
      started: false,
      ended: false,
    };

    try {
      await createTrip(tripData);
      setIsModalVisible(false);
      const data = await getTripsByUser();
      setTrips(data);
    } catch (error) {
      console.error("Error creating trip:", error);
    }

    setFormData({
      name: "",
      starting_location: "",
      ending_location: "",
    });
  };

  const handleDeleteTrip = async (id) => {
    try {
      await deleteTrip(id);
      const data = await getTripsByUser();
      setTrips(data);
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex items-center justify-center h-full">
        {trips.map((trip) => (
          <View className="w-full mb-4" key={trip.id}>
            <TripCard trip={trip} onDelete={() => handleDeleteTrip(trip.id)} />
          </View>
        ))}
        <Button
          title="Create New Trip"
          handlePress={() => setIsModalVisible(true)}
          color="secondary"
          containerStyle="w-1/2 mt-4"
          textStyle={"text-lg"}
        />
      </View>

      <CustomModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      >
        <View className="items-center">
          <CustomTextInput
            label="Name"
            placeholder="Enter trip name"
            handleChangeText={(value) => handleInputChange("name", value)}
            value={formData.name}
            containerStyles="mb-4 w-full"
            inputStyles="bg-accent h-8 text-primary"
            labelColor="primary"
            textColor="#0B3142"
            returnKeyType="next"
            onSubmitEditing={() => startLocationRef.current.focus()}
            blurOnSubmit={false}
            ref={nameRef}
          />
          <View className="flex-row justify-center gap-4">
            <View className="flex-1 pr-2">
              <CustomTextInput
                label="Start Location"
                placeholder="Enter start location"
                handleChangeText={(value) =>
                  handleInputChange("starting_location", value)
                }
                value={formData.starting_location}
                inputStyles="bg-accent h-8 text-primary"
                labelColor="primary"
                textColor="#0B3142"
                returnKeyType="next"
                onSubmitEditing={() => endLocationRef.current.focus()}
                blurOnSubmit={false}
                ref={startLocationRef}
              />
            </View>
            <View className="flex-1 pl-2">
              <CustomTextInput
                label="End Location"
                placeholder="Enter end location"
                handleChangeText={(value) =>
                  handleInputChange("ending_location", value)
                }
                value={formData.ending_location}
                inputStyles="bg-accent h-8 text-primary"
                labelColor="primary"
                textColor="#0B3142"
                containerStyles="mb-4"
                returnKeyType="done"
                onSubmitEditing={handleCreateTrip}
                blurOnSubmit={false}
                ref={endLocationRef}
              />
            </View>
          </View>
          <Button
            title="Create Trip"
            handlePress={handleCreateTrip}
            color="secondary"
            containerStyle="w-full"
            textStyle={"text-lg"}
            disabled={
              !formData.name ||
              !formData.starting_location ||
              !formData.ending_location
            }
          />
        </View>
      </CustomModal>
    </SafeAreaView>
  );
};

export default Trips;
