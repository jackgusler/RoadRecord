import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import IconButton from "./IconButton";
import Button from "./Button";
import { icons } from "../constants";
import * as userLP from "../services/userLicensePlateService";
import { useGlobalContext } from "../context/AuthContext";

const LicensePlateCard = ({ plate }) => {
  const { user } = useGlobalContext();
  const [userLicensePlates, setUserLicensePlates] = useState([]);
  const [textDimensions, setTextDimensions] = useState({ width: 0, height: 0 });
  const [isFavorite, setIsFavorite] = useState(plate.favorite);
  const [isSeen, setIsSeen] = useState(plate.seen);

  useEffect(() => {
    const fetchUserLicensePlates = async () => {
      try {
        const user_license_plates = await userLP.getLicensePlatesByUser(user.id);
        setUserLicensePlates(user_license_plates);
      } catch (error) {
        console.error("Error fetching user license plates:", error);
      }
    };

    fetchUserLicensePlates();
  }, [user.id]);

  useEffect(() => {
    const userLicensePlate = userLicensePlates.find(
      (ulp) => ulp.license_plate_id === plate.id
    );

    if (userLicensePlate) {
      setIsFavorite(userLicensePlate.favorite);
      setIsSeen(userLicensePlate.seen);
    } else {
      setIsFavorite(plate.favorite);
      setIsSeen(plate.seen);
    }
  }, [plate, userLicensePlates]);

  const handleFavoriteToggle = async () => {
    try {
      if (isFavorite) {
        await userLP.unfavoriteLicensePlate(plate.id);
        setIsFavorite(false);
      } else {
        await userLP.favoriteLicensePlate(plate.id);
        setIsFavorite(true);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to toggle favorite status.");
    }
  };

  const handleSeenToggle = async () => {
    try {
      if (isSeen) {
        await userLP.unseenLicensePlate(plate.id);
        setIsSeen(false);
      } else {
        await userLP.seenLicensePlate(plate.id);
        setIsSeen(true);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to toggle seen status.");
    }
  };

  return (
    <View className="mb-4 bg-accent rounded-3xl shadow-lg justify-center items-center overflow-hidden w-full h-[225px] p-4">
      <Text
        className="text-[500px] font-bold text-center text-primary absolute top-[112.5] left-[200] opacity-20"
        style={{
          transform: [
            { translateX: -textDimensions.width / 2 },
            { translateY: -textDimensions.height / 2 },
          ],
        }}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          setTextDimensions({ width, height });
        }}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {plate.state}
      </Text>
      <Image
        source={{ uri: `data:image/png;base64,${plate.plate_img}` }}
        className="w-[200px] h-[100px] rounded-[10px] border-4 border-primary mb-2"
      />

      <Text
        className="text-primary font-abold text-lg text-center"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {plate.plate_title}
      </Text>

      <Button
        title={isSeen ? "Mark as unseen" : "Mark as seen"}
        handlePress={handleSeenToggle}
        color="secondary"
        containerStyle="mt-2 w-full"
        textSyle=""
        disabled={false}
      />

      <View className="absolute top-0 right-0 p-4">
        <IconButton
          icon={isFavorite ? icons.starFill : icons.star}
          handlePress={handleFavoriteToggle}
          positionStyles=""
        />
      </View>
    </View>
  );
};

export default LicensePlateCard;