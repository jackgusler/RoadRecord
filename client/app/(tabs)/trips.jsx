import { Alert, Text, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getTripsByUser,
  createTrip,
  deleteTrip,
  startTrip,
  endTrip,
} from "../../services/tripService";
import { useFocusEffect } from "expo-router";
import Button from "../../components/Button";
import CustomTextInput from "../../components/CustomTextInput";
import CustomModal from "../../components/CustomModal";
import TripCard from "../../components/TripCard";
import TripCardList from "../../components/TripCardList";
import { useGlobalContext } from "../../context/AuthContext";
import { Flow } from "react-native-animated-spinkit";

const Trips = () => {
  const { currentTrip, setCurrentTrip, isLoading, setIsLoading } =
    useGlobalContext();

  const [trips, setTrips] = useState([]);
  const [pastTrips, setPastTrips] = useState([]);
  const [futureTrips, setFutureTrips] = useState([]);
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
      fetchTrips();
    }, [])
  );

  const fetchTrips = async () => {
    setIsLoading(true);
    try {
      const data = await getTripsByUser();
      setTrips(data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const currentTrip = trips.find((trip) => trip.started && !trip.ended);
    const pastTrips = trips.filter((trip) => trip.ended);
    const futureTrips = trips.filter((trip) => !trip.started && !trip.ended);

    setCurrentTrip(currentTrip);
    setPastTrips(pastTrips);
    setFutureTrips(futureTrips);
  }, [trips]);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateTrip = async () => {
    const placeholderTime = "00:00:00";
    const placeholderDateTime = "1970-01-01T00:00:00Z";

    const tripData = {
      ...formData,
      time: placeholderTime,
      starting_date: placeholderDateTime,
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

  const handleStartTrip = async (id) => {
    const startNewTrip = async (tripId) => {
      try {
        await startTrip(tripId);
        await fetchTrips();
      } catch (error) {
        console.error("Error starting trip:", error);
      }
    };

    if (currentTrip) {
      Alert.alert("Are you sure?", "This will end your current trip.", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              await endTrip(currentTrip.id);
              await startNewTrip(id);
            } catch (error) {
              console.error("Error ending current trip:", error);
            }
          },
        },
      ]);
    } else {
      await startNewTrip(id);
    }
  };

  const handleEndTrip = async (id) => {
    try {
      await endTrip(id);
      fetchTrips();
    } catch (error) {
      console.error("Error ending trip:", error);
    }
  };

  const handleDeleteTrip = async (id) => {
    try {
      await deleteTrip(id);
      setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== id));
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  return (
    <>
      <SafeAreaView className="bg-primary h-full mt-20">
        <View className="flex justify-center w-full h-36 p-4 mb-2">
          <Text className="text-3xl text-accent font-ubold ml-2 mb-2">
            Current Trip
          </Text>
          <View className="w-full h-full bg-primaryDark rounded-lg py-4 flex items-center justify-center">
            {isLoading ? (
              <Flow size={50} color="#92AD94" />
            ) : currentTrip ? (
              <TripCard
                trip={currentTrip}
                onDelete={handleDeleteTrip}
                onStart={handleStartTrip}
                onEnd={handleEndTrip}
                onSave={fetchTrips}
              />
            ) : (
              <Text className="text-primary text-3xl font-uregular text-center">
                No current trip
              </Text>
            )}
          </View>
        </View>

        <View className="flex justify-center w-full h-[28%] p-4 mb-2">
          <Text className="text-3xl text-accent font-ubold ml-2 my-2">
            Future Trips
          </Text>
          <View className="w-full h-full bg-primaryDark rounded-lg flex items-center justify-center">
            {isLoading ? (
              <Flow size={50} color="#92AD94" />
            ) : futureTrips.length === 0 ? (
              <Text className="text-primary text-3xl font-uregular text-center">
                No future trips
              </Text>
            ) : (
              <TripCardList
                trips={futureTrips}
                onDelete={handleDeleteTrip}
                onStart={handleStartTrip}
                onEnd={handleEndTrip}
                onSave={fetchTrips}
              />
            )}
          </View>
        </View>

        <View className="flex justify-center w-full h-[28%] p-4">
          <Text className="text-3xl text-accent font-ubold ml-2 my-2">
            Past Trips
          </Text>
          <View className="w-full h-full bg-primaryDark rounded-lg flex items-center justify-center">
            {isLoading ? (
              <Flow size={50} color="#92AD94" />
            ) : pastTrips.length === 0 ? (
              <Text className="text-primary text-3xl font-uregular text-center">
                No past trips
              </Text>
            ) : (
              <TripCardList
                trips={pastTrips}
                onDelete={handleDeleteTrip}
                onStart={handleStartTrip}
                onEnd={handleEndTrip}
                onSave={fetchTrips}
              />
            )}
          </View>
        </View>

        <View className="w-full flex-row justify-center">
          <Button
            title="Create New Trip"
            handlePress={() => setIsModalVisible(true)}
            color="secondary"
            containerStyle="w-1/2 h-12 mt-5"
            textStyle={"text-lg"}
          />
        </View>
      </SafeAreaView>

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
    </>
  );
};

export default Trips;
