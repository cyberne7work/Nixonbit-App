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

// Define TypeScript interfaces for public place data
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface PublicPlace {
  id: string;
  name: string;
  type: string; // e.g., "Park", "Library", "Community Center"
  location: string;
  description: string;
  contactPhone: string | null;
  coordinates: Coordinates | null;
  hours: string; // e.g., "9 AM - 5 PM"
  accessibility: string; // e.g., "Wheelchair accessible"
}

// Mock data for public places
const mockPublicPlaces: PublicPlace[] = [
  {
    id: "1",
    name: "Golden Gate Park",
    type: "Park",
    location: "San Francisco, CA",
    description:
      "A large urban park with gardens, museums, and recreational areas.",
    contactPhone: "415-831-2700",
    coordinates: { latitude: 37.7694, longitude: -122.4862 },
    hours: "6 AM - 10 PM",
    accessibility: "Wheelchair accessible",
  },
  {
    id: "2",
    name: "New York Public Library",
    type: "Library",
    location: "New York, NY",
    description:
      "Iconic library offering books, research materials, and public events.",
    contactPhone: "917-275-6975",
    coordinates: { latitude: 40.7532, longitude: -73.9823 },
    hours: "10 AM - 6 PM",
    accessibility: "Wheelchair accessible",
  },
  {
    id: "3",
    name: "Seattle Community Center",
    type: "Community Center",
    location: "Seattle, WA",
    description:
      "A hub for community activities, classes, and events.",
    contactPhone: "206-684-4753",
    coordinates: { latitude: 47.6062, longitude: -122.3321 },
    hours: "8 AM - 8 PM",
    accessibility: "Wheelchair accessible",
  },
  {
    id: "4",
    name: "Remote Visitor Info",
    type: "Information Service",
    location: "Remote",
    description:
      "Online service providing info about public places nationwide.",
    contactPhone: "800-555-5555",
    coordinates: null,
    hours: "24/7",
    accessibility: "N/A",
  },
];

export default function PublicPlacesScreen() {
  const router = useRouter();
  const [filterText, setFilterText] = useState<string>("");

  // Filter public places based on name or location
  const filteredPlaces: PublicPlace[] = mockPublicPlaces.filter(
    (place) =>
      place.name.toLowerCase().includes(filterText.toLowerCase()) ||
      place.location.toLowerCase().includes(filterText.toLowerCase())
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

  // Function to share place
  const handleShare = (place: PublicPlace): void => {
    const message = `${place.name}\nType: ${place.type}\nLocation: ${place.location}\nPhone: ${place.contactPhone || "N/A"}\nHours: ${place.hours}`;
    Linking.openURL(`sms:&body=${encodeURIComponent(message)}`).catch((err) =>
      Alert.alert("Error", "Failed to share: " + err.message)
    );
  };

  const renderPlaceItem = ({ item }: { item: PublicPlace }) => (
    <View style={styles.placeItem}>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/(root)/(services)/public-places-detailed-screen",
            params: { place: JSON.stringify(item) },
          })
        }
      >
        <Text style={styles.placeName}>{item.name}</Text>
        <Text style={styles.placeType}>{item.type}</Text>
        <Text style={styles.placeLocation}>{item.location}</Text>
        <Text style={styles.placeDescription}>{item.description}</Text>
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
        <Text style={styles.header}>Public Places</Text>
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
        data={filteredPlaces}
        renderItem={renderPlaceItem}
        keyExtractor={(item: PublicPlace) => item.id}
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
  placeItem: {
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
  placeName: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#002045",
    fontFamily: "Exo-Regular",
  },
  placeType: {
    fontSize: 16,
    color: "#888",
    fontFamily: "Exo-Regular",
    marginVertical: 5,
  },
  placeLocation: {
    fontSize: 14,
    color: "#3470E4",
    fontFamily: "Exo-Regular",
  },
  placeDescription: {
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