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
import { batchUpdateLicensePlates } from "../services/userLicensePlateService";
import { getLicensePlatesByState } from "../services/licensePlateService";

const StateList = ({ state, type }) => {
  const { userLicensePlatesDetails, fetchLicensePlates } = useGlobalContext();

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPlates, setSelectedPlates] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userSelections, setUserSelections] = useState({});

  const [licensePlates, setLicensePlates] = useState([]);

  useEffect(() => {
    if (type === "home") {
      fetchStateLicensePlates();
    }
  }, [page]);

  useEffect(() => {
    if (type === "profile") {
      if (state.abbreviation === "ALL") {
        setLicensePlates(
          [...userLicensePlatesDetails].sort((a, b) =>
            a.plate_title.localeCompare(b.plate_title)
          )
        );
      } else {
        setLicensePlates(
          userLicensePlatesDetails.filter(
            (plate) => plate.state === state.abbreviation
          )
        );
      }
    }
  }, [state.abbreviation, userLicensePlatesDetails]);

  const fetchStateLicensePlates = async () => {
    setLoading(true);
    try {
      const data = await getLicensePlatesByState(state.abbreviation, page, 24);
      setLicensePlates((prevPlates) => [...prevPlates, ...data.data]);
      if (data.data.length < 24) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching license plates:", error);
    } finally {
      setLoading(false);
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
        : [...prevSelected, id];

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

  const handleConfirm = () => {
    setLoading(true);
    try {
      batchUpdateLicensePlates(userSelections);
      fetchLicensePlates();
      toggleModal();
      setUserSelections({});
      setSelectedPlates([]);
      setIsSelectionMode(false);
    } catch (error) {
      console.error("Error updating license plates:", error);
    } finally {
      setLoading(false);
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
          {licensePlates.length > 0 ? (
            <FlatList
              data={licensePlates}
              renderItem={({ item }) => {
                return (
                  <LicensePlateCard
                    plate={item}
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
                loading ? (
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
            className={`absolute bottom-[${type === "home" ? 168 : 72}] left-0 right-0 p-2 mx-3 flex-row justify-between`}
            colors={["#0B314200", "#0B3142"]}
          >
            <Button
              title="Select All"
              handlePress={handleSelectAll}
              color="secondary"
              containerStyle="flex-1 mb-3"
              textSyle={"text-lg"}
            />
            <Button
              title="Deselect All"
              handlePress={handleDeselectAll}
              color="secondary"
              containerStyle="flex-1 mb-3 mx-[3]"
              textSyle={"text-lg"}
            />
            <Button
              title="Confirm"
              handlePress={() => toggleModal()}
              color="secondary"
              containerStyle="flex-1 mb-3"
              textSyle={"text-lg"}
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
            keyExtractor={(item) => item.id.toString()}
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
              textSyle={"text-lg"}
            />
            <Button
              title={"Close"}
              handlePress={() => toggleModal()}
              color="secondary"
              containerStyle="mt-2 flex-1 ml-2"
              textSyle={"text-lg"}
            />
          </View>
        </View>
      </CustomModal>
    </>
  );
};

export default StateList;
