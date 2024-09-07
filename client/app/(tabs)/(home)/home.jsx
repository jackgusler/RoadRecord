import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import StateFolder from "../../../components/StateFolder";
import CustomTextInput from "../../../components/CustomTextInput";

const Home = () => {
  const states = [
    { name: "Alaska", abbreviation: "AK" },
    { name: "Alabama", abbreviation: "AL" },
    { name: "Arkansas", abbreviation: "AR" },
    { name: "Arizona", abbreviation: "AZ" },
    { name: "California", abbreviation: "CA" },
    { name: "Colorado", abbreviation: "CO" },
    { name: "Connecticut", abbreviation: "CT" },
    { name: "District of Columbia", abbreviation: "DC" },
    { name: "Delaware", abbreviation: "DE" },
    { name: "Florida", abbreviation: "FL" },
    { name: "Georgia", abbreviation: "GA" },
    { name: "Hawaii", abbreviation: "HI" },
    { name: "Iowa", abbreviation: "IA" },
    { name: "Idaho", abbreviation: "ID" },
    { name: "Illinois", abbreviation: "IL" },
    { name: "Indiana", abbreviation: "IN" },
    { name: "Kansas", abbreviation: "KS" },
    { name: "Kentucky", abbreviation: "KY" },
    { name: "Louisiana", abbreviation: "LA" },
    { name: "Massachusetts", abbreviation: "MA" },
    { name: "Maryland", abbreviation: "MD" },
    { name: "Maine", abbreviation: "ME" },
    { name: "Michigan", abbreviation: "MI" },
    { name: "Minnesota", abbreviation: "MN" },
    { name: "Missouri", abbreviation: "MO" },
    { name: "Mississippi", abbreviation: "MS" },
    { name: "Montana", abbreviation: "MT" },
    { name: "North Carolina", abbreviation: "NC" },
    { name: "North Dakota", abbreviation: "ND" },
    { name: "Nebraska", abbreviation: "NE" },
    { name: "New Hampshire", abbreviation: "NH" },
    { name: "New Jersey", abbreviation: "NJ" },
    { name: "New Mexico", abbreviation: "NM" },
    { name: "Nevada", abbreviation: "NV" },
    { name: "New York", abbreviation: "NY" },
    { name: "Ohio", abbreviation: "OH" },
    { name: "Oklahoma", abbreviation: "OK" },
    { name: "Oregon", abbreviation: "OR" },
    { name: "Pennsylvania", abbreviation: "PA" },
    { name: "Rhode Island", abbreviation: "RI" },
    { name: "South Carolina", abbreviation: "SC" },
    { name: "South Dakota", abbreviation: "SD" },
    { name: "Tennessee", abbreviation: "TN" },
    { name: "Texas", abbreviation: "TX" },
    { name: "Utah", abbreviation: "UT" },
    { name: "Virginia", abbreviation: "VA" },
    { name: "Vermont", abbreviation: "VT" },
    { name: "Washington", abbreviation: "WA" },
    { name: "Wisconsin", abbreviation: "WI" },
    { name: "West Virginia", abbreviation: "WV" },
    { name: "Wyoming", abbreviation: "WY" },
  ];

  return (
    <SafeAreaView className="bg-primary h-full items-center justify-center p-4">
      <CustomTextInput
        placeholder="Search"
        handleChangeText={() => {}}
        value=""
        secureTextEntry={false}
        returnKeyType="done"
        onSubmitEditing={() => {}}
        containerStyles="w-[100%] mb-4"
        inputStyles="h-10 bg-primary"
        textColor="#F5FBEF"
      />
      <View className="flex-1 w-[100%] mb-[-50]">
        <FlatList
          data={states}
          renderItem={({ item }) => <StateFolder state={item} />}
          keyExtractor={(item) => item.abbreviation}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />} // Add spacing of 10 units between items
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
