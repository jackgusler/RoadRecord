import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import TripCard from "./TripCard";

const TripCardList = ({ trips, onDelete, onStart, onEnd }) => {
  return (
    <FlatList
      data={trips}
      renderItem={({ item }) => (
        <TripCard
          trip={item}
          onDelete={() => onDelete(item.id)}
          onStart={() => onStart(item.id)}
          onEnd={() => onEnd(item.id)}
        />
      )}
      keyExtractor={(trip) => trip.id.toString()}
      ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      ListHeaderComponent={() => <View style={{ paddingTop: 16 }} />}
      ListFooterComponent={() => <View style={{ paddingBottom: 16 }} />}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default TripCardList;