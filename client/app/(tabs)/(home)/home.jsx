import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import StateFolder from "../../../components/StateButton";
import states from "../../../assets/data/states";

const Home = () => {
  return (
    <View className="bg-primary flex-1 w-full h-full px-4">
      <FlatList
        data={states}
        renderItem={({ item }) => <StateFolder state={item} />}
        keyExtractor={(item) => item.abbreviation}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListHeaderComponent={() => <View style={{ paddingTop: 138 }} />}
        ListFooterComponent={() => <View style={{ paddingBottom: 94 }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Home;