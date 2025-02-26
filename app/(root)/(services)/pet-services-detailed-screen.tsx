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

// Define TypeScript interfaces for pet service data (reused from list screen)
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface PetService {
  id: string;
  name: string;
  type: string;
  location: string;
  description: string;
  contactPhone: string | null;
  coordinates: Coordinates | null;
  hours: string;
  servicesOffered: string[];
}

export default function PetServicesDetailedScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const service: PetService | null = params.service
    ? JSON.parse(params.service as string)
    : null;

  console.log("Service data:", service);

  if (!service) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No pet service details available</Text>
      </SafeAreaView>
    );
  }

  const handleCall = (): void => {
    if (!service.contactPhone) {
      Alert.alert("Info", "No contact phone number available.");
      return;
    }
    const url = `tel:${service.contactPhone}`;
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

  const handleLocation = (): void => {
    if (!service.coordinates) {
      Alert.alert("Info", "This is a remote service with no physical location.");
      return;
    }
    const { latitude, longitude } = service.coordinates;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url).catch((err) =>
      Alert.alert("Error", "Failed to open maps: " + err.message)
    );
  };

  const handleShare = (): void => {
    const message = `${service.name}\nType: ${service.type}\nLocation: ${service.location}\nPhone: ${service.contactPhone || "N/A"}\nHours: ${service.hours}\nServices: ${service.servicesOffered.join(", ")}`;
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
          {service.name}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.serviceDetails}>
          <Text style={styles.type}>Type: {service.type}</Text>
          <Text style={styles.location}>{service.location}</Text>
          <Text style={styles.contactPhone}>
            Phone: {service.contactPhone || "Not available"}
          </Text>
          <Text style={styles.hours}>Hours: {service.hours}</Text>

          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{service.description}</Text>
          </View>

          <View style={styles.servicesContainer}>
            <Text style={styles.sectionTitle}>Services Offered</Text>
            {service.servicesOffered.map((serviceItem, index) => (
              <Text key={index} style={styles.serviceItem}>
                • {serviceItem}
              </Text>
            ))}
          </View>

          <View style={styles.actionButtons}>
            {service.contactPhone && (
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

          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Book Appointment</Text>
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
  contentContainer: {
    padding: 15,
  },
  serviceDetails: {
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
    marginBottom: 5,
  },
  hours: {
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
    flexWrap: "wrap" as const,
    justifyContent: "center" as const,
    marginTop: 20,
    marginBottom: 20,
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
  bookButton: {
    backgroundColor: "#3470E4",
    padding: 15,
    borderRadius: 8,
    alignItems: "center" as const,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Exo-Regular",
    fontWeight: "bold" as const,
  },
});