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
import { useGlobalContext } from "../context/AuthContext";

const LicensePlateCard = ({ plate }) => {
  const { userLicensePlates, fetchLicensePlates, isLoading } =
    useGlobalContext();

  const [isFavorite, setIsFavorite] = useState();
  const [isSeen, setIsSeen] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const favorite = userLicensePlates.find(
      (lp) => lp.license_plate_id === plate.id && lp.favorite
    );
    setIsFavorite(favorite ? true : false);
    const seen = userLicensePlates.find(
      (lp) => lp.license_plate_id === plate.id && lp.seen
    );
    setIsSeen(seen ? true : false);
  }, [userLicensePlates]);

  const handleToggle = async (isToggled, toggleType) => {
    try {
      if (toggleType === "favorite") {
        if (isToggled) {
          await userLP.unfavoriteLicensePlate(plate.id);
          setIsFavorite(false);
        } else {
          await userLP.favoriteLicensePlate(plate.id);
          setIsFavorite(true);
        }
      } else if (toggleType === "seen") {
        if (isToggled) {
          await userLP.unseenLicensePlate(plate.id);
          setIsSeen(false);
        } else {
          await userLP.seenLicensePlate(plate.id);
          setIsSeen(true);
        }
      }
    } catch (error) {
      Alert.alert("Error", `Failed to toggle ${toggleType} status.`);
    }
    fetchLicensePlates();
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
                    title={isSeen ? "Unseen" : "Seen"}
                    icon={isSeen ? icons.eyeFill : icons.eye}
                    handlePress={() => handleToggle(isSeen, "seen")}
                    color="secondary"
                    containerStyle="mt-2 flex-1 mr-2"
                    textSyle=""
                    disabled={isLoading}
                  />
                  <Button
                    title={isFavorite ? "Unfavorite" : "Favorite"}
                    icon={isFavorite ? icons.starFill : icons.star}
                    handlePress={() => handleToggle(isFavorite, "favorite")}
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
