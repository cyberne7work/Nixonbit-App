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

// Define TypeScript interfaces for accessibility option data
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface AccessibilityOption {
  id: string;
  name: string;
  type: string; // e.g., "Mobility Aid", "Sign Language Service", "Audio Guide"
  location: string;
  description: string;
  contactPhone: string | null;
  coordinates: Coordinates | null;
  availability: string; // e.g., "24/7", "Business Hours"
  provider: string;
}

// Mock data for accessibility options
const mockAccessibilityOptions: AccessibilityOption[] = [
  {
    id: "1",
    name: "Wheelchair Rental",
    type: "Mobility Aid",
    location: "San Francisco, CA",
    description:
      "Rental service for wheelchairs available at multiple locations.",
    contactPhone: "415-555-7777",
    coordinates: { latitude: 37.7749, longitude: -122.4194 },
    availability: "9 AM - 5 PM",
    provider: "SF Mobility Services",
  },
  {
    id: "2",
    name: "ASL Interpreter Service",
    type: "Sign Language Service",
    location: "New York, NY",
    description:
      "On-demand American Sign Language interpreters for events and appointments.",
    contactPhone: "212-555-8888",
    coordinates: { latitude: 40.7128, longitude: -74.0060 },
    availability: "24/7",
    provider: "NYC Accessibility Network",
  },
  {
    id: "3",
    name: "Audio Description Guide",
    type: "Audio Guide",
    location: "Seattle, WA",
    description:
      "Audio guides for visually impaired visitors at public venues.",
    contactPhone: "206-555-9999",
    coordinates: { latitude: 47.6062, longitude: -122.3321 },
    availability: "10 AM - 6 PM",
    provider: "Seattle Vision Support",
  },
  {
    id: "4",
    name: "Remote Accessibility Hotline",
    type: "Support Service",
    location: "Remote",
    description:
      "Nationwide hotline for accessibility inquiries and support.",
    contactPhone: "800-555-6666",
    coordinates: null,
    availability: "24/7",
    provider: "National Accessibility Alliance",
  },
];

export default function AccessibilityOptionsScreen() {
  const router = useRouter();
  const [filterText, setFilterText] = useState<string>("");

  // Filter accessibility options based on name or location
  const filteredOptions: AccessibilityOption[] = mockAccessibilityOptions.filter(
    (option) =>
      option.name.toLowerCase().includes(filterText.toLowerCase()) ||
      option.location.toLowerCase().includes(filterText.toLowerCase())
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
      Alert.alert("Info", "This is a remote service with no physical location.");
      return;
    }
    const { latitude, longitude } = coordinates;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url).catch((err) =>
      Alert.alert("Error", "Failed to open maps: " + err.message)
    );
  };

  // Function to share option
  const handleShare = (option: AccessibilityOption): void => {
    const message = `${option.name}\nType: ${option.type}\nLocation: ${option.location}\nPhone: ${option.contactPhone || "N/A"}\nAvailability: ${option.availability}\nProvider: ${option.provider}`;
    Linking.openURL(`sms:&body=${encodeURIComponent(message)}`).catch((err) =>
      Alert.alert("Error", "Failed to share: " + err.message)
    );
  };

  const renderOptionItem = ({ item }: { item: AccessibilityOption }) => (
    <View style={styles.optionItem}>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/(root)/(services)/accessibility-options-detailed-screen",
            params: { option: JSON.stringify(item) },
          })
        }
      >
        <Text style={styles.optionName}>{item.name}</Text>
        <Text style={styles.optionType}>{item.type}</Text>
        <Text style={styles.optionLocation}>{item.location}</Text>
        <Text style={styles.optionDescription}>{item.description}</Text>
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
        <Text style={styles.header}>Accessibility Options</Text>
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
        data={filteredOptions}
        renderItem={renderOptionItem}
        keyExtractor={(item: AccessibilityOption) => item.id}
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
  optionItem: {
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
  optionName: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#002045",
    fontFamily: "Exo-Regular",
  },
  optionType: {
    fontSize: 16,
    color: "#888",
    fontFamily: "Exo-Regular",
    marginVertical: 5,
  },
  optionLocation: {
    fontSize: 14,
    color: "#3470E4",
    fontFamily: "Exo-Regular",
  },
  optionDescription: {
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