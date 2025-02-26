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

// Define TypeScript interfaces for shopping deal data
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface ShoppingDeal {
  id: string;
  title: string;
  store: string; // e.g., "Walmart", "Amazon"
  location: string;
  description: string;
  discount: string; // e.g., "20% off", "$10 off"
  contactPhone: string | null;
  coordinates: Coordinates | null;
  validUntil: string; // e.g., "2025-03-31"
}

// Mock data for shopping deals
const mockShoppingDeals: ShoppingDeal[] = [
  {
    id: "1",
    title: "Spring Sale",
    store: "Walmart",
    location: "San Francisco, CA",
    description:
      "Get 20% off on all spring clothing and accessories.",
    discount: "20% off",
    contactPhone: "415-555-1111",
    coordinates: { latitude: 37.7749, longitude: -122.4194 },
    validUntil: "2025-03-31",
  },
  {
    id: "2",
    title: "Electronics Blowout",
    store: "Best Buy",
    location: "New York, NY",
    description:
      "Save big on TVs, laptops, and more during our blowout sale.",
    discount: "$50 off $200+",
    contactPhone: "212-555-2222",
    coordinates: { latitude: 40.7128, longitude: -74.0060 },
    validUntil: "2025-04-15",
  },
  {
    id: "3",
    title: "Outdoor Gear Discount",
    store: "REI",
    location: "Seattle, WA",
    description:
      "Special discount on camping and hiking gear.",
    discount: "15% off",
    contactPhone: "206-555-3333",
    coordinates: { latitude: 47.6062, longitude: -122.3321 },
    validUntil: "2025-03-20",
  },
  {
    id: "4",
    title: "Online Flash Sale",
    store: "Amazon",
    location: "Remote",
    description:
      "Limited-time flash sale on select online products.",
    discount: "Up to 30% off",
    contactPhone: "800-555-4444",
    coordinates: null,
    validUntil: "2025-03-25",
  },
];

export default function ShoppingDealsScreen() {
  const router = useRouter();
  const [filterText, setFilterText] = useState<string>("");

  // Filter shopping deals based on title or store
  const filteredDeals: ShoppingDeal[] = mockShoppingDeals.filter(
    (deal) =>
      deal.title.toLowerCase().includes(filterText.toLowerCase()) ||
      deal.store.toLowerCase().includes(filterText.toLowerCase())
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
      Alert.alert("Info", "This is an online deal with no physical location.");
      return;
    }
    const { latitude, longitude } = coordinates;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url).catch((err) =>
      Alert.alert("Error", "Failed to open maps: " + err.message)
    );
  };

  // Function to share deal
  const handleShare = (deal: ShoppingDeal): void => {
    const message = `${deal.title}\nStore: ${deal.store}\nLocation: ${deal.location}\nDiscount: ${deal.discount}\nPhone: ${deal.contactPhone || "N/A"}\nValid Until: ${deal.validUntil}`;
    Linking.openURL(`sms:&body=${encodeURIComponent(message)}`).catch((err) =>
      Alert.alert("Error", "Failed to share: " + err.message)
    );
  };

  const renderDealItem = ({ item }: { item: ShoppingDeal }) => (
    <View style={styles.dealItem}>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/(root)/(services)/shopping-deals-detailed-screen",
            params: { deal: JSON.stringify(item) },
          })
        }
      >
        <Text style={styles.dealTitle}>{item.title}</Text>
        <Text style={styles.dealStore}>{item.store}</Text>
        <Text style={styles.dealLocation}>{item.location}</Text>
        <Text style={styles.dealDescription}>{item.description}</Text>
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
        <Text style={styles.header}>Shopping Deals</Text>
      </View>

      <CustomTextInput
        label={null}
        placeholder="Filter by title or store"
        value={filterText}
        onChangeText={(text: string) => setFilterText(text)}
        autoCapitalize="none"
        style={{
          marginHorizontal: 5,
          marginVertical: 5,
        }}
      />

      <FlatList
        data={filteredDeals}
        renderItem={renderDealItem}
        keyExtractor={(item: ShoppingDeal) => item.id}
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
  dealItem: {
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
  dealTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#002045",
    fontFamily: "Exo-Regular",
  },
  dealStore: {
    fontSize: 16,
    color: "#888",
    fontFamily: "Exo-Regular",
    marginVertical: 5,
  },
  dealLocation: {
    fontSize: 14,
    color: "#3470E4",
    fontFamily: "Exo-Regular",
  },
  dealDescription: {
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