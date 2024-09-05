import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { searchLicensePlates } from "../../services/licensePlateService";
import Button from "../../components/Button";
import CustomTextInput from "../../components/CustomTextInput";
import LicensePlateCard from "../../components/LicensePlateCard";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }
    try {
      const data = await searchLicensePlates(query);
      setResults(data.data);
    } catch (error) {
      console.error("Error searching license plates:", error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="p-4">
        <CustomTextInput
          label="Search License Plate"
          placeHolder="Search"
          handleChangeText={setQuery}
          value={query}
        />
        {results.length === 0 && query.trim() !== "" && (
          <Text className="text-accent">No plates found. Change your search.</Text>
        )}
        <FlatList
          data={results}
          keyExtractor={(item) =>
            item.id
          }
          renderItem={({ item }) => <LicensePlateCard plate={item} />}
        />
      </View>
    </SafeAreaView>
  );
};

export default Search;