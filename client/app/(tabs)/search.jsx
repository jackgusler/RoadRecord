import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, Button, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { getLicensePlatesByState } from "../../services/licensePlateService";

const Search = () => {
  const [licensePlates, setLicensePlates] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10); // You can change this value as needed
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedState, setSelectedState] = useState("NY"); // Default state

  useEffect(() => {
    const fetchLicensePlates = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getLicensePlatesByState(
          selectedState,
          page,
          perPage
        );
        setLicensePlates(data.data); // Assuming the response has a `data` field with the license plates
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLicensePlates();
  }, [selectedState, page, perPage]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          License Plates for {selectedState}
        </Text>
        <Picker
          selectedValue={selectedState}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedState(itemValue)}
        >
          <Picker.Item label="New York" value="NY" />
          <Picker.Item label="California" value="CA" />
          <Picker.Item label="Texas" value="TX" />
          {/* Add more states as needed */}
        </Picker>
      </View>
      <FlatList
        data={licensePlates}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.plateContainer}>
            <Text style={styles.plateTitle}>{item.plate_title}</Text>
            <Text style={styles.plateName}>{item.plate_name}</Text>
            {item.plate_img && (
              <Image
                source={{ uri: `data:image/png;base64,${item.plate_img}` }}
                style={styles.plateImage}
              />
            )}
          </View>
        )}
      />
      <View style={styles.footer}>
        <Button title="Next Page" onPress={() => setPage((prev) => prev + 1)} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 16,
  },
  header: {
    padding: 16,
    backgroundColor: "#6200ea",
    borderRadius: 8,
    marginBottom: 16,
  },
  headerText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  picker: {
    height: 50,
    width: 150,
    color: "#ffffff",
    backgroundColor: "#6200ea",
  },
  loadingText: {
    color: "#6200ea",
    fontSize: 18,
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 18,
  },
  plateContainer: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  plateTitle: {
    color: "#6200ea",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  plateName: {
    color: "#333333",
    fontSize: 16,
  },
  plateImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginTop: 8,
  },
  footer: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
});

export default Search;