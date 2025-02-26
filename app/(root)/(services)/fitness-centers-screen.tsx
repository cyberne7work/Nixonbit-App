import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Linking,
  Alert,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { CustomTextInput } from "@/components/CustomTextInput";

// Define TypeScript interfaces for fitness center data
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface FitnessCenter {
  id: string;
  name: string;
  type: string; // e.g., "Gym", "Yoga Studio", "CrossFit"
  location: string;
  description: string;
  contactPhone: string | null;
  coordinates: Coordinates | null;
  hours: string; // e.g., "6 AM - 10 PM"
  amenities: string[]; // e.g., ["Pool", "Sauna", "Weights"]
}

// Mock data for fitness centers
const mockFitnessCenters: FitnessCenter[] = [
  {
    id: "1",
    name: "FitLife Gym",
    type: "Gym",
    location: "San Francisco, CA",
    description:
      "A full-service gym with cardio machines, weights, and group classes.",
    contactPhone: "415-555-1234",
    coordinates: { latitude: 37.7749, longitude: -122.4194 },
    hours: "6 AM - 11 PM",
    amenities: ["Weights", "Cardio", "Group Classes"],
  },
  {
    id: "2",
    name: "Zen Yoga Studio",
    type: "Yoga Studio",
    location: "New York, NY",
    description:
      "A peaceful studio offering yoga and meditation sessions.",
    contactPhone: "212-555-5678",
    coordinates: { latitude: 40.7128, longitude: -74.0060 },
    hours: "7 AM - 9 PM",
    amenities: ["Yoga Mats", "Meditation Room"],
  },
  {
    id: "3",
    name: "CrossFit Seattle",
    type: "CrossFit",
    location: "Seattle, WA",
    description:
      "High-intensity fitness training with a focus on community.",
    contactPhone: "206-555-9012",
    coordinates: { latitude: 47.6062, longitude: -122.3321 },
    hours: "5 AM - 8 PM",
    amenities: ["Weights", "Ropes", "Boxing Area"],
  },
  {
    id: "4",
    name: "Virtual Fitness Hub",
    type: "Online Fitness",
    location: "Remote",
    description:
      "Online fitness classes accessible from anywhere.",
    contactPhone: "800-555-3456",
    coordinates: null,
    hours: "24/7",
    amenities: ["Live Streaming", "On-Demand Videos"],
  },
];

export default function FitnessCentersScreen() {
  const router = useRouter();
  const [filterText, setFilterText] = useState<string>("");

  // Filter fitness centers based on name or location
  const filteredCenters: FitnessCenter[] = mockFitnessCenters.filter(
    (center) =>
      center.name.toLowerCase().includes(filterText.toLowerCase()) ||
      center.location.toLowerCase().includes(filterText.toLowerCase())
  );

  // Function to handle phone call
  const handleCall = (phoneNumber: string | null): void => {
    if (!phoneNumber) {
      Alert.alert("Info", "No contact phone number available.");
      return;
    }
    const url = `tel:${phoneNumber}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Error", "Phone calls are not supported on this device.");
        }
      })
      .catch((err) =>
        Alert.alert("Error", "Failed to make a call: " + err.message)
      );
  };

  // Function to open location in maps
  const handleLocation = (
    location: string,
    coordinates: Coordinates | null
  ): void => {
    if (!coordinates) {
      Alert.alert("Info", "This is a remote fitness center with no physical location.");
      return;
    }
    const { latitude, longitude } = coordinates;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url).catch((err) =>
      Alert.alert("Error", "Failed to open maps: " + err.message)
    );
  };

  // Function to share fitness center
  const handleShare = (center: FitnessCenter): void => {
    const message = `${center.name}\nType: ${center.type}\nLocation: ${center.location}\nPhone: ${center.contactPhone || "N/A"}\nHours: ${center.hours}\nAmenities: ${center.amenities.join(", ")}`;
    Linking.openURL(`sms:&body=${encodeURIComponent(message)}`).catch((err) =>
      Alert.alert("Error", "Failed to share: " + err.message)
    );
  };

  const renderCenterItem = ({ item }: { item: FitnessCenter }) => (
    <View style={styles.centerItem}>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/(root)/(services)/fitness-centers-detailed-screen",
            params: { center: JSON.stringify(item) },
          })
        }
      >
        <Text style={styles.centerName}>{item.name}</Text>
        <Text style={styles.centerType}>{item.type}</Text>
        <Text style={styles.centerLocation}>{item.location}</Text>
        <Text style={styles.centerDescription}>{item.description}</Text>
      </TouchableOpacity>
      <View style={styles.actionButtons}>
        {item.contactPhone && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleCall(item.contactPhone)}
          >
            <MaterialIcons name="phone" size={20} color="#3470E4" />
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLocation(item.location, item.coordinates)}
        >
          <MaterialIcons name="location-on" size={20} color="#3470E4" />
          <Text style={styles.actionText}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleShare(item)}
        >
          <MaterialIcons name="share" size={20} color="#3470E4" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#002045" />
        </TouchableOpacity>
        <Text style={styles.header}>Fitness Centers</Text>
      </View>

      <CustomTextInput
        label={null}
        placeholder="Filter by name or location"
        value={filterText}
        onChangeText={(text: string) => setFilterText(text)}
        autoCapitalize="none"
        style={{
          marginHorizontal: 5,
          marginVertical: 5,
        }}
      />

      <FlatList
        data={filteredCenters}
        renderItem={renderCenterItem}
        keyExtractor={(item: FitnessCenter) => item.id}
        contentContainerStyle={styles.listContentContainer}
        ListHeaderComponentStyle={styles.headerListStyle}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    height: 40,
    justifyContent: "center" as const,
  },
  header: {
    fontSize: 18,
    color: "#002045",
    fontWeight: "bold" as const,
    fontFamily: "Exo-Regular",
    textAlign: "center" as const,
  },
  backButton: {
    position: "absolute" as const,
    left: 10,
    top: "50%" as const,
    transform: [{ translateY: -12 }],
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  centerItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  centerName: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#002045",
    fontFamily: "Exo-Regular",
  },
  centerType: {
    fontSize: 16,
    color: "#888",
    fontFamily: "Exo-Regular",
    marginVertical: 5,
  },
  centerLocation: {
    fontSize: 14,
    color: "#3470E4",
    fontFamily: "Exo-Regular",
  },
  centerDescription: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Exo-Regular",
    marginTop: 5,
  },
  actionButtons: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    justifyContent: "center" as const,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  actionButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    padding: 5,
    margin: 5,
    minWidth: 100,
  },
  actionText: {
    marginLeft: 5,
    color: "#3470E4",
    fontSize: 14,
    fontFamily: "Exo-Regular",
  },
  headerListStyle: {
    marginBottom: 20,
  },
});