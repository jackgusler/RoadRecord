import {
  FlatList,
  Image,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { icons } from "../constants";
import { Swipeable } from "react-native-gesture-handler";
import Button from "./Button";
import { LinearGradient } from "expo-linear-gradient";
import CustomModal from "./CustomModal";
import { useRef, useState } from "react";
import { getTripById, updateTrip } from "../services/tripService";
import { Flow } from "react-native-animated-spinkit";
import CustomTextInput from "./CustomTextInput";
import { getTripLicensePlateDetailsByTrip } from "../services/tripLicensePlateService";
import LicensePlateCard from "./LicensePlateCard";

const TripCard = ({ trip, onDelete, onStart, onEnd, onSave }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [currentTripTime, setCurrentTripTime] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const editTitleRef = useRef();
  const editStartLocationRef = useRef();
  const editEndLocationRef = useRef();
  const [editTitle, setEditTitle] = useState(false);
  const [editStartLocation, setEditStartLocation] = useState(false);
  const [editEndLocation, setEditEndLocation] = useState(false);

  const [didEdit, setDidEdit] = useState(false);

  const [tripLicensePlates, setTripLicensePlates] = useState([]);

  const openModal = async () => {
    setIsModalVisible(true);
    setIsLoading(true);
    setIsEditing(false);

    if (trip.started && !trip.ended) {
      try {
        const fetchedTrip = await getTripById(trip.id);
        setCurrentTrip(fetchedTrip);
        setCurrentTripTime(formatTime(fetchedTrip.time));
      } catch (error) {
        console.error("Error fetching trip:", error);
      }
    } else {
      setCurrentTrip(trip);
      setCurrentTripTime(formatTime(trip.time));
    }

    try {
      const licensePlates = await getTripLicensePlateDetailsByTrip(trip.id);
      setTripLicensePlates(licensePlates);
    } catch (error) {
      console.error("Error fetching trip license plates:", error);
    }

    setIsLoading(false);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    if (didEdit) {
      onSave();
      setDidEdit(false);
    }
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

  const saveChanges = async () => {
    const updatedTrip = {
      id: currentTrip.id,
      name: editTitle,
      starting_location: editStartLocation,
      ending_location: editEndLocation,
    };

    try {
      const updatedData = await updateTrip(updatedTrip);
      setCurrentTrip(updatedData.trip);
      setDidEdit(true);
    } catch (error) {
      console.error("Error updating trip:", error);
    } finally {
      handleEdit(false);
    }
  };

  const handleEdit = (value) => {
    setEditTitle(currentTrip.name);
    setEditStartLocation(currentTrip.starting_location);
    setEditEndLocation(currentTrip.ending_location);
    setIsEditing(value);

    // Use a timeout to ensure the component is rendered before focusing
    setTimeout(() => {
      if (editTitleRef.current) {
        editTitleRef.current.focus();
      }
    }, 0);
  };

  const renderRightActions = () => {
    return (
      <View className="bg-muted border-2 border-secondary rounded-xl flex-row items-center justify-end mr-4">
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
              <View className="w-full h-full bg-muted rounded-l-[22px] rounded-r-xl absolute inset-0 flex flex-row items-center p-2">
                {!trip.started && !trip.ended ? (
                  <Button
                    title="Start Trip"
                    handlePress={() => {
                      onStart(trip.id);
                    }}
                    color="secondary"
                    containerStyle="flex-1 mr-2"
                    textStyle="text-lg"
                  />
                ) : trip.started && !trip.ended ? (
                  <Button
                    title="End Trip"
                    handlePress={() => {
                      onEnd(trip.id);
                    }}
                    color="secondary"
                    containerStyle="flex-1 mr-2"
                    textStyle="text-lg"
                  />
                ) : null}
                <Button
                  title="Details"
                  handlePress={openModal}
                  color="secondary"
                  containerStyle="flex-1"
                  textStyle="text-lg"
                />
              </View>
            </View>
          </View>
        </LinearGradient>
      </Swipeable>

      <CustomModal
        isVisible={isModalVisible}
        onClose={closeModal}
        containerStyles="p-2"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="h-96 flex flex-col justify-between ">
            {isLoading ? (
              <View className="flex-1 flex items-center justify-center">
                <Flow size={50} color="#92AD94" />
              </View>
            ) : (
              <>
                <View className="flex flex-col items-center mb-1 h-10">
                  {!isEditing ? (
                    currentTrip ? (
                      <Text
                        className="text-5xl font-ubold text-secondary"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {currentTrip.name}
                      </Text>
                    ) : null
                  ) : (
                    <CustomTextInput
                      value={editTitle}
                      handleChangeText={setEditTitle}
                      containerStyles="w-full"
                      inputStyles="bg-accentDark h-[34px] text-secondary text-3xl pl-3"
                      textColor="#92AD94"
                      returnKeyType="next"
                      onSubmitEditing={() =>
                        editStartLocationRef.current.focus()
                      }
                      blurOnSubmit={false}
                      ref={editTitleRef}
                    />
                  )}
                </View>
                <View className="flex flex-row flex-1">
                  <View className="flex-1 flex flex-col bg-accentDark p-2 rounded-lg justify-between mr-2">
                    {currentTrip && (
                      <View className="flex flex-col space-y-2">
                        <View>
                          <Text className="text-lg font-ubold text-secondary underline">
                            Starting Location:
                          </Text>

                          <View className="h-6">
                            {!isEditing ? (
                              <Text
                                className="text-lg font-usemibold text-secondary"
                                numberOfLines={1}
                                ellipsizeMode="tail"
                              >
                                {currentTrip.starting_location}
                              </Text>
                            ) : (
                              <CustomTextInput
                                value={editStartLocation}
                                handleChangeText={setEditStartLocation}
                                containerStyles="w-full"
                                inputStyles="bg-accentDark h-[18px] text-secondary pl-2"
                                textColor="#92AD94"
                                returnKeyType="next"
                                onSubmitEditing={() =>
                                  editEndLocationRef.current.focus()
                                }
                                blurOnSubmit={false}
                                ref={editStartLocationRef}
                              />
                            )}
                          </View>
                        </View>

                        <View>
                          <Text className="text-lg font-ubold text-secondary underline">
                            Ending Location:
                          </Text>

                          <View className="h-6">
                            {!isEditing ? (
                              <Text
                                className="text-lg font-usemibold text-secondary"
                                numberOfLines={1}
                                ellipsizeMode="tail"
                              >
                                {currentTrip.ending_location}
                              </Text>
                            ) : (
                              <CustomTextInput
                                value={editEndLocation}
                                handleChangeText={setEditEndLocation}
                                containerStyles="w-full"
                                inputStyles="bg-accentDark h-[18px] text-secondary pl-2"
                                textColor="#92AD94"
                                returnKeyType="done"
                                onSubmitEditing={saveChanges}
                                ref={editEndLocationRef}
                              />
                            )}
                          </View>
                        </View>

                        {currentTrip.started || currentTrip.ended ? (
                          <View>
                            <Text className="text-lg font-ubold text-secondary underline">
                              Starting Time:
                            </Text>
                            <Text
                              className="text-lg font-usemibold text-secondary"
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {new Date(
                                currentTrip.starting_date
                              ).toLocaleString()}
                            </Text>
                          </View>
                        ) : null}

                        {currentTrip.ended ? (
                          <View>
                            <Text className="text-lg font-ubold text-secondary underline">
                              Ending Time:
                            </Text>
                            <Text
                              className="text-lg font-usemibold text-secondary"
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {new Date(
                                currentTrip.ending_date
                              ).toLocaleString()}
                            </Text>
                          </View>
                        ) : null}

                        {currentTrip.started || currentTrip.ended ? (
                          <View>
                            <Text className="text-lg font-ubold text-secondary underline">
                              Time:
                            </Text>
                            <Text
                              className="text-lg font-usemibold text-secondary"
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {currentTripTime}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    )}
                  </View>

                  <View className="flex-1 bg-accentDark rounded-lg px-2">
                    <View className="flex-1 flex flex-col">
                      {tripLicensePlates.length === 0 ? (
                        trip.ended ? (
                          <View className="flex-1 flex items-center justify-center">
                            <Text className="text-lg font-usemibold text-secondary text-center">
                              No license plates seen during this trip
                            </Text>
                          </View>
                        ) : trip.started && !trip.ended ? (
                          <View className="flex-1 flex items-center justify-center">
                            <Text className="text-lg font-usemibold text-secondary text-center">
                              No license plates seen yet
                            </Text>
                          </View>
                        ) : (
                          <View className="flex-1 flex items-center justify-center">
                            <Text className="text-lg font-usemibold text-secondary text-center">
                              Start the trip to see license plates
                            </Text>
                          </View>
                        )
                      ) : (
                        <View className="items-center h-full w-full">
                          <FlatList
                            data={tripLicensePlates}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                              <LicensePlateCard plate={item} trip={trip.id} handleRefresh={() => {}} />
                            )}
                            ItemSeparatorComponent={() => (
                              <View style={{ height: 5 }} />
                            )}
                            ListHeaderComponent={() => (
                              <View style={{ paddingTop: 10 }} />
                            )}
                          />
                        </View>
                      )}
                    </View>
                  </View>
                </View>
                <View className="flex flex-row">
                  {!isEditing ? (
                    <Button
                      title="Edit"
                      handlePress={() => handleEdit(true)}
                      color="secondary"
                      containerStyle="flex-1 h-12 mt-2 mr-2"
                      textStyle="text-lg"
                    />
                  ) : (
                    <View className="flex-1 flex flex-row mr-2">
                      <Button
                        title="Save"
                        handlePress={saveChanges}
                        color="secondary"
                        containerStyle="flex-1 h-12 mt-2 mr-2"
                        textStyle="text-lg"
                        style={{ flex: 0.25 }}
                      />
                      <Button
                        title="Cancel"
                        handlePress={() => handleEdit(false)}
                        color="secondary"
                        containerStyle="flex-1 h-12 mt-2"
                        textStyle="text-lg"
                        style={{ flex: 0.25 }}
                      />
                    </View>
                  )}
                  <Button
                    title="Close"
                    handlePress={closeModal}
                    color="secondary"
                    containerStyle="flex-1 h-12 mt-2"
                    textStyle="text-lg"
                    style={{ flex: 1 }}
                  />
                </View>
              </>
            )}
          </View>
        </TouchableWithoutFeedback>
      </CustomModal>
    </>
  );
};

export default TripCard;
