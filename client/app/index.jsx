import { Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, router } from 'expo-router';

export default function App() {
  // return (
  //   <SafeAreaView className="bg-primary h-full">
  //     <View className="flex items-center justify-center h-full">
  //       <Text className="text-white">Hello, world!</Text>
  //     </View>
  //   </SafeAreaView>
  // );

  
  return <Redirect href="/home" />;
}
