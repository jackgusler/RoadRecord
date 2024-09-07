import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { Image } from "expo-image";
import Button from "./Button";
import { icons } from "../constants";
import * as userLP from "../services/userLicensePlateService";

const LicensePlateCard = ({ plate, seen, favorite }) => {
  const [isFavorite, setIsFavorite] = useState(favorite);
  const [isSeen, setIsSeen] = useState(seen);
  const [modalVisible, setModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;

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

  const toggleModal = () => {
    if (modalVisible) {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setModalVisible(false);
        setIsModalVisible(false);
      });
    } else {
      setModalVisible(true);
      setIsModalVisible(true);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    if (modalVisible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsModalVisible(false));
    }
  }, [modalVisible]);

  return (
    <>
      <TouchableOpacity onPress={toggleModal}>
        <View className="bg-accent rounded-lg">
          <Image
            source={{ uri: `data:image/png;base64,${plate.plate_img}` }}
            className="w-32 h-16 rounded-lg grayscale-"
            contentFit="cover"
            blurRadius={0.5}
          />
          <Text
            className="text-primary font-abold text-sm text-center w-32 px-1"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {plate.plate_title}
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback onPress={toggleModal}>
          <Animated.View style={[styles.modalBackground, { opacity }]}>
            <TouchableWithoutFeedback>
              <View className="w-[350] bg-accent rounded-lg p-4">
                <View className="content-center items-center">
                  <Image
                    source={{ uri: `data:image/png;base64,${plate.plate_img}` }}
                    className="w-[310] h-[155] rounded-2xl"
                    contentFit="cover"
                    blurRadius={50}
                  />
                  <Text className="text-primary font-abold text-2xl text-center mt-2">
                    {plate.plate_title}
                  </Text>
                </View>
                <View className="flex-row justify-between w-100">
                  <Button
                    title={isSeen ? "Mark as unseen" : "Mark as seen"}
                    handlePress={handleSeenToggle}
                    color="secondary"
                    containerStyle="mt-2 flex-1 mr-2"
                    textSyle=""
                    disabled={false}
                  />
                  <Button
                    title={isFavorite ? "Unfavorite" : "Favorite"}
                    icon={isFavorite ? icons.starFill : icons.star}
                    handlePress={handleFavoriteToggle}
                    color="secondary"
                    containerStyle="mt-2 flex-1 ml-2"
                    textSyle=""
                    disabled={false}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export default LicensePlateCard;
