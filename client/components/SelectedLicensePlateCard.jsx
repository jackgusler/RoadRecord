import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context/AuthContext";
import Button from "./Button";
import { icons } from "../constants";

const SelectedLicensePlateCard = ({ plate, userSelections, setUserSelections, handleToggle }) => {
  const { userLicensePlates } = useGlobalContext();
  const [isSeen, setIsSeen] = useState();
  const [isFavorite, setIsFavorite] = useState();

  useEffect(() => {
    const favorite = userLicensePlates.find(
      (lp) => lp.license_plate_id === plate.id && lp.favorite
    );
    setIsFavorite(favorite ? true : false);
    const seen = userLicensePlates.find(
      (lp) => lp.license_plate_id === plate.id && lp.seen
    );
    setIsSeen(seen ? true : false);

    userSelections[plate.id] = {
      favorite: favorite ? true : false,
      seen: seen ? true : false,
    };

    setUserSelections(userSelections);

  }, [userLicensePlates]);

  useEffect(() => {
    if (userSelections[plate.id]) {
      setIsSeen(userSelections[plate.id].seen);
      setIsFavorite(userSelections[plate.id].favorite);
    }
  }, [userSelections]);

  return (
    <View className="bg-muted rounded-lg relative flex-row items-center ">
      <View className="w-1/3 p-1">
        <Image
          source={{ uri: `data:image/png;base64,${plate.plate_img}` }}
          className="h-12 rounded-lg"
          contentFit="cover"
        />
        <Text
          className="text-accent font-ubold text-xs text-center px-1"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {plate.plate_title}
        </Text>
      </View>
      <View className="flex-row justify-between w-2/3 px-1">
        <Button
          title={isSeen ? "Unseen" : "Seen"}
          icon={isSeen ? icons.eyeFill : icons.eye}
          handlePress={() => handleToggle(plate.id, "seen")}
          color="secondary"
          containerStyle="w-22 h-14"
          textSyle={"text-sm"}
        />
        <Button
          title={isFavorite ? "Unfavorite" : "Favorite"}
          icon={isFavorite ? icons.starFill : icons.star}
          handlePress={() => handleToggle(plate.id, "favorite")}
          color="secondary"
          containerStyle="w-22 h-14"
          textSyle={"text-sm"}
        />
      </View>
    </View>
  );
};

export default SelectedLicensePlateCard;
