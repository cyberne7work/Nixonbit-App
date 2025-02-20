import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";

const transportDetails = {
  Bus: {
    description:
      "Public bus transport is an affordable and convenient way to travel across the city.",
    services: ["City Bus", "Intercity Bus", "Luxury Bus", "Night Bus"],
    priceRange: "₹10 - ₹200",
    availability: "Available 24/7 in most cities",
  },
  Train: {
    description:
      "Train services offer fast and cost-effective travel between cities and states.",
    services: ["Metro", "Local Train", "Express Train", "Superfast"],
    priceRange: "₹50 - ₹5000",
    availability: "Depends on the schedule",
  },
  Metro: {
    description:
      "Metro transport is an efficient and rapid transit system in metropolitan areas.",
    services: ["Regular Metro", "Rapid Transit", "Mono Rail"],
    priceRange: "₹20 - ₹150",
    availability: "Operates from 6 AM - 11 PM",
  },
  Taxi: {
    description:
      "Taxis provide a convenient and private mode of transport for city commutes.",
    services: ["Regular Taxi", "App-Based Cab", "Luxury Taxi"],
    priceRange: "₹100 - ₹500",
    availability: "Available 24/7",
  },
  BicycleRental: {
    description:
      "Bicycle rentals provide an eco-friendly way to travel short distances.",
    services: ["Hourly Rentals", "Daily Rentals", "E-Bike Rentals"],
    priceRange: "₹50 - ₹500 per day",
    availability: "Limited availability in specific cities",
  },
  CarRental: {
    description:
      "Car rental services provide a comfortable and flexible mode of transport.",
    services: ["Self-Drive", "With Driver", "Luxury Cars"],
    priceRange: "₹1000 - ₹10000 per day",
    availability: "Available for booking",
  },
};

export default function TransportDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const category = params.category || "Unknown";
  const details = transportDetails[category] || {};

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#002045" />
        </TouchableOpacity>
        <Text style={styles.header}>{category} Details</Text>
      </View>

      {/* Details Section */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.description}>{details.description || "No details available."}</Text>

        <Text style={styles.sectionTitle}>Available Services</Text>
        {details.services ? (
          details.services.map((service, index) => (
            <Text key={index} style={styles.serviceItem}>
              • {service}
            </Text>
          ))
        ) : (
          <Text style={styles.serviceItem}>No services available.</Text>
        )}

        <Text style={styles.sectionTitle}>Price Range</Text>
        <Text style={styles.infoText}>{details.priceRange || "N/A"}</Text>

        <Text style={styles.sectionTitle}>Availability</Text>
        <Text style={styles.infoText}>{details.availability || "N/A"}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    justifyContent: "center",
    backgroundColor: "#fff",
    elevation: 3,
  },
  header: {
    fontSize: 18,
    color: "#002045",
    fontWeight: "bold",
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  contentContainer: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#002045",
    fontWeight: "bold",
    marginTop: 15,
  },
  serviceItem: {
    fontSize: 16,
    color: "#666",
    marginLeft: 10,
    marginTop: 5,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
  },
});

