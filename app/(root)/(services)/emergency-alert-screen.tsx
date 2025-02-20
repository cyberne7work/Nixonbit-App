import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as Contacts from "expo-contacts";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { CustomTextInput } from "@/components/CustomTextInput";
import * as SMS from "expo-sms"; // Import SMS module

const dummyContacts = [
  { id: "1", name: "John Doe", phone: "+91 8797971422", relation: "Father" },
  { id: "2", name: "Jane Doe", phone: "+91 8603678862", relation: "Mother" },
  {
    id: "3",
    name: "Mike Johnson",
    phone: "+91 7004008576",
    relation: "Brother",
  },
  {
    id: "4",
    name: "Sarah Williams",
    phone: "+91 9631862492",
    relation: "Sister",
  },
];

export default function EmergencyAlertScreen() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState(dummyContacts);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    relation: "",
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Allow location access to use emergency features."
        );
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      setLocation(coords);
      setLoading(false);
    })();
  }, []);

  const handleShareLocation = async () => {
    if (!location) {
      Alert.alert("Location Not Available", "Please allow location access.");
      return;
    }
    const message = `🚨 SOS Alert! I need help. My current location is:
    📍 Latitude: ${location.latitude}
    📍 Longitude: ${location.longitude}
    🔗 Google Maps: https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;

    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      const contactNumbers = contacts.map((contact) => contact.phone);
      await SMS.sendSMSAsync(contactNumbers, message);
      Alert.alert(
        "Location Sent",
        "Your location has been shared with contacts."
      );
    } else {
      Alert.alert("SMS Not Available", "Your device does not support SMS.");
    }
  };

  const handleCallContact = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  const handleAddOrUpdateContact = () => {
    if (!newContact.name || !newContact.phone || !newContact.relation) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (newContact.id) {
      // Editing existing contact
      setContacts(
        contacts.map((contact) =>
          contact.id === newContact.id ? newContact : contact
        )
      );
    } else {
      // Adding new contact
      setContacts([
        ...contacts,
        { ...newContact, id: (contacts.length + 1).toString() },
      ]);
    }

    setIsModalVisible(false);
    setNewContact({ name: "", phone: "", relation: "" });
  };

  // Function to edit contact
  const handleEditContact = (contact) => {
    setNewContact(contact);
    setIsModalVisible(true);
  };

  // Function to delete contact
  const handleDeleteContact = (id) => {
    Alert.alert(
      "Delete Contact",
      "Are you sure you want to delete this contact?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            setContacts(contacts.filter((contact) => contact.id !== id));
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            console.log("Button pressed");
            router.back();
          }}
        >
          <MaterialIcons name="arrow-back" size={24} color="#002045" />
        </TouchableOpacity>
        <Text style={styles.header}>Emergency Alert</Text>
      </View>
      {/* Map Section */}
      <View style={styles.mapContainer}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: location?.latitude || 37.7749,
            longitude: location?.longitude || -122.4194,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation
        >
          {location && <Marker coordinate={location} title="Your Location" />}
        </MapView>
        {loading && (
          <ActivityIndicator
            size="large"
            color="#3470E4"
            style={styles.loader}
          />
        )}
      </View>

      <View style={styles.callButtonContainer}>
        <TouchableOpacity
          style={styles.callButtonSOS}
          onPress={() => handleCallContact("911")}
        >
          <Text style={styles.callButtonText}>SOS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.callButtonPolice}
          onPress={() => handleCallContact("911")}
        >
          <Text style={styles.callButtonText}>112</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.callButton}
          onPress={handleShareLocation}
        >
          <Text style={styles.callButtonTextLocation}>Share Location</Text>
        </TouchableOpacity>
      </View>

      {/* Contact List */}
      <Text style={styles.sectionTitle}>Emergency Contacts</Text>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <View>
              <Text style={styles.contactName}>{item.name}</Text>
              <Text style={styles.contactNumber}>{item.phone}</Text>
              <Text style={styles.contactRelation}>
                Relation: {item.relation}
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => handleEditContact(item)}>
                <MaterialIcons name="edit" size={24} color="#3470E4" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteContact(item.id)}>
                <MaterialIcons name="delete" size={24} color="#FF0000" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
            <View>
                <Text style={styles.emptyListText}>No contacts found. Please add your contacts to enable SOS and Share Location.</Text>
  
            </View>
        }
      />

      {/* Add Contact Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsModalVisible(true)}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Add Contact Modal */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Add Emergency Contact</Text>
            <CustomTextInput
              label="Contact Name"
              placeholder="Enter contact name"
              value={newContact.name}
              onChangeText={(text) =>
                setNewContact({ ...newContact, name: text })
              }
              style={styles.input}
              autoCapitalize={"words"}
            />
            <CustomTextInput
              label="Phone Number"
              placeholder="Phone Number"
              value={newContact.phone}
              onChangeText={(text) => {
                // Remove non-numeric characters and limit to 10 digits
                const formattedText = text.replace(/\D/g, "").slice(0, 10);
                setNewContact({ ...newContact, phone: formattedText });
              }}
              keyboardType="phone-pad"
              style={styles.input}
              autoCapitalize="none"
            />
            <CustomTextInput
              label="Relation"
              placeholder="Relation (e.g., Father, Friend)"
              value={newContact.relation}
              onChangeText={(text) =>
                setNewContact({ ...newContact, relation: text })
              }
              style={styles.input}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleAddOrUpdateContact}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    justifyContent: "center",
  },
  header: {
    fontSize: 18,
    color: "#002045",
    fontWeight: "bold",
    fontFamily: "Exo-Regular",
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -12 }],
  },

  // Map
  mapContainer: { width: "100%", height: 300 },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },

  // Contacts
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Exo-Regular",
    color: "#002045",
    margin: 15,
  },
  listContent: { flexGrow: 1 },
  contactItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 15,
  },
  contactName: { fontSize: 16, fontFamily: "Exo-Regular", color: "#002045" },
  contactNumber: { fontSize: 14, color: "#666" },
  contactRelation: { fontSize: 14, color: "#3470E4" },

  // Add Contact Button
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#3470E4",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  // Modal
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Exo-Regular",
    color: "#002045",
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: "#3470E4",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Exo-Regular",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#002045",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Exo-Regular",
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3470E4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: 120,
    height: 50,
  },
  callButtonSOS: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF0000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: 120,
    height: 50,
  },
  callButtonPolice: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF0000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: 120,
    height: 50,
  },
  callbuttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Exo-Bold",
    fontWeight: "bold",
    marginLeft: 10,
  },
  callButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    marginVertical: 20,
  },
  callButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Exo-Bold",
    fontWeight: "bold",
    marginLeft: 10,
  },
  callButtonTextLocation: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Exo-Bold",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10, // Adds spacing between edit and delete buttons
  },
  emptyListText:{
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "Exo-Regular",
  }
});
