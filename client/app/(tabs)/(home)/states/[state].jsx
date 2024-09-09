import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import StateFolder from "../../../../components/StateFolder";
import LicensePlateCard from "../../../../components/LicensePlateCard";
import { getLicensePlatesByState } from "../../../../services/licensePlateService";
import Button from "../../../../components/Button";
import { Flow } from "react-native-animated-spinkit";
import { useGlobalContext } from "../../../../context/AuthContext";
import { getLicensePlatesByUser } from "../../../../services/userLicensePlateService";

const State = () => {
  const params = useLocalSearchParams();
  let state = JSON.parse(decodeURIComponent(params.state));

  const { user } = useGlobalContext();
  const [userLicensePlates, setUserLicensePlates] = useState([]);
  const [licensePlates, setLicensePlates] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchUserLicensePlates();
    fetchLicensePlates();
  }, [page]);

  const fetchUserLicensePlates = async () => {
    try {
      const user_license_plates = await getLicensePlatesByUser(user.id);
      setUserLicensePlates(user_license_plates);
    } catch (error) {
      console.error("Error fetching user license plates:", error);
    }
  };

  const fetchLicensePlates = async () => {
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

  const getLicensePlateStatus = (plateId) => {
    const plate = userLicensePlates.find((p) => p.id === plateId);
    return plate
      ? { isSeen: plate.seen, isFavorite: plate.favorite }
      : { isSeen: false, isFavorite: false };
  };

  return (
    <SafeAreaView className="bg-primary h-full flex items-start justify-start p-4 ">
      <View className="w-[100%] mt-[-58]">
        <StateFolder state={state} />
      </View>
      <View className="w-[100%] h-[100%] mt-4 flex-1 mb-[-50]">
        {licensePlates.length > 0 ? (
          <FlatList
            data={licensePlates}
            renderItem={({ item }) => {
              const { isSeen, isFavorite } = getLicensePlateStatus(item.id);
              return (
                <View style={{ paddingHorizontal: 2 }}>
                  <LicensePlateCard
                    plate={item}
                    seen={isSeen}
                    favorite={isFavorite}
                  />
                </View>
              );
            }}
            keyExtractor={(item) => item.id.toString()} // Ensure unique keys
            numColumns={3}
            contentContainerStyle={{ alignItems: "center" }}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: 10,
            }}
            onEndReached={loadMore}
            onEndReachedThreshold={0.1}
            ListFooterComponent={
              loading ? (
                <Flow className="mb-4" size={48} color="#92AD94" />
              ) : null
            }
          />
        ) : (
          <Text className="text-primary p-4">No license plates found.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default State;
