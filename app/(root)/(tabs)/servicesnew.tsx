import { CustomTextInput } from "@/components/CustomTextInput";
import ServiceCard from "@/components/ServiceCard";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

const servicesData = [
  {
    id: "1",
    name: "Emergency Alert",
    iconName: "emergency",
    description:
      "Quickly send distress signals to local emergency services or designated contacts with your exact location.",
    category: "Safety & Security",
    navigation: "/(services)/emergency-alert-screen",
  },
  {
    id: "2",
    name: "Incident Reporting",
    iconName: "report-problem",
    description:
      "Report crimes, accidents, or suspicious activities in real-time, integrated with local law enforcement.",
    category: "Safety & Security",
    navigation: "/(services)/incident-reporting-screen",
  },
  {
    id: "4",
    name: "Community Watch",
    iconName: "groups",
    description:
      "Share and access verified safety information within your community for a collective security network.",
    category: "Safety & Security",
    navigation: "/(services)/community-watch-screen",
  },
  {
    id: "5",
    name: "Local Directory",
    iconName: "business",
    description:
      "Discover local businesses and services with reviews, ratings, and special offers.",
    navigation: "/(services)/services",
  },
  {
    id: "6",
    name: "Public Places",
    iconName: "place",
    description:
      "Explore public facilities like parks, libraries, and museums with hours, events, and accessibility info.",
    category: "Local Services",
    navigation: "/(services)/public-places-screen",
  },
  {
    id: "7",
    name: "Transport Info",
    iconName: "directions-bus",
    description:
      "Access real-time public transit schedules, shared mobility options, and parking availability.",
    category: "Transportation",
    navigation: "/(services)/transport-info",
  },
  {
    id: "8",
    name: "Lost & Found",
    iconName: "search",
    description:
      "Report lost items or find claimed lost property in your area.",
    category: "Community Services",
    navigation: "/(services)/lost-and-found-screen",
  },
  {
    id: "9",
    name: "Event Calendar",
    iconName: "event",
    description:
      "Stay updated on local events, festivals, and public meetings with safety precautions and crowd management tips.",
    category: "Events",
    navigation: "/(services)/event-calendar-screen",
  },
  {
    id: "10",
    name: "Accessibility Options",
    iconName: "accessible",
    description:
      "Plan routes and find services with accessibility options for people with disabilities.",
    category: "Accessibility",
    navigation: "/(services)/accessibility-options-screen",
  },
  {
    id: "11",
    name: "Weather Updates",
    iconName: "cloud",
    description:
      "Get real-time weather updates and alerts for your city and upcoming trips.",
    category: "Weather",
    navigation: "/(services)/weather-update-screen",
  },
  {
    id: "12",
    name: "Waste Management",
    iconName: "delete",
    description:
      "Locate waste collection centers and get updates on scheduled pickups in your area.",
    category: "Community Services",
    navigation: "/(services)/waste-management-screen",
  },
  {
    id: "13",
    name: "Fitness Centers",
    iconName: "fitness-center",
    description:
      "Find nearby gyms and fitness centers with reviews and membership options.",
    category: "Health & Fitness",
    navigation: "/(services)/fitness-centers-screen",
  },
  {
    id: "14",
    name: "Medical Assistance",
    iconName: "local-hospital",
    description:
      "Find nearby hospitals, clinics, and pharmacies with emergency contacts.",
    category: "Healthcare",
    navigation: "/(services)/medical-assistance-screen",
  },
  {
    id: "16",
    name: "Taxi Services",
    iconName: "local-taxi",
    description:
      "Book taxis or ride-sharing options for convenient and safe travel.",
    category: "Transportation",
    navigation: "/(services)/taxi-services-screen",
  },
  {
    id: "17",
    name: "Job Listings",
    iconName: "work",
    description:
      "Browse job opportunities and connect with local employers in your area.",
    category: "Employment",
    navigation: "/(services)/job-listing-screen",
  },
  {
    id: "18",
    name: "Pet Services",
    iconName: "pets",
    description: "Find pet grooming, boarding, and veterinary services nearby.",
    category: "Pet Care",
    navigation: "/(services)/pet-services-screen",
  },
  {
    id: "19",
    name: "Volunteer Opportunities",
    iconName: "volunteer-activism",
    description:
      "Join community initiatives and volunteer programs to make a difference.",
    category: "Community Services",
    navigation: "/(services)/volunteer-opportunities-screen",
  },
  {
    id: "20",
    name: "Shopping Deals",
    iconName: "shopping-cart",
    description:
      "Discover discounts and offers from local stores and shopping malls.",
    category: "Retail",
    navigation: "/(services)/shopping-deals-screen",
  },
];

export default function ServicesScreen() {
  const [searchValue, setSearchValue] = useState("");
  const [showAll, setShowAll] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Service</Text>
      </View>
      <FlatList
        data={servicesData}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent} // Apply styles here
        renderItem={({ item }) => (
          <ServiceCard
            iconName={item.iconName}
            serviceName={item.name}
            description={item.description}
            price={""}
            availability={""}
            onPress={() => {
              router.push(item.navigation);
            }}
          />
        )}
        ListFooterComponentStyle={{
          paddingBottom: 100,
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    justifyContent: "center",
  },
  header: {
    fontSize: 18,
    color: "#002045",
    fontWeight: "bold",
    fontFamily: "Exo-Regular",
    textAlign: "center",
  },

  mainHeader: {
    fontSize: 24,
    fontFamily: "Exo-Bold",
  },
  description: {
    fontFamily: "Exo-Regular",
    lineHeight: 24,
    color: "#002045",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  search: {
    marginHorizontal: 5,
  },
  card: {
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  viewAllButton: {
    alignSelf: "flex-end", // Align the button to the right
    borderRadius: 4,
    marginRight: 5, // Add some spacing from the right edge
  },
  viewAllText: {
    color: "#3470E4", // Set text color to white for better contrast
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Exo-Bold",
  },
  listContent: {
    // backgroundColor: "red", // Light gray background color
    // paddingVertical: 16, // Optional padding for better spacing
    // paddingHorizontal: 8, // Horizontal padding to match the card layout
  },
});
