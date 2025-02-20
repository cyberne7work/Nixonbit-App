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

// Define TypeScript interfaces for the medical resource data
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface MedicalResource {
  id: string;
  name: string;
  type: string;
  location: string;
  description: string;
  contactPhone: string;
  coordinates: Coordinates | null;
  services: string[];
}

// Mock data with TypeScript typing
const mockMedicalResources: MedicalResource[] = [
  {
    id: "1",
    name: "San Francisco General Hospital",
    type: "Hospital",
    location: "1001 Potrero Ave, San Francisco, CA 94110",
    description:
      "A full-service hospital offering emergency care, surgery, and specialized treatments.",
    contactPhone: "415-206-8000",
    coordinates: { latitude: 37.7558, longitude: -122.4051 },
    services: ["Emergency Care", "Surgery", "Pediatrics"],
  },
  {
    id: "2",
    name: "NYC Health + Hospitals",
    type: "Clinic",
    location: "462 First Avenue, New York, NY 10016",
    description:
      "Provides outpatient care, mental health services, and community health programs.",
    contactPhone: "212-562-4141",
    coordinates: { latitude: 40.7392, longitude: -73.9788 },
    services: ["Outpatient Care", "Mental Health", "Vaccinations"],
  },
  {
    id: "3",
    name: "Seattle Urgent Care",
    type: "Urgent Care",
    location: "509 Olive Way, Seattle, WA 98101",
    description: "Walk-in clinic for non-emergency medical needs, open 24/7.",
    contactPhone: "206-555-7890",
    coordinates: { latitude: 47.6119, longitude: -122.3344 },
    services: ["Urgent Care", "X-Ray", "Lab Testing"],
  },
  {
    id: "4",
    name: "Remote Telehealth Service",
    type: "Telehealth",
    location: "Remote",
    description:
      "Online medical consultations available nationwide via video call.",
    contactPhone: "800-555-4321",
    coordinates: null,
    services: ["Telemedicine", "Prescriptions", "Consultations"],
  },
];

export default function MedicalAssistanceScreen() {
  const router = useRouter();
  const [filterText, setFilterText] = useState<string>("");

  // Filter medical resources based on name or location
  const filteredResources: MedicalResource[] = mockMedicalResources.filter(
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
      Alert.alert(
        "Info",
        "This is a remote service with no physical location."
      );
      return;
    }
    const { latitude, longitude } = coordinates;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url).catch((err) =>
      Alert.alert("Error", "Failed to open maps: " + err.message)
    );
  };

  // Function to share resource
  const handleShare = (resource: MedicalResource): void => {
    const message = `${resource.name}\nType: ${resource.type}\nLocation: ${resource.location}\nPhone: ${resource.contactPhone}`;
    Linking.openURL(`sms:&body=${encodeURIComponent(message)}`).catch((err) =>
      Alert.alert("Error", "Failed to share: " + err.message)
    );
  };
  const navigateToJobDetail = (item) => {
    router.push({
      pathname: "/(root)/(services)/medical-assistance-detailed-screen",
      params: { item: JSON.stringify(item) },
    });
  };

  const renderResourceItem = ({ item }: { item: MedicalResource }) => (
    <View style={styles.resourceItem}>
      <TouchableOpacity onPress={() => navigateToJobDetail(item)}>
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
        <Text style={styles.header}>Medical Assistance</Text>
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
        keyExtractor={(item: MedicalResource) => item.id}
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
  backButton: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -12 }], // Vertically center the icon
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
    justifyContent: "space-around" as const,
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    padding: 5,
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
