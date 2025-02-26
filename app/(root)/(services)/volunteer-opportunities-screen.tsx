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

// Define TypeScript interfaces for volunteer opportunity data
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface VolunteerOpportunity {
  id: string;
  title: string;
  type: string; // e.g., "Community Service", "Animal Care", "Education"
  location: string;
  description: string;
  contactPhone: string | null;
  coordinates: Coordinates | null;
  schedule: string; // e.g., "Weekends", "Mon-Fri 9 AM - 5 PM"
  organization: string;
}

// Mock data for volunteer opportunities
const mockVolunteerOpportunities: VolunteerOpportunity[] = [
  {
    id: "1",
    title: "Beach Cleanup Crew",
    type: "Community Service",
    location: "San Francisco, CA",
    description:
      "Help keep our beaches clean by joining our weekend cleanup crew.",
    contactPhone: "415-555-9876",
    coordinates: { latitude: 37.7749, longitude: -122.4194 },
    schedule: "Saturdays 9 AM - 12 PM",
    organization: "SF Environmental Group",
  },
  {
    id: "2",
    title: "Animal Shelter Assistant",
    type: "Animal Care",
    location: "New York, NY",
    description:
      "Assist with feeding, walking, and caring for shelter animals.",
    contactPhone: "212-555-5432",
    coordinates: { latitude: 40.7128, longitude: -74.0060 },
    schedule: "Mon-Fri 10 AM - 4 PM",
    organization: "NYC Animal Rescue",
  },
  {
    id: "3",
    title: "Tutoring Program",
    type: "Education",
    location: "Seattle, WA",
    description:
      "Tutor children in reading and math after school.",
    contactPhone: "206-555-6789",
    coordinates: { latitude: 47.6062, longitude: -122.3321 },
    schedule: "Wednesdays 3 PM - 6 PM",
    organization: "Seattle Education Network",
  },
  {
    id: "4",
    title: "Virtual Volunteer Coordinator",
    type: "Support Service",
    location: "Remote",
    description:
      "Coordinate volunteer efforts online from anywhere.",
    contactPhone: "800-555-1234",
    coordinates: null,
    schedule: "Flexible",
    organization: "Global Volunteer Hub",
  },
];

export default function VolunteerOpportunitiesScreen() {
  const router = useRouter();
  const [filterText, setFilterText] = useState<string>("");

  // Filter volunteer opportunities based on title or location
  const filteredOpportunities: VolunteerOpportunity[] = mockVolunteerOpportunities.filter(
    (opportunity) =>
      opportunity.title.toLowerCase().includes(filterText.toLowerCase()) ||
      opportunity.location.toLowerCase().includes(filterText.toLowerCase())
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
      Alert.alert("Info", "This is a remote opportunity with no physical location.");
      return;
    }
    const { latitude, longitude } = coordinates;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url).catch((err) =>
      Alert.alert("Error", "Failed to open maps: " + err.message)
    );
  };

  // Function to share opportunity
  const handleShare = (opportunity: VolunteerOpportunity): void => {
    const message = `${opportunity.title}\nType: ${opportunity.type}\nLocation: ${opportunity.location}\nPhone: ${opportunity.contactPhone || "N/A"}\nSchedule: ${opportunity.schedule}\nOrganization: ${opportunity.organization}`;
    Linking.openURL(`sms:&body=${encodeURIComponent(message)}`).catch((err) =>
      Alert.alert("Error", "Failed to share: " + err.message)
    );
  };

  const renderOpportunityItem = ({ item }: { item: VolunteerOpportunity }) => (
    <View style={styles.opportunityItem}>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/(root)/(services)/volunteer-opportunities-detailed-screen",
            params: { opportunity: JSON.stringify(item) },
          })
        }
      >
        <Text style={styles.opportunityTitle}>{item.title}</Text>
        <Text style={styles.opportunityType}>{item.type}</Text>
        <Text style={styles.opportunityLocation}>{item.location}</Text>
        <Text style={styles.opportunityDescription}>{item.description}</Text>
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
        <Text style={styles.header}>Volunteer Opportunities</Text>
      </View>

      <CustomTextInput
        label={null}
        placeholder="Filter by title or location"
        value={filterText}
        onChangeText={(text: string) => setFilterText(text)}
        autoCapitalize="none"
        style={{
          marginHorizontal: 5,
          marginVertical: 5,
        }}
      />

      <FlatList
        data={filteredOpportunities}
        renderItem={renderOpportunityItem}
        keyExtractor={(item: VolunteerOpportunity) => item.id}
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
  opportunityItem: {
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
  opportunityTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#002045",
    fontFamily: "Exo-Regular",
  },
  opportunityType: {
    fontSize: 16,
    color: "#888",
    fontFamily: "Exo-Regular",
    marginVertical: 5,
  },
  opportunityLocation: {
    fontSize: 14,
    color: "#3470E4",
    fontFamily: "Exo-Regular",
  },
  opportunityDescription: {
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