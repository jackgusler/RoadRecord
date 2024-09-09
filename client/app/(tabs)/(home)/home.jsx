import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import StateFolder from "../../../components/StateFolder";
import CustomTextInput from "../../../components/CustomTextInput";
import states from "../../../assets/data/states"; // Ensure correct import

const Home = () => {
  return (
    <SafeAreaView className="bg-primary h-full items-center justify-center p-4">
      <View className="flex-1 w-[100%] mb-[-50] mt-[-75]">
        <FlatList
          data={states}
          renderItem={({ item }) => <StateFolder state={item} />}
          keyExtractor={(item) => item.abbreviation}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />} // Add spacing of 10 units between items
          ListHeaderComponent={() => <View style={{ paddingTop: 16 }} />} // Add padding at the top for the first item
          ListFooterComponent={() => <View style={{ paddingBottom: 16 }} />} // Add padding at the bottom for the last item
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;