import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Keyboard,
  Modal,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import CustomTextInput from "./CustomTextInput";
import { router, usePathname } from "expo-router";
import { icons } from "../constants";
import Button from "./Button";
import { Picker } from "@react-native-picker/picker";
import CustomCheckBox from "./CustomCheckBox";
import states from "../assets/data/states";

const SearchInput = ({ initialQuery }) => {
  const pathName = usePathname();
  const [query, setQuery] = useState(initialQuery || "");
  const [isFocused, setIsFocused] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;

  const [selectedState, setSelectedState] = useState();
  const [sortBySeen, setSortBySeen] = useState(false);
  const [sortByFavorite, setSortByFavorite] = useState(false);

  const handleSearch = () => {
    if (query === "")
      return Alert.alert(
        "Missing Query",
        "Please input something to search results across database"
      );

    if (pathName.startsWith("/search")) router.setParams({ query });
    else router.push(`/search/${query}`);
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
    <View className="w-full">
      <CustomTextInput
        placeholder="Search"
        handleChangeText={setQuery}
        value={query}
        secureTextEntry={false}
        returnKeyType="done"
        onSubmitEditing={handleSearch}
        containerStyles="w-[100%] mb-4"
        inputStyles="h-10 bg-primary text-accent"
        search={true}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        {({ isFocused }) => (
          <>
            <View
              className={`h-full items-center border-l-2 ${
                isFocused ? "border-secondary" : "border-muted"
              }`}
            >
              <TouchableOpacity
                className="bg-muted"
                onPress={() => setQuery("")}
              >
                <Image
                  source={icons.xFill}
                  className="w-6 h-6 m-2"
                  tintColor={"#0B3142"}
                />
              </TouchableOpacity>
            </View>

            <View
              className={`h-full items-center border-x-2 ${
                isFocused ? "border-secondary" : "border-muted"
              }`}
            >
              <TouchableOpacity
                className="bg-muted"
                onPress={() => {
                  handleSearch();
                  Keyboard.dismiss();
                }}
              >
                <Image
                  source={icons.magnifyingGlassFill}
                  className="w-6 h-6 m-2"
                  tintColor={"#0B3142"}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className={`h-full items-center bg-muted ${
                isFocused ? "border-secondary" : "border-muted"
              }`}
              onPress={toggleModal}
            >
              <Image
                source={icons.slidersFill}
                className="w-6 h-6 m-2"
                tintColor={"#0B3142"}
              />
            </TouchableOpacity>
          </>
        )}
      </CustomTextInput>

      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback onPress={toggleModal}>
          <Animated.View style={[styles.modalBackground, { opacity }]}>
            <TouchableWithoutFeedback>
              <View className="w-[350] bg-accent rounded-lg p-4">
                <Text className="text-primary font-abold text-2xl text-center mt-2">
                  Filter Options
                </Text>
                <Picker
                  selectedValue={selectedState}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedState(itemValue)
                  }
                >
                  <Picker.Item label="Select State" value={null} />
                  {states.map((state) => (
                    <Picker.Item
                      key={state.abbreviation}
                      label={state.name}
                      value={state.abbreviation}
                    />
                  ))}
                </Picker>
                <View className="flex-row justify-between w-100 mt-4">
                  <View className="flex-row items-center">
                    <CustomCheckBox
                      title={"Sort by Seen"}
                      value={sortBySeen}
                      handleToggle={() => setSortBySeen(!sortBySeen)}
                    />
                  </View>
                  <View className="flex-row items-center">
                    <CustomCheckBox
                      title={"Sort by Favorite"}
                      value={sortByFavorite}
                      handleToggle={() => setSortByFavorite(!sortByFavorite)}
                    />
                  </View>
                </View>
                <View className="flex-row justify-between w-100 mt-4">
                  <Button
                    title="Save"
                    handlePress={toggleModal}
                    color="secondary"
                    containerStyle="mt-2 flex-1 mr-2"
                    textSyle=""
                    disabled={false}
                  />
                  <Button
                    title="Close"
                    handlePress={toggleModal}
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
    </View>
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

export default SearchInput;
