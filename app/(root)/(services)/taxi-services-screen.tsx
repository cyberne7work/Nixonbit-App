import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { CustomTextInput } from "@/components/CustomTextInput";

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
  imageUrl: string; // Added for car image
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

// Mock data for multiple taxi services with image URLs
const mockTaxiServices: TaxiService[] = [
  {
    id: "1",
    carDetails: {
      make: "Toyota",
      model: "Prius",
      year: 2020,
      licensePlate: "ABC1234",
      color: "Silver",
      imageUrl: "https://via.placeholder.com/150/cccccc/ffffff?text=Toyota+Prius",
    },
    driverInfo: {
      name: "John Doe",
      licenseNumber: "D1234567",
      phone: "415-555-0101",
      rating: 4.8,
    },
    ownerInfo: {
      name: "Jane Smith",
      contactPhone: "415-555-0202",
      email: "jane.smith@example.com",
    },
    currentLocation: { latitude: 37.7749, longitude: -122.4194 },
    availability: "Available",
    lastServiceDate: "2025-01-15",
  },
  {
    id: "2",
    carDetails: {
      make: "Honda",
      model: "Civic",
      year: 2019,
      licensePlate: "XYZ5678",
      color: "Black",
      imageUrl: "https://via.placeholder.com/150/000000/ffffff?text=Honda+Civic",
    },
    driverInfo: {
      name: "Alice Johnson",
      licenseNumber: "D9876543",
      phone: "415-555-0303",
      rating: 4.5,
    },
    ownerInfo: {
      name: "Bob Wilson",
      contactPhone: "415-555-0404",
      email: "bob.wilson@example.com",
    },
    currentLocation: { latitude: 37.7879, longitude: -122.4071 },
    availability: "Busy",
    lastServiceDate: "2025-02-01",
  },
  {
    id: "3",
    carDetails: {
      make: "Ford",
      model: "Escape",
      year: 2021,
      licensePlate: "LMN9012",
      color: "Blue",
      imageUrl: "https://via.placeholder.com/150/0000ff/ffffff?text=Ford+Escape",
    },
    driverInfo: {
      name: "Mike Brown",
      licenseNumber: "D4567891",
      phone: "206-555-0505",
      rating: 4.9,
    },
    ownerInfo: {
      name: "Sara Davis",
      contactPhone: "206-555-0606",
      email: "sara.davis@example.com",
    },
    currentLocation: { latitude: 47.6062, longitude: -122.3321 },
    availability: "Available",
    lastServiceDate: "2025-01-20",
  },
];

export default function TaxiServicesScreen() {
  const router = useRouter();
  const [filterText, setFilterText] = useState<string>("");

  // Filter taxi services based on make, model, or driver name
  const filteredServices: TaxiService[] = mockTaxiServices.filter(
    (service) =>
      service.carDetails.make.toLowerCase().includes(filterText.toLowerCase()) ||
      service.carDetails.model.toLowerCase().includes(filterText.toLowerCase()) ||
      service.driverInfo.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const renderServiceItem = ({ item }: { item: TaxiService }) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() =>
        router.push({
          pathname: "/(root)/(services)/taxi-services-detailed-screen",
          params: { taxiService: JSON.stringify(item) },
        })
      }
    >
      <Image
        source={{ uri: item.carDetails.imageUrl }}
        style={styles.carImage}
        resizeMode="cover"
      />
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>
          {item.carDetails.make} {item.carDetails.model}
        </Text>
        <Text style={styles.serviceDetail}>
          Driver: {item.driverInfo.name}
        </Text>
        <Text style={styles.serviceDetail}>
          License: {item.carDetails.licensePlate}
        </Text>
        <Text style={styles.serviceDetail}>
          Availability: {item.availability}
        </Text>
      </View>
    </TouchableOpacity>
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
        <Text style={styles.header}>Taxi Services</Text>
      </View>

      <CustomTextInput
        label={null}
        placeholder="Filter by make, model, or driver"
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
        keyExtractor={(item: TaxiService) => item.id}
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
    flexDirection: "row" as const,
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
  carImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  serviceInfo: {
    flex: 1,
    justifyContent: "center" as const,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#002045",
    fontFamily: "Exo-Regular",
  },
  serviceDetail: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Exo-Regular",
    marginTop: 5,
  },
  headerListStyle: {
    marginBottom: 20,
  },
});