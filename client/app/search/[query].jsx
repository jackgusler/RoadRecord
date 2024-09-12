import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const Search = () => {
  const { query } = useLocalSearchParams();

  return (
    <View className="bg-primary pt-64 flex-1 content-center items-center">
      <Text>{query}</Text>
    </View>
  );
};

export default Search;
