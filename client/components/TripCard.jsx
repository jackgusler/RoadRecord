import { Image, StyleSheet, Text, View } from "react-native";
import { icons } from "../constants";
import IconButton from "./IconButton";
import { Swipeable } from "react-native-gesture-handler";
import Button from "./Button";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";

const TripCard = ({ trip, onDelete }) => {
  const renderRightActions = () => {
    return (
      <View
        className="bg-muted border-2 border-secondary  rounded-xl flex-row items-center justify-end mr-4"
      >
        <Button
          title="Delete"
          handlePress={() => onDelete(trip.id)} // Handling the delete action
          color="secondary"
          containerStyle="w-20 h-14 mx-2"
          textStyle="text-lg"
        />
      </View>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
    >
      <LinearGradient
        colors={["#748B75", "#748B75", "#92AD94", "#92AD94"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="h-20 mx-4 border-2 border-transparent rounded-xl"
      >
        <View className="w-full bg-muted border-secondary rounded-xl flex-row">
          <View className="w-[50%]">
            <View className="flex-1">
              <View className="px-4 py-1 bg-accent rounded-br-3xl rounded-tl-xl h-full justify-center">
                <Text
                  className="text-secondary text-3xl font-ubold"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {trip.name}
                </Text>
              </View>
            </View>
            <View className="flex-1">
              <View className="p-2 bg-secondary rounded-tr-3xl rounded-bl-xl flex-row items-center h-full">
                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    alignItems: "center",
                  }}
                >
                  <Text
                    className="text-accent text-base font-usemibold"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ flexShrink: 1 }}
                  >
                    {trip.starting_location}
                  </Text>
                  <Image
                    source={icons.arrowRightRegular}
                    className="w-4 h-4 mx-1 mt-[2]"
                    tintColor={"#F5FBEF"}
                  />
                  <Text
                    className="text-accent text-base font-usemibold"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ flexShrink: 1 }}
                  >
                    {trip.ending_location}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="w-[50%] relative ">
            <View className="h-1/2 bg-accent rounded-r-3xl"></View>
            <View className="h-1/2 bg-secondary rounded-r-3xl"></View>
            <View className="w-full h-full bg-muted rounded-l-[22px] rounded-r-xl absolute inset-0 flex-row items-center justify-evenly py-2">
              {!trip.started ? (
                <Button
                  title="Start Trip"
                  handlePress={() => {}}
                  color="secondary"
                  containerStyle="w-20 h-14"
                  textStyle="text-lg"
                />
              ) : trip.started && !trip.ended ? (
                <Button
                  title="End Trip"
                  handlePress={() => {}}
                  color="secondary"
                  containerStyle="w-20 h-14"
                  textStyle="text-lg"
                />
              ) : null}
              <Button
                title="Details"
                handlePress={() => {}}
                color="secondary"
                containerStyle="w-20 h-14"
                textStyle="text-lg"
              />
            </View>
          </View>
        </View>
      </LinearGradient>
    </Swipeable>
  );
};

export default TripCard;
