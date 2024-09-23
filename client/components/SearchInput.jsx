import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Keyboard,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter, useSegments } from "expo-router";
import { icons } from "../constants";
import CustomTextInput from "./CustomTextInput";
import Button from "./Button";
import { Picker } from "@react-native-picker/picker";
import CustomCheckBox from "./CustomCheckBox";
import states from "../assets/data/states";
import { useNavigation } from "@react-navigation/native";

const SearchInput = ({ initialQuery }) => {
  const pathName = usePathname();
  const [query, setQuery] = useState(initialQuery || "");
  const [isFocused, setIsFocused] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedState, setSelectedState] = useState(null);
  const [sortBySeen, setSortBySeen] = useState(false);
  const [sortByFavorite, setSortByFavorite] = useState(false);

  const router = useRouter();
  const segments = useSegments();
  const navigation = useNavigation();

  // Show back arrow only on /search/[query] route
  const showBackArrow = segments[0] === "search" && segments.length > 1;

  const handleSearch = () => {
    if (pathName.startsWith("/search")) router.setParams({ query });
    else router.push(`/search/${query}`);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleStateChange = (itemValue) => {
    const state = states.find((state) => state.abbreviation === itemValue);
    setSelectedState(state);
  };

  const goBack = () => {
    if (isFocused) {
      Keyboard.dismiss();
    } else {
      router.back();
      Keyboard.dismiss();
    }
    setQuery("");
    setSelectedState(null);
    setSortBySeen(false);
    setSortByFavorite(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      // This event is triggered when the user navigates back
      console.log("Navigated back using gesture");
      // Call your method here
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View className="w-full flex-row">
      {(showBackArrow || isFocused) && (
        <TouchableOpacity className="mt-2 mr-2" onPress={() => goBack()}>
          <Image
            source={icons.arrowLeft}
            className="w-8 h-8"
            tintColor="#92AD94"
          />
        </TouchableOpacity>
      )}
      <View style={{ flex: 1 }}>
        <CustomTextInput
          placeholder="Search"
          handleChangeText={setQuery}
          value={query}
          secureTextEntry={false}
          returnKeyType="done"
          onSubmitEditing={handleSearch}
          containerStyles="w-full mb-4"
          inputStyles="h-10 text-accent"
          search={true}
          onFocus={() => setIsFocused(true)} // Pass onFocus prop
          onBlur={() => setIsFocused(false)} // Pass onBlur prop
        >
          {({ isFocused }) => (
            <>
              <View className="h-full items-center border-l-2 border-secondary">
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

              <View className="h-full items-center border-x-2 border-secondary">
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
                className="h-full items-center bg-muted border-secondary"
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
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View className="w-[350] bg-accent rounded-lg p-4">
                <Text className="text-primary font-ubold text-2xl text-center mt-2">
                  Filter Options
                </Text>
                <Picker
                  selectedValue={
                    selectedState ? selectedState.abbreviation : null
                  }
                  onValueChange={handleStateChange}
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
                    textSyle={"text-lg"}
                    disabled={false}
                  />
                  <Button
                    title="Close"
                    handlePress={toggleModal}
                    color="secondary"
                    containerStyle="mt-2 flex-1 ml-2"
                    textSyle={"text-lg"}
                    disabled={false}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
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
