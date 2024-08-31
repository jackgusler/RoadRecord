import { View, Text, Image } from "react-native";
import { Tabs } from "expo-router";

import { icons } from "../../constants";

const TabIcon = ({ icon, iconFilled, focused }) => {
  return (
    <View>
      <Image
        source={focused ? iconFilled : icon}
        resizeMode="contain"
        style={{
          width: 32,
          height: 32,
          tintColor: focused ? "#92AD94" : "#748B75",
        }}
      />
    </View>
  );
};

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#92AD94",
        tabBarInactiveTintColor: "#748B75",
        tabBarStyle: {
          backgroundColor: "#503D42",
          borderTopColor: "transparent",
          height: 84,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={icons.house}
              iconFilled={icons.houseFill}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={icons.magnifyingGlass}
              iconFilled={icons.magnifyingGlassFill}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: "Camera",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={icons.camera}
              iconFilled={icons.cameraFill}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: "Trips",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={icons.map}
              iconFilled={icons.mapFill}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={icons.user}
              iconFilled={icons.userFill}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
