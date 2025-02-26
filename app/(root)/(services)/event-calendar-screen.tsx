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

// Define TypeScript interfaces for event data
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Event {
  id: string;
  title: string;
  type: string; // e.g., "Festival", "Workshop", "Meeting"
  date: string; // e.g., "2025-03-01 14:00"
  location: string;
  description: string;
  contactPhone: string | null;
  coordinates: Coordinates | null;
  organizer: string;
}

// Mock data for events
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Spring Festival",
    type: "Festival",
    date: "2025-03-15 10:00",
    location: "Golden Gate Park, San Francisco, CA",
    description:
      "A family-friendly festival with music, food stalls, and activities.",
    contactPhone: "415-831-2700",
    coordinates: { latitude: 37.7694, longitude: -122.4862 },
    organizer: "SF Parks Department",
  },
  {
    id: "2",
    title: "Book Reading Workshop",
    type: "Workshop",
    date: "2025-03-20 18:00",
    location: "New York Public Library, New York, NY",
    description:
      "An interactive workshop for book lovers with guest authors.",
    contactPhone: "917-275-6975",
    coordinates: { latitude: 40.7532, longitude: -73.9823 },
    organizer: "NYPL Events Team",
  },
  {
    id: "3",
    title: "Community Meeting",
    type: "Meeting",
    date: "2025-03-25 19:00",
    location: "Seattle Community Center, Seattle, WA",
    description:
      "Monthly meeting to discuss community safety and projects.",
    contactPhone: "206-684-4753",
    coordinates: { latitude: 47.6062, longitude: -122.3321 },
    organizer: "Seattle Community Board",
  },
  {
    id: "4",
    title: "Online Safety Webinar",
    type: "Webinar",
    date: "2025-03-30 15:00",
    location: "Remote",
    description:
      "A virtual event on personal safety tips and resources.",
    contactPhone: "800-555-5555",
    coordinates: null,
    organizer: "National Safety Council",
  },
];

export default function EventCalendarScreen() {
  const router = useRouter();
  const [filterText, setFilterText] = useState<string>("");

  // Filter events based on title or location
  const filteredEvents: Event[] = mockEvents.filter(
    (event) =>
      event.title.toLowerCase().includes(filterText.toLowerCase()) ||
      event.location.toLowerCase().includes(filterText.toLowerCase())
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
      Alert.alert("Info", "This is a remote event with no physical location.");
      return;
    }
    const { latitude, longitude } = coordinates;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url).catch((err) =>
      Alert.alert("Error", "Failed to open maps: " + err.message)
    );
  };

  // Function to share event
  const handleShare = (event: Event): void => {
    const message = `${event.title}\nType: ${event.type}\nDate: ${event.date}\nLocation: ${event.location}\nPhone: ${event.contactPhone || "N/A"}\nOrganizer: ${event.organizer}`;
    Linking.openURL(`sms:&body=${encodeURIComponent(message)}`).catch((err) =>
      Alert.alert("Error", "Failed to share: " + err.message)
    );
  };

  const renderEventItem = ({ item }: { item: Event }) => (
    <View style={styles.eventItem}>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/(root)/(services)/event-calendar-detailed-screen",
            params: { event: JSON.stringify(item) },
          })
        }
      >
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventType}>{item.type}</Text>
        <Text style={styles.eventDate}>{item.date}</Text>
        <Text style={styles.eventLocation}>{item.location}</Text>
        <Text style={styles.eventDescription}>{item.description}</Text>
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
        <Text style={styles.header}>Event Calendar</Text>
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
        data={filteredEvents}
        renderItem={renderEventItem}
        keyExtractor={(item: Event) => item.id}
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
  eventItem: {
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
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#002045",
    fontFamily: "Exo-Regular",
  },
  eventType: {
    fontSize: 16,
    color: "#888",
    fontFamily: "Exo-Regular",
    marginVertical: 5,
  },
  eventDate: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Exo-Regular",
  },
  eventLocation: {
    fontSize: 14,
    color: "#3470E4",
    fontFamily: "Exo-Regular",
    marginTop: 5,
  },
  eventDescription: {
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