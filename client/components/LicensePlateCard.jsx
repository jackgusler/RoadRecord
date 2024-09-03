import React from 'react';
import { View, Text, Image } from 'react-native';

const LicensePlateCard = ({ plate }) => {
  return (
    <View className="p-4 mb-4 bg-accent rounded-lg shadow-lg">
      <Text className="text-dark font-abold text-lg mb-2">{plate.plate_title}</Text>
      <Text className="text-secondary mb-1">State: {plate.state}</Text>
      <Image
        source={{ uri: `data:image/png;base64,${plate.plate_img}` }}
        className="w-32 h-16 rounded mb-2"
      />
      <Text className="text-secondary">Plate Name: {plate.plate_name}</Text>
    </View>
  );
};

export default LicensePlateCard;