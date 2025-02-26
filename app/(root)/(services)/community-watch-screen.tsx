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

// Define TypeScript interfaces for community watch data
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface CommunityWatch {
  id: string;
  name: string;
  type: string; // e.g., "Neighborhood Watch", "Security Patrol", "Emergency Contact"
  location: string;
  description: string;
  contactPhone: string;
  coordinates: Coordinates | null;
  status: string; // e.g., "Active", "Inactive"
  lastUpdated: string; // e.g., "2025-02-20"
}

// Mock data for community watch resources
const mockCommunityWatch: CommunityWatch[] = [
  {
    id: "1",
    name: "Downtown Safety Watch",
    type: "Neighborhood Watch",
    location: "San Francisco, CA",
    description:
      "A community-led group monitoring downtown safety and reporting incidents.",
    contactPhone: "415-555-1111",
    coordinates: { latitude: 37.7749, longitude: -122.4194 },
    status: "Active",
    lastUpdated: "2025-02-15",
  },
  {
    id: "2",
    name: "Night Patrol Team",
    type: "Security Patrol",
    location: "New York, NY",
    description:
      "Volunteer patrol team ensuring safety during nighttime hours.",
    contactPhone: "212-555-2222",
    coordinates: { latitude: 40.7128, longitude: -74.0060 },
    status: "Active",
    lastUpdated: "2025-02-18",
  },
  {
    id: "3",
    name: "Emergency Contact - Seattle",
    type: "Emergency Contact",
    location: "Seattle, WA",
    description:
      "Primary contact for community emergencies in the Seattle area.",
    contactPhone: "206-555-3333",
    coordinates: { latitude: 47.6062, longitude: -122.3321 },
    status: "Active",
    lastUpdated: "2025-02-10",
  },
  {
    id: "4",
    name: "Remote Safety Hotline",
    type: "Emergency Contact",
    location: "Remote",
    description: "Nationwide hotline for reporting safety concerns.",
    contactPhone: "800-555-4444",
    coordinates: null,
    status: "Active",
    lastUpdated: "2025-02-20",
  },
];

export default function CommunityWatchScreen() {
  const router = useRouter();
  const [filterText, setFilterText] = useState<string>("");

  // Filter community watch resources based on name or location
  const filteredResources: CommunityWatch[] = mockCommunityWatch.filter(
    (resource) =>
      resource.name.toLowerCase().includes(filterText.toLowerCase()) ||
      resource.location.toLowerCase().includes(filterText.toLowerCase())
  );

  // Function to handle phone call
  const handleCall = (phoneNumber: string): void => {
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
      Alert.alert("Info", "This is a remote resource with no physical location.");
      return;
    }
    const { latitude, longitude } = coordinates;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url).catch((err) =>
      Alert.alert("Error", "Failed to open maps: " + err.message)
    );
  };

  // Function to share resource
  const handleShare = (resource: CommunityWatch): void => {
    const message = `${resource.name}\nType: ${resource.type}\nLocation: ${resource.location}\nPhone: ${resource.contactPhone}\nStatus: ${resource.status}`;
    Linking.openURL(`sms:&body=${encodeURIComponent(message)}`).catch((err) =>
      Alert.alert("Error", "Failed to share: " + err.message)
    );
  };

  const renderResourceItem = ({ item }: { item: CommunityWatch }) => (
    <View style={styles.resourceItem}>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/(root)/(services)/community-watch-detailed-screen",
            params: { resource: JSON.stringify(item) },
          })
        }
      >
        <Text style={styles.resourceName}>{item.name}</Text>
        <Text style={styles.resourceType}>{item.type}</Text>
        <Text style={styles.resourceLocation}>{item.location}</Text>
        <Text style={styles.resourceDescription}>{item.description}</Text>
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
        <Text style={styles.header}>Community Watch</Text>
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
        data={filteredResources}
        renderItem={renderResourceItem}
        keyExtractor={(item: CommunityWatch) => item.id}
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
  resourceItem: {
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
  resourceName: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#002045",
    fontFamily: "Exo-Regular",
  },
  resourceType: {
    fontSize: 16,
    color: "#888",
    fontFamily: "Exo-Regular",
    marginVertical: 5,
  },
  resourceLocation: {
    fontSize: 14,
    color: "#3470E4",
    fontFamily: "Exo-Regular",
  },
  resourceDescription: {
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