import { Image, Text, View } from "react-native";
import { icons } from "../constants";
import { Swipeable } from "react-native-gesture-handler";
import Button from "./Button";
import { LinearGradient } from "expo-linear-gradient";
import CustomModal from "./CustomModal";
import { useState } from "react";
import { getTripById } from "../services/tripService";
import { Flow } from "react-native-animated-spinkit";

const TripCard = ({ trip, onDelete, onStart, onEnd }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [currentTripTime, setCurrentTripTime] = useState(null);

  const openModal = async () => {
    setIsModalVisible(true);
    setIsLoading(true);
    if (trip.started && !trip.ended) {
      try {
        const fetchedTrip = await getTripById(trip.id);
        setCurrentTrip(fetchedTrip);
        setCurrentTripTime(formatTime(fetchedTrip.time));
      } catch (error) {
        console.error("Error fetching trip:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setCurrentTrip(trip);
      setCurrentTripTime(formatTime(trip.time));
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const formatTime = (time) => {
    const [hours, minutes, seconds] = time
      .split(":")
      .map((time) => parseInt(time));
    let formattedTime = "";

    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      formattedTime += `${days}d `;
      hours %= 24; // Get the remaining hours after converting to days
    }
    if (hours > 0) {
      formattedTime += `${hours}h `;
    }
    if (minutes > 0) {
      formattedTime += `${minutes}m `;
    }
    if (seconds > 0) {
      formattedTime += `${seconds}s`;
    }

    return formattedTime.trim(); // Remove any trailing space
  };

  const renderRightActions = () => {
    return (
      <View className="bg-muted border-2 border-secondary  rounded-xl flex-row items-center justify-end mr-4">
        <Button
          title="Delete"
          handlePress={() => onDelete(trip.id)} // Handling the delete action
          color="secondary"
          containerStyle="w-20 h-14 mx-2"
          textStyle="text-lg"
        />
      </View>
    );
  };

  return (
    <>
      <Swipeable renderRightActions={renderRightActions}>
        <LinearGradient
          colors={["#748B75", "#748B75", "#92AD94", "#92AD94"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="h-20 mx-4 border-2 border-transparent rounded-xl"
        >
          <View className="w-full bg-muted border-secondary rounded-xl flex-row">
            <View className="w-[50%]">
              <View className="flex-1">
                <View className="px-4 py-1 bg-accent rounded-br-3xl rounded-tl-xl h-full justify-center">
                  <Text
                    className="text-secondary text-3xl font-ubold"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {trip.name}
                  </Text>
                </View>
              </View>
              <View className="flex-1">
                <View className="p-2 bg-secondary rounded-tr-3xl rounded-bl-xl flex-row items-center h-full">
                  <View
                    style={{
                      flexDirection: "row",
                      flex: 1,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      className="text-accent text-base font-usemibold"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{ flexShrink: 1 }}
                    >
                      {trip.starting_location}
                    </Text>
                    <Image
                      source={icons.arrowRightRegular}
                      className="w-4 h-4 mx-1 mt-[2]"
                      tintColor={"#F5FBEF"}
                    />
                    <Text
                      className="text-accent text-base font-usemibold"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{ flexShrink: 1 }}
                    >
                      {trip.ending_location}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="w-[50%] relative ">
              <View className="h-1/2 bg-accent rounded-r-3xl"></View>
              <View className="h-1/2 bg-secondary rounded-r-3xl"></View>
              <View className="w-full h-full bg-muted rounded-l-[22px] rounded-r-xl absolute inset-0 flex-row items-center justify-evenly py-2">
                {!trip.started && !trip.ended ? (
                  <Button
                    title="Start Trip"
                    handlePress={() => {
                      onStart(trip.id);
                    }}
                    color="secondary"
                    containerStyle="w-[74px] h-14"
                    textStyle="text-lg"
                  />
                ) : trip.started && !trip.ended ? (
                  <Button
                    title="End Trip"
                    handlePress={() => {
                      onEnd(trip.id);
                    }}
                    color="secondary"
                    containerStyle="w-[74px] h-14"
                    textStyle="text-lg"
                  />
                ) : null}
                <Button
                  title="Details"
                  handlePress={openModal}
                  color="secondary"
                  containerStyle={`${!trip.started && !trip.ended ? "w-[74px]" : trip.started && !trip.ended ? "w-[74px]" : "w-40"} h-14`}
                  textStyle="text-lg"
                />
              </View>
            </View>
          </View>
        </LinearGradient>
      </Swipeable>

      <CustomModal isVisible={isModalVisible} onClose={closeModal}>
        <View className="h-64 items-center justify-center">
          {isLoading ? (
            <Flow size={50} color="#92AD94" />
          ) : (
            currentTrip && (
              <View className="flex flex-col items-center">
                <Text className="text-3xl font-ubold text-accent">
                  {currentTrip.name}
                </Text>
                <Text className="text-lg font-usemibold text-secondary">
                  Starting Location: {currentTrip.starting_location}
                </Text>
                <Text className="text-lg font-usemibold text-secondary">
                  Ending Location: {currentTrip.ending_location}
                </Text>
                <Text className="text-lg font-usemibold text-secondary">
                  Time: {currentTripTime}
                </Text>
              </View>
            )
          )}
          <Button
            title="Close"
            handlePress={closeModal}
            color="secondary"
            containerStyle="w-24 h-12 mt-4"
            textStyle="text-lg"
          />
        </View>
      </CustomModal>
    </>
  );
};

export default TripCard;
