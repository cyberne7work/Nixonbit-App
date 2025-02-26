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

// Define TypeScript interfaces for shopping deal data (reused from list screen)
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface ShoppingDeal {
  id: string;
  title: string;
  store: string;
  location: string;
  description: string;
  discount: string;
  contactPhone: string | null;
  coordinates: Coordinates | null;
  validUntil: string;
}

export default function ShoppingDealsDetailedScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const deal: ShoppingDeal | null = params.deal
    ? JSON.parse(params.deal as string)
    : null;

  console.log("Deal data:", deal);

  if (!deal) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No shopping deal details available</Text>
      </SafeAreaView>
    );
  }

  const handleCall = (): void => {
    if (!deal.contactPhone) {
      Alert.alert("Info", "No contact phone number available.");
      return;
    }
    const url = `tel:${deal.contactPhone}`;
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
    if (!deal.coordinates) {
      Alert.alert("Info", "This is an online deal with no physical location.");
      return;
    }
    const { latitude, longitude } = deal.coordinates;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url).catch((err) =>
      Alert.alert("Error", "Failed to open maps: " + err.message)
    );
  };

  const handleShare = (): void => {
    const message = `${deal.title}\nStore: ${deal.store}\nLocation: ${deal.location}\nDiscount: ${deal.discount}\nPhone: ${deal.contactPhone || "N/A"}\nValid Until: ${deal.validUntil}`;
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
          {deal.title}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.dealDetails}>
          <Text style={styles.store}>Store: {deal.store}</Text>
          <Text style={styles.location}>{deal.location}</Text>
          <Text style={styles.discount}>Discount: {deal.discount}</Text>
          <Text style={styles.contactPhone}>
            Phone: {deal.contactPhone || "Not available"}
          </Text>
          <Text style={styles.validUntil}>Valid Until: {deal.validUntil}</Text>

          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{deal.description}</Text>
          </View>

          <View style={styles.actionButtons}>
            {deal.contactPhone && (
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

          <TouchableOpacity style={styles.shopButton}>
            <Text style={styles.shopButtonText}>Shop Now</Text>
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
  dealDetails: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  store: {
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
  discount: {
    fontSize: 16,
    color: "#888",
    fontFamily: "Exo-Regular",
    marginBottom: 5,
  },
  contactPhone: {
    fontSize: 16,
    color: "#888",
    fontFamily: "Exo-Regular",
    marginBottom: 5,
  },
  validUntil: {
    fontSize: 16,
    color: "#888",
    fontFamily: "Exo-Regular",
    marginBottom: 15,
  },
  descriptionContainer: {
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
  shopButton: {
    backgroundColor: "#3470E4",
    padding: 15,
    borderRadius: 8,
    alignItems: "center" as const,
  },
  shopButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Exo-Regular",
    fontWeight: "bold" as const,
  },
});