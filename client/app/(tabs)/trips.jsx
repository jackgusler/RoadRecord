import { Text, View } from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getTripsByUser, createTrip } from "../../services/tripService";
import { useFocusEffect } from "expo-router";
import Button from "../../components/Button";
import CustomTextInput from "../../components/CustomTextInput";
import CustomModal from "../../components/CustomModal";
import CustomCheckBox from "../../components/CustomCheckBox";

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    start_location: "",
    end_location: "",
    time: "",
    starting_date: "",
    ending_date: "",
    name: "",
    still_driving: false,
  });

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
    try {
      await createTrip(formData);
      setIsModalVisible(false);
      const data = await getTripsByUser();
      setTrips(data);
    } catch (error) {
      console.error("Error creating trip:", error);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex items-center justify-center h-full">
        {trips.map((trip) => (
          <View key={trip.id}>
            <Text>{trip.name}</Text>
          </View>
        ))}
        <Button
          title="Create New Trip"
          handlePress={() => setIsModalVisible(true)}
          color="secondary"
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
            inputStyles="bg-accent h-8"
            textColor="#0B3142"
          />
          <View className="flex-row justify-center gap-4">
            <View className="flex-1">
              <CustomTextInput
                label="Start Location"
                placeholder="Enter start location"
                handleChangeText={(value) =>
                  handleInputChange("start_location", value)
                }
                value={formData.start_location}
                inputStyles="bg-accent h-8"
                textColor="#0B3142"
              />
            </View>
            <View className="flex-1">
              <CustomTextInput
                label="End Location"
                placeholder="Enter end location"
                handleChangeText={(value) =>
                  handleInputChange("end_location", value)
                }
                value={formData.end_location}
                inputStyles="bg-accent h-8"
                textColor="#0B3142"
                containerStyles="mb-4"
              />
            </View>
          </View>
          <CustomCheckBox
            title="Still Driving"
            value={formData.still_driving}
            handleToggle={() =>
              handleInputChange("still_driving", !formData.still_driving)
            }
            containerStyles="mb-4"
          />
          <Button
            title="Create Trip"
            handlePress={handleCreateTrip}
            color="secondary"
          />
        </View>
      </CustomModal>
    </SafeAreaView>
  );
};

export default Trips;
