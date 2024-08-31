import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFocusEffect } from '@react-navigation/native';

const CameraScreen = () => {
  const [facing, setFacing] = useState("back"); // Camera facing (back or front)
  const [permission, requestPermission] = useCameraPermissions(); // Camera permissions
  const [isCameraActive, setIsCameraActive] = useState(false); // Camera active status
  const [zoom, setZoom] = useState(0); // Zoom level

  useFocusEffect(
    React.useCallback(() => {
      // When the screen is focused, activate the camera
      setIsCameraActive(true);

      // When the screen is unfocused, deactivate the camera
      return () => setIsCameraActive(false);
    }, [])
  );

  useEffect(() => {
    // Cleanup function to deactivate the camera when the component unmounts
    return () => {
      setIsCameraActive(false);
    };
  }, []);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions not granted yet
    return (
      <SafeAreaView className="bg-primary h-full">
        <View className="flex items-center justify-center h-full">
          <Text className="text-accent">
            We need your permission to show the camera
          </Text>
          <TouchableOpacity
            onPress={requestPermission}
            className="mt-4 p-2 bg-secondary rounded"
          >
            <Text className="text-white">Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const zoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.01, 1)); // Increase zoom, max 1
  };

  const zoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.01, 0)); // Decrease zoom, min 0
  };

  return (
    <View className="flex-1">
      {isCameraActive && (
        <CameraView 
          style={{ flex: 1 }} 
          type={facing === "back" ? "back" : "front"}
          zoom={zoom} // Set the zoom level here
        >
          <View className="absolute bottom-0 left-0 right-0 flex-row justify-between p-4">
            <TouchableOpacity onPress={toggleCameraFacing}>
              <Text className="text-2xl font-bold text-white">Flip Camera</Text>
            </TouchableOpacity>
            <View className="flex-row">
              <TouchableOpacity onPress={zoomOut} className="mr-4">
                <Text className="text-2xl font-bold text-white">-</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={zoomIn}>
                <Text className="text-2xl font-bold text-white">+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      )}
    </View>
  );
};

export default CameraScreen;