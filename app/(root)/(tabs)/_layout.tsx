import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            backgroundColor: "#3470E4",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: 70,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
            paddingTop: 5,
          },
          default: {
            position: "absolute",
            left: 10,
            right: 10,
            backgroundColor: "#3470E4",
            borderRadius: 15,
            padding: 10,
            height: 70,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
          },
        }),
        tabBarActiveTintColor: "#ffff", // Color for active tab
        tabBarInactiveTintColor: "#fffffff", // Color for inactive tab
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="compass-outline"
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: "Jarvis",
          tabBarIcon: ({ color }) => (
            <Entypo
              name="500px"
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="servicesnew"
        options={{
          title: "Services New",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="work-outline" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-circle"
              size={26}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
