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
  Image,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useRouter, useLocalSearchParams } from "expo-router";

// Define TypeScript interfaces for taxi service data
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface CarDetails {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  imageUrl: string;
}

interface DriverInfo {
  name: string;
  licenseNumber: string;
  phone: string;
  rating: number;
}

interface OwnerInfo {
  name: string;
  contactPhone: string;
  email: string;
}

interface TaxiService {
  id: string;
  carDetails: CarDetails;
  driverInfo: DriverInfo;
  ownerInfo: OwnerInfo;
  currentLocation: Coordinates | null;
  availability: string;
  lastServiceDate: string;
}

export default function TaxiServicesDetailedScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const service: TaxiService | null = params.taxiService
    ? JSON.parse(params.taxiService as string)
    : null;

  console.log("Service data:", service);

  if (!service) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No taxi service details available</Text>
      </SafeAreaView>
    );
  }

  const handleDriverCall = (): void => {
    const url = `tel:${service.driverInfo.phone}`;
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

  const handleOwnerCall = (): void => {
    const url = `tel:${service.ownerInfo.contactPhone}`;
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
    if (!service.currentLocation) {
      Alert.alert("Info", "Current location is not available.");
      return;
    }
    const { latitude, longitude } = service.currentLocation;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url).catch((err) =>
      Alert.alert("Error", "Failed to open maps: " + err.message)
    );
  };

  const handleShare = (): void => {
    const message = `Taxi Details:\nCar: ${service.carDetails.make} ${service.carDetails.model}\nDriver: ${service.driverInfo.name} (${service.driverInfo.phone})\nOwner: ${service.ownerInfo.name} (${service.ownerInfo.contactPhone})\nAvailability: ${service.availability}`;
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
          {`${service.carDetails.make} ${service.carDetails.model}`}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.serviceDetails}>
          <Image
            source={{ uri: service.carDetails.imageUrl }}
            style={styles.carImage}
            resizeMode="cover"
          />

          {/* Car Details */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Car Details</Text>
            <Text style={styles.detailText}>
              Make: {service.carDetails.make}
            </Text>
            <Text style={styles.detailText}>
              Model: {service.carDetails.model}
            </Text>
            <Text style={styles.detailText}>
              Year: {service.carDetails.year}
            </Text>
            <Text style={styles.detailText}>
              License Plate: {service.carDetails.licensePlate}
            </Text>
            <Text style={styles.detailText}>
              Color: {service.carDetails.color}
            </Text>
            <Text style={styles.detailText}>
              Last Service: {service.lastServiceDate}
            </Text>
          </View>

          {/* Driver Info */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Driver Information</Text>
            <Text style={styles.detailText}>
              Name: {service.driverInfo.name}
            </Text>
            <Text style={styles.detailText}>
              License: {service.driverInfo.licenseNumber}
            </Text>
            <Text style={styles.detailText}>
              Phone: {service.driverInfo.phone}
            </Text>
            <Text style={styles.detailText}>
              Rating: {service.driverInfo.rating}/5
            </Text>
          </View>

          {/* Owner Info */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Owner Information</Text>
            <Text style={styles.detailText}>
              Name: {service.ownerInfo.name}
            </Text>
            <Text style={styles.detailText}>
              Phone: {service.ownerInfo.contactPhone}
            </Text>
            <Text style={styles.detailText}>
              Email: {service.ownerInfo.email}
            </Text>
          </View>

          {/* Availability */}
          <Text style={styles.availability}>
            Availability: {service.availability}
          </Text>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleDriverCall}
            >
              <MaterialIcons name="phone" size={20} color="#3470E4" />
              <Text style={styles.actionText}>Call Driver</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleOwnerCall}
            >
              <MaterialIcons name="phone" size={20} color="#3470E4" />
              <Text style={styles.actionText}>Call Owner</Text>
            </TouchableOpacity>
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
            <Text style={styles.bookButtonText}>Book Now</Text>
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
  carImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  sectionContainer: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#002045",
    fontFamily: "Exo-Regular",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "Exo-Regular",
    marginBottom: 5,
  },
  availability: {
    fontSize: 16,
    color: "#888",
    fontFamily: "Exo-Regular",
    marginTop: 15,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const, // Allow buttons to wrap to next line
    justifyContent: "center" as const, // Center buttons instead of space-around
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 10, // Add padding to prevent edge overflow
  },
  actionButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    padding: 5,
    margin: 5, // Add margin to space buttons evenly
    minWidth: 100, // Ensure buttons have a minimum width for readability
  },
  actionText: {
    marginLeft: 5,
    color: "#3470E4",
    fontSize: 14, // Reduced font size slightly to fit better
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