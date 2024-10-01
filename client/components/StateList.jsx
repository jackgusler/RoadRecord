import { SafeAreaView } from "react-native-safe-area-context";
import StateButton from "./StateButton";
import { FlatList, Image, View, Text } from "react-native";
import { icons } from "../constants";
import { Flow } from "react-native-animated-spinkit";
import { LinearGradient } from "expo-linear-gradient";
import LicensePlateCard from "./LicensePlateCard";
import CustomModal from "./CustomModal";
import SelectedLicensePlateCard from "./SelectedLicensePlateCard";
import Button from "./Button";
import { useGlobalContext } from "../context/AuthContext";
import { useEffect, useState } from "react";
import {
  batchUpdateUserLicensePlates,
  getLicensePlatesDetailsByUser,
  getLicensePlatesDetailsByUserAndState,
} from "../services/userLicensePlateService";
import {
  getAllLicensePlates,
  getLicensePlatesByState,
} from "../services/licensePlateService";
import { router } from "expo-router";
import * as Location from "expo-location";

const StateList = ({ state, type }) => {
  const { isLoading, setIsLoading, fetchLicensePlates } = useGlobalContext();

  const [page, setPage] = useState(1);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPlates, setSelectedPlates] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userSelections, setUserSelections] = useState({});

  const [licensePlates, setLicensePlates] = useState([]);

  useEffect(() => {
    if (type === "home") {
      fetchStateLicensePlates(false);
    }
  }, [page]);

  useEffect(() => {
    if (type === "profile") {
      fetchUserLicensePlates(false);
    }
  }, [state.abbreviation]);

  const fetchStateLicensePlates = async (refresh) => {
    const setLoadingState = (isLoading) => {
      if (licensePlates.length <= 0) {
        setIsLoading(isLoading);
      } else {
        setFetchLoading(isLoading);
      }
    };

    setLoadingState(true);

    try {
      const fetchData =
        state.abbreviation === "ALL"
          ? getAllLicensePlates(page, 24)
          : getLicensePlatesByState(state.abbreviation, page, 24);

      const data = await fetchData;

      if (refresh) {
        setLicensePlates(data.data);
      } else {
        setLicensePlates((prevPlates) => [...prevPlates, ...data.data]);
      }

      if (data.data.length < 24) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching license plates:", error);
    } finally {
      setLoadingState(false);
    }
  };

  const fetchUserLicensePlates = async (refresh) => {
    setIsLoading(true);
    try {
      let data;
      if (state.abbreviation === "ALL") {
        data = await getLicensePlatesDetailsByUser(page, 24);
      } else {
        data = await getLicensePlatesDetailsByUserAndState(
          state.abbreviation,
          page,
          24
        );
      }

      if (refresh) {
        setLicensePlates(data);
      } else {
        setLicensePlates((prevPlates) => [...prevPlates, ...data]);
      }

      if (data.length < 24) {
        setHasMore(false);
      }

      if (data.length === 0 && state.abbreviation !== "ALL") {
        router.back();
      }
    } catch (error) {
      console.error("Error fetching license plates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleSelectPlate = (id) => {
    setSelectedPlates((prevSelected) => {
      const newSelected = prevSelected.includes(id)
        ? prevSelected.filter((plateId) => plateId !== id)
        : [...prevSelected, id].sort((a, b) => a - b); // Ensure the list is sorted

      if (newSelected.length === 0) {
        setIsSelectionMode(false);
      }

      return newSelected;
    });
  };

  const handleLongPress = () => {
    setIsSelectionMode(true);
  };

  const handleSelectAll = () => {
    const allPlateIds = licensePlates.map((plate) => plate.id);
    setSelectedPlates(allPlateIds);
  };

  const handleDeselectAll = () => {
    setSelectedPlates([]);
    setIsSelectionMode(false);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleToggle = (plateId, type) => {
    setUserSelections((prevSelections) => ({
      ...prevSelections,
      [plateId]: {
        ...prevSelections[plateId],
        [type]: !prevSelections[plateId]?.[type],
      },
    }));
  };

  const handleConfirm = async () => {
    toggleModal();
    setIsSelectionMode(false);
    setIsLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      // Get the current location
      let coords = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords.coords;

      // Reverse geocoding to get town and state using Nominatim API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      const town =
        data.address.city || data.address.town || data.address.village;
      const state = data.address.state;
      const location = `${town}, ${state}`;

      await batchUpdateUserLicensePlates(userSelections, location);
      if (type === "profile") {
        fetchUserLicensePlates(true);
      }
      fetchLicensePlates();
      setUserSelections({});
      setSelectedPlates([]);
    } catch (error) {
      console.error("Error updating license plates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SafeAreaView
        className={`bg-primary h-full flex items-start justify-start p-4 ${type === "home" ? "mt-24" : ""}`}
      >
        <View
          className={`w-[100%] ${type === "home" ? "mt-[-32px]" : "mt-[-64px]"}`}
        >
          <Image
            source={icons.arrowLeft}
            className="absolute top-4 left-4 z-10 w-8 h-8"
            tintColor="#0B3142"
            pointerEvents="none"
          />
          <StateButton state={state} type={type} />
        </View>
        <View
          className={`w-[100%] h-[100%] flex-1 ml-1 ${type === "home" ? "mb-32" : ""}`}
        >
          {isLoading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Flow size={48} color="#92AD94" />
            </View>
          ) : licensePlates.length > 0 ? (
            <FlatList
              data={licensePlates}
              renderItem={({ item }) => {
                return (
                  <LicensePlateCard
                    plate={item}
                    handleRefresh={() => {
                      if (type === "profile") {
                        fetchUserLicensePlates(true);
                      }
                    }}
                    isSelected={selectedPlates.includes(item.id)}
                    onSelect={handleSelectPlate}
                    isSelectionMode={isSelectionMode}
                    onLongPress={handleLongPress}
                  />
                );
              }}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: "flex-start",
                gap: 3,
              }}
              onEndReached={loadMore}
              onEndReachedThreshold={0.1}
              ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
              ListHeaderComponent={() => <View style={{ paddingTop: 10 }} />}
              ListFooterComponent={
                fetchLoading ? (
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <Flow
                      className={`m-4 ${type === "home" && isSelectionMode ? "mb-20" : ""}`}
                      size={48}
                      color="#92AD94"
                    />
                  </View>
                ) : (
                  <View
                    className={`${type === "home" ? (isSelectionMode ? "mb-20" : "mb-4") : "mb-11"}`}
                  />
                )
              }
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text className="text-primary p-4">No license plates found.</Text>
          )}
        </View>
        {isSelectionMode && (
          <LinearGradient
            className={`absolute ${type === "home" ? "bottom-[168px]" : "bottom-[72px]"} left-0 right-0 p-2 mx-3 flex-row justify-between`}
            colors={["#0B314200", "#0B3142"]}
          >
            <Button
              title="Select All"
              handlePress={handleSelectAll}
              color="secondary"
              containerStyle="flex-1 mb-3"
              textStyle={"text-lg"}
            />
            <Button
              title="Deselect All"
              handlePress={handleDeselectAll}
              color="secondary"
              containerStyle="flex-1 mb-3 mx-[3]"
              textStyle={"text-lg"}
            />
            <Button
              title="Confirm"
              handlePress={() => toggleModal()}
              color="secondary"
              containerStyle="flex-1 mb-3"
              textStyle={"text-lg"}
            />
          </LinearGradient>
        )}
      </SafeAreaView>
      <CustomModal isVisible={isModalVisible} onClose={toggleModal}>
        <View className="max-h-96">
          <Text className="text-primary font-ubold text-2xl text-center">
            Selected Plates
          </Text>
          <FlatList
            data={selectedPlates}
            keyExtractor={(item) => item.toString()}
            renderItem={({ item }) => {
              const plate = licensePlates.find((p) => p.id === item);
              return (
                <SelectedLicensePlateCard
                  plate={plate}
                  userSelections={userSelections}
                  setUserSelections={setUserSelections}
                  handleToggle={handleToggle}
                />
              );
            }}
            ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
          />
          <View className="flex-row justify-between w-100">
            <Button
              title={"Save"}
              handlePress={() => handleConfirm()}
              color="secondary"
              containerStyle="mt-2 flex-1 mr-2"
              textStyle={"text-lg"}
            />
            <Button
              title={"Close"}
              handlePress={() => toggleModal()}
              color="secondary"
              containerStyle="mt-2 flex-1 ml-2"
              textStyle={"text-lg"}
            />
          </View>
        </View>
      </CustomModal>
    </>
  );
};

export default StateList;
