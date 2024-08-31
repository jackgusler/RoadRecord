import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUsers } from '../../services/userService'; // Adjust the path to your service file

const Profile = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        setError('Error fetching users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
      <View className="flex-1 p-4">
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="p-4 mb-2 bg-white rounded shadow">
              <Text className="text-lg font-semibold">{item.name}</Text>
              <Text className="text-gray-600">{item.email}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Profile;
