import React, { useState, useEffect } from "react";
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
import { apiRequest } from "@/utils/api";

// Define TypeScript interfaces for pet service data
interface Coordinates {
  latitude?: number;
  longitude?: number;
}

interface PetService {
  id: string;
  name: string;
  type: string;
  location: string;
  description: string;
  phone: string | null; // Changed from contactPhone to match API
  coordinates?: Coordinates | null; // Optional, not in API
  hours: string;
  servicesOffered: string[];
  mapLink?: string; // From API
  bookingLink?: string; // From API
  createdAt: string;
  updatedAt: string;
}

export default function PetServicesScreen() {
  const router = useRouter();
  const [filterText, setFilterText] = useState<string>("");
  const [petServices, setPetServices] = useState<PetService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPetServices = async () => {
      try {
        const response = await apiRequest('/pet-services', 'GET', null, '');
        if (response.success) {
          setPetServices(response.data.services);
        } else {
          Alert.alert(
            'Error',
            response.message || 'Failed to fetch pet services.',
            // Fallback to mock data if API fails
            [{ text: 'OK', onPress: () => setPetServices([
              {
                id: "1",
                name: "Paws & Claws Grooming",
                type: "Grooming",
                location: "San Francisco, CA",
                description: "Professional grooming services for dogs and cats.",
                phone: "415-555-4321",
                coordinates: { latitude: 37.7749, longitude: -122.4194 },
                hours: "9 AM - 6 PM",
                servicesOffered: ["Bathing", "Nail Trimming", "Haircuts"],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            ]) }]
          );
        }
      } catch (error) {
        console.error('Error fetching pet services:', error);
        Alert.alert('Error', 'Failed to fetch pet services.');
      } finally {
        setLoading(false);
      }
    };

    fetchPetServices();
  }, []);

  const filteredServices = petServices.filter(
    (service) =>
      service.name.toLowerCase().includes(filterText.toLowerCase()) ||
      service.location.toLowerCase().includes(filterText.toLowerCase())
  );

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

  const handleLocation = (mapLink?: string, coordinates?: Coordinates | null): void => {
    if (mapLink) {
      Linking.openURL(mapLink).catch((err) =>
        Alert.alert("Error", "Failed to open map link: " + err.message)
      );
    } else if (coordinates) {
      const { latitude, longitude } = coordinates;
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      Linking.openURL(url).catch((err) =>
        Alert.alert("Error", "Failed to open maps: " + err.message)
      );
    } else {
      Alert.alert("Info", "No specific location available for this service.");
    }
  };

  const handleShare = (service: PetService): void => {
    const message = `${service.name}\nType: ${service.type}\nLocation: ${service.location}\nPhone: ${service.phone || "N/A"}\nHours: ${service.hours}\nServices: ${service.servicesOffered.join(", ")}`;
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
        {item.phone && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleCall(item.phone)}
          >
            <MaterialIcons name="phone" size={20} color="#3470E4" />
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLocation(item.mapLink, item.coordinates)}
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

      {loading ? (
        <Text style={styles.loadingText}>Loading pet services...</Text>
      ) : (
        <FlatList
          data={filteredServices}
          renderItem={renderServiceItem}
          keyExtractor={(item: PetService) => item.id}
          contentContainerStyle={styles.listContentContainer}
          ListHeaderComponentStyle={styles.headerListStyle}
        />
      )}
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
  loadingText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
    fontFamily: "Exo-Regular",
  },
});