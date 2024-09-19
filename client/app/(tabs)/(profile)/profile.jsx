import React, { useCallback } from "react";
import { View, FlatList } from "react-native";
import { useGlobalContext } from "../../../context/AuthContext";

import { useFocusEffect } from "expo-router";
import StateButton from "../../../components/StateButton";
import states from "../../../assets/data/states";

const Profile = () => {
  const { userLicensePlatesDetails, fetchLicensePlates } = useGlobalContext();

  useFocusEffect(
    useCallback(() => {
      fetchLicensePlates();
    }, [])
  );

  const userStatesSet = new Set(
    userLicensePlatesDetails.map((plate) => plate.state)
  );

  const userStates = [
    { name: "All", abbreviation: "ALL" },
    ...[...userStatesSet].map((abbreviation) => {
      const state = states.find((state) => state.abbreviation === abbreviation);
      return state
        ? { name: state.name, abbreviation: state.abbreviation }
        : { name: abbreviation, abbreviation };
    }),
  ];

  return (
    <View className="bg-primary flex-1 px-4">
      <FlatList
        data={userStates}
        renderItem={({ item }) => <StateButton state={item} type={"profile"} />}
        keyExtractor={(item) => item.abbreviation}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListHeaderComponent={() => <View style={{ paddingTop: 10 }} />}
        ListFooterComponent={() => <View style={{ paddingBottom: 96 }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Profile;
