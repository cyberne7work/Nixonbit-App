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

// Define TypeScript interfaces for pet service data
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface PetService {
  id: string;
  name: string;
  type: string; // e.g., "Grooming", "Veterinary", "Boarding"
  location: string;
  description: string;
  contactPhone: string | null;
  coordinates: Coordinates | null;
  hours: string; // e.g., "9 AM - 6 PM"
  servicesOffered: string[]; // e.g., ["Nail Trimming", "Bathing"]
}

// Mock data for pet services
const mockPetServices: PetService[] = [
  {
    id: "1",
    name: "Paws & Claws Grooming",
    type: "Grooming",
    location: "San Francisco, CA",
    description:
      "Professional grooming services for dogs and cats.",
    contactPhone: "415-555-4321",
    coordinates: { latitude: 37.7749, longitude: -122.4194 },
    hours: "9 AM - 6 PM",
    servicesOffered: ["Bathing", "Nail Trimming", "Haircuts"],
  },
  {
    id: "2",
    name: "Urban Vet Clinic",
    type: "Veterinary",
    location: "New York, NY",
    description:
      "Full-service veterinary care for all pets.",
    contactPhone: "212-555-8765",
    coordinates: { latitude: 40.7128, longitude: -74.0060 },
    hours: "8 AM - 8 PM",
    servicesOffered: ["Vaccinations", "Surgery", "Check-ups"],
  },
  {
    id: "3",
    name: "Seattle Pet Boarding",
    type: "Boarding",
    location: "Seattle, WA",
    description:
      "Safe and comfortable boarding for pets.",
    contactPhone: "206-555-2109",
    coordinates: { latitude: 47.6062, longitude: -122.3321 },
    hours: "7 AM - 7 PM",
    servicesOffered: ["Daycare", "Overnight Boarding", "Playtime"],
  },
  {
    id: "4",
    name: "Pet Care Hotline",
    type: "Support Service",
    location: "Remote",
    description:
      "24/7 hotline for pet care advice and emergencies.",
    contactPhone: "800-555-6543",
    coordinates: null,
    hours: "24/7",
    servicesOffered: ["Emergency Advice", "Behavioral Support"],
  },
];

export default function PetServicesScreen() {
  const router = useRouter();
  const [filterText, setFilterText] = useState<string>("");

  // Filter pet services based on name or location
  const filteredServices: PetService[] = mockPetServices.filter(
    (service) =>
      service.name.toLowerCase().includes(filterText.toLowerCase()) ||
      service.location.toLowerCase().includes(filterText.toLowerCase())
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

  // Function to share pet service
  const handleShare = (service: PetService): void => {
    const message = `${service.name}\nType: ${service.type}\nLocation: ${service.location}\nPhone: ${service.contactPhone || "N/A"}\nHours: ${service.hours}\nServices: ${service.servicesOffered.join(", ")}`;
    Linking.openURL(`sms:&body=${encodeURIComponent(message)}`).catch((err) =>
      Alert.alert("Error", "Failed to share: " + err.message)
    );
  };

  const renderServiceItem = ({ item }: { item: PetService }) => (
    <View style={styles.serviceItem}>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/(root)/(services)/pet-services-detailed-screen",
            params: { service: JSON.stringify(item) },
          })
        }
      >
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.serviceType}>{item.type}</Text>
        <Text style={styles.serviceLocation}>{item.location}</Text>
        <Text style={styles.serviceDescription}>{item.description}</Text>
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
        <Text style={styles.header}>Pet Services</Text>
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
        data={filteredServices}
        renderItem={renderServiceItem}
        keyExtractor={(item: PetService) => item.id}
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
  serviceItem: {
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
  serviceName: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#002045",
    fontFamily: "Exo-Regular",
  },
  serviceType: {
    fontSize: 16,
    color: "#888",
    fontFamily: "Exo-Regular",
    marginVertical: 5,
  },
  serviceLocation: {
    fontSize: 14,
    color: "#3470E4",
    fontFamily: "Exo-Regular",
  },
  serviceDescription: {
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