import React, { useCallback, useState } from "react";
import { View, FlatList } from "react-native";
import { useGlobalContext } from "../../../context/AuthContext";
import { useFocusEffect } from "expo-router";
import StateButton from "../../../components/StateButton";
import { getLicensePlatesStatesByUser } from "../../../services/userLicensePlateService";
import states from "../../../assets/data/states";

const Profile = () => {
  const { isLoading, setIsLoading } = useGlobalContext();
  const [userStates, setUserStates] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchUserStates = async () => {
        setIsLoading(true);
        try {
          const data = await getLicensePlatesStatesByUser();
          const mappedStates = [
            states[0], // Push states[0] initially
            ...Object.values(data).map((abbreviation) => {
              const state = states.find((state) => state.abbreviation === abbreviation);
              return state ? state : { name: "Unknown", abbreviation };
            }),
          ];
          setUserStates(mappedStates);
        } catch (error) {
          console.error("Error fetching user states:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserStates();
    }, [])
  );

  return (
    <View className="bg-primary flex-1 px-4 pt-[10]">
      <FlatList
        data={userStates}
        renderItem={({ item, index }) => (
          <View style={index === 0 ? { paddingTop: 0 } : { paddingTop: 10 }}>
            <StateButton state={item} type={"profile"} />
          </View>
        )}
        keyExtractor={(item) => item.abbreviation}
        ListFooterComponent={() => <View style={{ paddingBottom: 96 }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Profile;