import { useLocalSearchParams } from "expo-router";
import { View, Text, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import StateButton from "../../../../components/StateButton";
import LicensePlateCard from "../../../../components/LicensePlateCard";
import { Flow } from "react-native-animated-spinkit";
import { useGlobalContext } from "../../../../context/AuthContext";
import { icons } from "../../../../constants";

const State = () => {
  const params = useLocalSearchParams();
  let state = JSON.parse(decodeURIComponent(params.state));

  const { userLicensePlatesDetails } = useGlobalContext();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [plates, setPlates] = useState([]);

  //   useEffect(() => {
  //     fetchLicensePlates();
  //   }, [page]);

  useEffect(() => {
    if (state.abbreviation === "ALL") {
      setPlates(
        [...userLicensePlatesDetails].sort((a, b) =>
          a.plate_title.localeCompare(b.plate_title)
        )
      );
    } else {
      setPlates(
        userLicensePlatesDetails.filter(
          (plate) => plate.state === state.abbreviation
        )
      );
    }
  }, [state.abbreviation, userLicensePlatesDetails]);

  const loadMore = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full flex items-start justify-start p-4">
      <View className="w-[100%] mt-[-64]">
        <Image
          source={icons.arrowLeft}
          className="absolute top-4 left-4 z-10 w-8 h-8"
          tintColor="#0B3142"
          pointerEvents="none"
        />
        <StateButton state={state} type={"profile"} />
      </View>
      <View className="w-[100%] h-[100%] flex-1 ml-1">
        {plates.length > 0 ? (
          <FlatList
            data={plates}
            renderItem={({ item }) => {
              return <LicensePlateCard plate={item} />;
            }}
            keyExtractor={(item) => item.id.toString()} // Ensure unique keys
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
                  <Flow className="m-4" size={48} color="#92AD94" />
                </View>
              ) : (
                <View className="mb-11" />
              )
            }
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Text className="text-primary p-4">No license plates found.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default State;
