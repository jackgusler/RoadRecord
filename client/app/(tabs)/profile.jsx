import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex items-center justify-center h-full">
        <Text className="text-accent">Profile</Text>
      </View>
    </SafeAreaView>
  )
}

export default Profile