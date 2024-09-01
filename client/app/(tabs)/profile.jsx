import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/Button";
import { router } from "expo-router";
import { getUsers } from "../../services/userService";
import { signOut } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { setIsLoggedIn } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        setError("Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsLoggedIn(false);
      router.replace("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-primary h-full flex items-center justify-center">
        <Text className="text-accent">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="bg-primary h-full flex items-center justify-center">
        <Text className="text-accent">{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="p-4">
        <Button
          title="Sign out"
          handlePress={handleSignOut}
          color="secondary"
        />
      </View>
      <View className="flex-1 p-4">
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="p-4 mb-4 bg-accent rounded-lg shadow-lg">
              <Text className="text-dark font-abold text-lg mb-2">
                {item.username}
              </Text>
              <Text className="text-secondary mb-1">
                Name: {item.first_name} {item.last_name}
              </Text>
              <Image
                source={{ uri: `data:image/png;base64,${item.profile_img}` }}
                className="w-16 h-16 rounded-full mb-2"
              />
              <Text className="text-secondary mb-1">Email: {item.email}</Text>
              <Text className="text-secondary mb-1">Password: ••••••••</Text>
              <Text className="text-secondary mb-1">
                Created At: {item.created_at}
              </Text>
              <Text className="text-secondary">
                Updated At: {item.updated_at}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Profile;
