import { StyleSheet, Text, View } from 'react-native';
import { CheckBox } from 'react-native-elements';
import React from 'react';

const CustomCheckBox = ({ title = '', value = false, handleToggle = () => {} }) => {
  return (
    <View>
      <CheckBox
        title={<Text className="font-amedium">{title}</Text>}
        checked={value}
        onPress={handleToggle}
        checkedColor="#92AD94"
        uncheckedColor="#92AD94"
        containerStyle={{
          backgroundColor: 'transparent',
          borderWidth: 0,
          margin: 0,
          padding: 0,
        }}
      />
    </View>
  );
};

export default CustomCheckBox;