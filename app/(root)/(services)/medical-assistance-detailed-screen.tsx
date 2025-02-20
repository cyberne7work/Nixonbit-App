import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useRouter, useLocalSearchParams } from "expo-router";

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

export default function MedicalAssistanceDetailedScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const resource = params.item ? JSON.parse(params.item) : null;


  console.log("Resource data:", resource);

  // If no resource data is provided, show a fallback
  if (!resource) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No medical resource details available</Text>
      </SafeAreaView>
    );
  }

  // Function to handle phone call
  const handleCall = (): void => {
    if (!resource.contactPhone) {
      Alert.alert("Info", "No contact phone number available.");
      return;
    }
    const url = `tel:${resource.contactPhone}`;
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
  const handleLocation = (): void => {
    if (!resource.coordinates) {
      Alert.alert("Info", "This is a remote service with no physical location.");
      return;
    }
    const { latitude, longitude } = resource.coordinates;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url).catch((err) =>
      Alert.alert("Error", "Failed to open maps: " + err.message)
    );
  };

  // Function to share resource
  const handleShare = (): void => {
    const message = `${resource.name}\nType: ${resource.type}\nLocation: ${resource.location}\nPhone: ${resource.contactPhone}`;
    Linking.openURL(`sms:&body=${encodeURIComponent(message)}`).catch((err) =>
      Alert.alert("Error", "Failed to share: " + err.message)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#002045" />
        </TouchableOpacity>
        <Text style={styles.header} numberOfLines={1}>
          {resource.name}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.resourceDetails}>
          <Text style={styles.type}>Type: {resource.type}</Text>
          <Text style={styles.location}>{resource.location}</Text>
          <Text style={styles.contactPhone}>
            Phone: {resource.contactPhone || "Not available"}
          </Text>

          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{resource.description}</Text>
          </View>

          {resource.services && resource.services.length > 0 && (
            <View style={styles.servicesContainer}>
              <Text style={styles.sectionTitle}>Services</Text>
              {resource.services.map((service, index) => (
                <Text key={index} style={styles.serviceItem}>
                  • {service}
                </Text>
              ))}
            </View>
          )}

          <View style={styles.actionButtons}>
            {resource.contactPhone && (
              <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
                <MaterialIcons name="phone" size={20} color="#3470E4" />
                <Text style={styles.actionText}>Call</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleLocation}
            >
              <MaterialIcons name="location-on" size={20} color="#3470E4" />
              <Text style={styles.actionText}>Map</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <MaterialIcons name="share" size={20} color="#3470E4" />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Contact Facility</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    justifyContent: "center" as const,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  header: {
    fontSize: 20,
    color: "#002045",
    textAlign: "center" as const,
    fontFamily: "Exo-Regular",
    flex: 1,
    paddingHorizontal: 40, // Prevent overlap with back button
  },
  backButton: {
    position: "absolute" as const,
    left: 10,
    zIndex: 1,
  },
  contentContainer: {
    padding: 15,
  },
  resourceDetails: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  type: {
    fontSize: 16,
    color: "#888",
    fontFamily: "Exo-Regular",
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: "#3470E4",
    fontFamily: "Exo-Regular",
    marginBottom: 5,
  },
  contactPhone: {
    fontSize: 16,
    color: "#888",
    fontFamily: "Exo-Regular",
    marginBottom: 15,
  },
  descriptionContainer: {
    marginTop: 15,
  },
  servicesContainer: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#002045",
    fontFamily: "Exo-Regular",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    fontFamily: "Exo-Regular",
    lineHeight: 24,
  },
  serviceItem: {
    fontSize: 16,
    color: "#666",
    fontFamily: "Exo-Regular",
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: "row" as const,
    justifyContent: "space-around" as const,
    marginTop: 20,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    padding: 5,
  },
  actionText: {
    marginLeft: 5,
    color: "#3470E4",
    fontSize: 16,
    fontFamily: "Exo-Regular",
  },
  contactButton: {
    backgroundColor: "#3470E4",
    padding: 15,
    borderRadius: 8,
    alignItems: "center" as const,
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Exo-Regular",
    fontWeight: "bold" as const,
  },
});