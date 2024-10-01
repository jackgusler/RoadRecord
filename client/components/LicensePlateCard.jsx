import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import Button from "./Button";
import { icons } from "../constants";
import * as userLP from "../services/userLicensePlateService";
import { createTripLicensePlate } from "../services/tripLicensePlateService";
import { useGlobalContext } from "../context/AuthContext";
import CustomModal from "./CustomModal";
import * as Location from "expo-location";

const LicensePlateCard = ({
  plate,
  handleRefresh,
  isSelected,
  onSelect,
  isSelectionMode,
  onLongPress,
}) => {
  const { fetchLicensePlates, userLicensePlates, currentTrip, isLoading } =
    useGlobalContext();

  const [isSeen, setIsSeen] = useState();
  const [isFavorite, setIsFavorite] = useState();
  const [plateLocation, setPlateLocation] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const favorite = userLicensePlates.find(
      (lp) => lp.license_plate_id === plate.id && lp.favorite
    );
    setIsFavorite(favorite ? true : false);
    const seen = userLicensePlates.find(
      (lp) => lp.license_plate_id === plate.id && lp.seen
    );
    setIsSeen(seen ? true : false);
    const location = userLicensePlates.find(
      (lp) => lp.license_plate_id === plate.id && lp.location
    );
    setPlateLocation(location ? location.location : null);
  }, [userLicensePlates]);

  const handleToggle = async (isToggled, toggleType) => {
    const location = await getLocation();
    if (!location) return;

    try {
      if (toggleType === "favorite") {
        if (isToggled) {
          if (!isSeen) {
            showAlert(
              "Are you sure?",
              "Unfavoriting this license plate will remove it from your selections. Do you want to continue?",
              async () => {
                await userLP.unfavoriteUserLicensePlate(plate.id);
                setIsFavorite(false);
                handleRefresh();
                fetchLicensePlates();
              }
            );
          } else {
            await userLP.unfavoriteUserLicensePlate(plate.id);
            setIsFavorite(false);
          }
        } else {
          await userLP.favoriteUserLicensePlate(plate.id, location);
          setIsFavorite(true);
        }
      } else if (toggleType === "seen") {
        if (isToggled) {
          if (!isFavorite) {
            showAlert(
              "Are you sure?",
              "Unseeing this license plate will remove it from your selections. Do you want to continue?",
              async () => {
                await userLP.unseenUserLicensePlate(plate.id);
                setIsSeen(false);
                handleRefresh();
                fetchLicensePlates();
              }
            );
          } else {
            await userLP.unseenUserLicensePlate(plate.id);
            setIsSeen(false);
          }
        } else {
          await userLP.seenUserLicensePlate(plate.id, location);
          if (currentTrip && Object.keys(currentTrip).length > 0) {
            await createTripLicensePlate(currentTrip.id, plate.id);
          }
          setIsSeen(true);
        }
      }

      fetchLicensePlates();
    } catch (error) {
      Alert.alert("Error", `Failed to toggle ${toggleType} status.`);
    }
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Permission to access location was denied");
      return null;
    }

    let coords = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = coords.coords;

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    const data = await response.json();
    const town = data.address.city || data.address.town || data.address.village;
    const state = data.address.state;

    return `${town}, ${state}`;
  };

  const showAlert = (title, message, onConfirm) => {
    Alert.alert(title, message, [
      { text: "Cancel", onPress: () => {}, style: "cancel" },
      { text: "Confirm", onPress: onConfirm },
    ]);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <>
      <View className="relative">
        {isSelectionMode && (
          <View className="absolute top-1 left-1 z-10">
            <View className="bg-accent rounded-full w-4 h-4 flex items-center justify-center">
              <Image
                className="w-6 h-6"
                source={isSelected ? icons.checkFill : icons.plus}
                tintColor={"#0B3142"}
              />
            </View>
          </View>
        )}
        <TouchableOpacity
          onPress={() => {
            if (isSelectionMode) {
              onSelect(plate.id);
            } else {
              toggleModal();
            }
          }}
          onLongPress={() => {
            onLongPress();
            onSelect(plate.id);
          }}
          style={{
            opacity: isSelectionMode && !isSelected ? 0.5 : 1,
          }}
        >
          <View className="bg-accent rounded-lg relative">
            <Image
              source={{ uri: `data:image/png;base64,${plate.plate_img}` }}
              className="w-32 h-16 rounded-lg"
              contentFit="cover"
            />
            <Text
              className="text-primary font-ubold text-sm text-center w-32 px-1"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {plate.plate_title}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <CustomModal isVisible={isModalVisible} onClose={toggleModal}>
        <View className="content-center items-center">
          <Image
            source={{ uri: `data:image/png;base64,${plate.plate_img}` }}
            className="w-[310] h-[155] rounded-2xl"
            contentFit="cover"
          />
          <Text className="text-primary font-ubold text-2xl text-center mt-2">
            {plate.plate_title}
          </Text>
          {plateLocation && (
            <View className="flex-row items-center justify-center">
              <Text className="text-secondary text-lg font-ubold text-center">
                Seen in:{" "}
              </Text>
              <Text
                className="text-secondary text-lg font-usemibold text-center"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {plateLocation}
              </Text>
            </View>
          )}
        </View>
        <View className="flex-row justify-between w-100">
          <Button
            title={isSeen ? "Unseen" : "Seen"}
            icon={isSeen ? icons.eyeFill : icons.eye}
            handlePress={() => handleToggle(isSeen, "seen")}
            color="secondary"
            containerStyle="mt-2 flex-1 mr-2"
            textStyle={"text-lg"}
            disabled={isLoading}
          />
          <Button
            title={isFavorite ? "Unfavorite" : "Favorite"}
            icon={isFavorite ? icons.starFill : icons.star}
            handlePress={() => handleToggle(isFavorite, "favorite")}
            color="secondary"
            containerStyle="mt-2 flex-1 ml-2"
            textStyle={"text-lg"}
            disabled={false}
          />
        </View>
      </CustomModal>
    </>
  );
};

export default LicensePlateCard;
