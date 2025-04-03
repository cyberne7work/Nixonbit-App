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

interface Car {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  lastService: string;
  imageUrl?: string; // Optional since it's added manually
}

interface DriverInfo {
  name: string;
  license: string;
  phone: string;
  rating: number;
}

interface OwnerInfo {
  name: string;
  phone: string;
  email: string;
}

interface TaxiService {
  id: string;
  car: Car;
  driver: DriverInfo;
  owner: OwnerInfo;
  availability: string;
  mapLink: string;
  bookingLink: string;
  createdAt: string;
  updatedAt: string;
  currentLocation?: Coordinates | null;
}

export default function TaxiServicesDetailedScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const service: TaxiService | null = params.taxiService
    ? JSON.parse(params.taxiService as string)
    : null;

  if (!service) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No taxi service details available</Text>
      </SafeAreaView>
    );
  }

  const handleDriverCall = (): void => {
    const url = `tel:${service.driver.phone}`;
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
    const url = `tel:${service.owner.phone}`;
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
    const message = `Taxi Details:\nCar: ${service.car.make} ${service.car.model}\nDriver: ${service.driver.name} (${service.driver.phone})\nOwner: ${service.owner.name} (${service.owner.phone})\nAvailability: ${service.availability}`;
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
          {`${service.car.make} ${service.car.model}`}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.serviceDetails}>
          <Image
            source={{
              uri: service.car.imageUrl || `https://via.placeholder.com/150/cccccc/ffffff?text=${service.car.make}+${service.car.model}`,
            }}
            style={styles.carImage}
            resizeMode="cover"
          />

          {/* Car Details */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Car Details</Text>
            <Text style={styles.detailText}>Make: {service.car.make}</Text>
            <Text style={styles.detailText}>Model: {service.car.model}</Text>
            <Text style={styles.detailText}>Year: {service.car.year}</Text>
            <Text style={styles.detailText}>
              License Plate: {service.car.licensePlate}
            </Text>
            <Text style={styles.detailText}>Color: {service.car.color}</Text>
            <Text style={styles.detailText}>
              Last Service: {new Date(service.car.lastService).toLocaleDateString()}
            </Text>
          </View>

          {/* Driver Info */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Driver Information</Text>
            <Text style={styles.detailText}>Name: {service.driver.name}</Text>
            <Text style={styles.detailText}>
              License: {service.driver.license}
            </Text>
            <Text style={styles.detailText}>
              Phone: {service.driver.phone}
            </Text>
            <Text style={styles.detailText}>
              Rating: {service.driver.rating}/5
            </Text>
          </View>

          {/* Owner Info */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Owner Information</Text>
            <Text style={styles.detailText}>Name: {service.owner.name}</Text>
            <Text style={styles.detailText}>
              Phone: {service.owner.phone}
            </Text>
            <Text style={styles.detailText}>
              Email: {service.owner.email}
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

          {service.bookingLink && (
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => Linking.openURL(service.bookingLink)}
            >
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
          )}
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