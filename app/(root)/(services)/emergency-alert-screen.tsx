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
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { CustomTextInput } from "@/components/CustomTextInput";
import * as SMS from "expo-sms";
import { useAuth,useUser } from '@clerk/clerk-expo';
import { apiRequest } from "@/utils/api";

// Define the type for emergency contacts
interface EmergencyContact {
  id: string;
  contactName: string;
  phoneNumber: string;
  relation: string;
}

export default function EmergencyAlertScreen() {
  const { getToken } = useAuth();
  const { user } = useUser();

  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true); // Separate loading state for location
  const [contactsLoading, setContactsLoading] = useState(true); // Separate loading state for contacts
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newContact, setNewContact] = useState({
    id: "",
    contactName: "",
    phoneNumber: "",
    relation: "",
  });

  // Fetch location
  useEffect(() => {
    (async () => {
      try {
        // Request location permissions
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Required",
            "Allow location access to use emergency features.",
            [
              { text: "OK", onPress: () => setLocationLoading(false) }
            ]
          );
          return;
        }

        // Fetch location with a timeout of 10 seconds
        let locationResult = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          timeInterval: 10000, // Timeout after 10 seconds
        });
        setLocation(locationResult.coords);
      } catch (error) {
        console.error("Error fetching location:", error);
        Alert.alert(
          "Location Error",
          "Failed to fetch location. Please ensure location services are enabled.",
          [
            { text: "OK", onPress: () => setLocationLoading(false) }
          ]
        );
      } finally {
        setLocationLoading(false);
      }
    })();
  }, []);

  // Fetch emergency contacts
  const fetchEmergencyContacts = async (retries = 3, delay = 2000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const token = await getToken();
        const response = await apiRequest('/emergency-contacts', 'GET', null, token);
        if (response.success) {
          return response;
        } else {
          throw new Error(response.message || "Failed to fetch emergency contacts.");
        }
      } catch (error) {
        console.error(`Attempt ${attempt} - Error fetching emergency contacts:`, error);
        if (attempt === retries) throw error;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if(user){
          const response = await fetchEmergencyContacts();
          setContacts(response.data.emergencyContacts.map((contact: any) => ({
            id: contact.id,
            contactName: contact.contactName,
            phoneNumber: contact.phoneNumber,
            relation: contact.relation,
          })));
        }else{
          setContacts([]);

        }
      } catch (error) {
        console.error("Error fetching emergency contacts:", error);
        Alert.alert(
          "Error",
          "Failed to fetch emergency contacts. Please check your network and try again.",
          [
            { text: "Retry", onPress: () => fetchEmergencyContacts().then(response => {
              setContacts(response.data.emergencyContacts.map((contact: any) => ({
                id: contact.id,
                contactName: contact.contactName,
                phoneNumber: contact.phoneNumber,
                relation: contact.relation,
              })));
            })},
            { text: "Cancel", style: "cancel" },
          ]
        );
      } finally {
        setContactsLoading(false);
      }
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
      const contactNumbers = contacts.map((contact) => contact.phoneNumber);
      await SMS.sendSMSAsync(contactNumbers, message);
      Alert.alert(
        "Location Sent",
        "Your location has been shared with contacts."
      );
    } else {
      Alert.alert("SMS Not Available", "Your device does not support SMS.");
    }
  };

  const handleCallContact = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  const handleAddOrUpdateContact = async () => {
    if (!newContact.contactName || !newContact.phoneNumber || !newContact.relation) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const token = await getToken();
      let response;

      if (newContact.id) {
        response = await apiRequest(
          `/emergency-contacts/${newContact.id}`,
          'PUT',
          {
            contactName: newContact.contactName,
            phoneNumber: `+91 ${newContact.phoneNumber}`,
            relation: newContact.relation,
          },
          token
        );

        if (response.success) {
          setContacts(
            contacts.map((contact) =>
              contact.id === newContact.id
                ? {
                    id: newContact.id,
                    contactName: newContact.contactName,
                    phoneNumber: `+91 ${newContact.phoneNumber}`,
                    relation: newContact.relation,
                  }
                : contact
            )
          );
          Alert.alert("Success", "Emergency contact updated successfully.");
        }
      } else {
        response = await apiRequest(
          '/emergency-contacts',
          'POST',
          {
            contactName: newContact.contactName,
            phoneNumber: `+91 ${newContact.phoneNumber}`,
            relation: newContact.relation,
          },
          token
        );

        if (response.success) {
          setContacts([
            ...contacts,
            {
              id: response.data.id,
              contactName: response.data.contactName,
              phoneNumber: response.data.phoneNumber,
              relation: response.data.relation,
            },
          ]);
          Alert.alert("Success", "Emergency contact added successfully.");
        }
      }

      if (!response.success) {
        Alert.alert("Error", response.message || "Failed to save emergency contact.");
      }
    } catch (error) {
      console.error("Error saving emergency contact:", error);
      Alert.alert("Error", "Failed to save emergency contact. Please check your network and try again.");
    } finally {
      setIsModalVisible(false);
      setNewContact({ id: "", contactName: "", phoneNumber: "", relation: "" });
    }
  };

  const handleEditContact = (contact: EmergencyContact) => {
    setNewContact({
      id: contact.id,
      contactName: contact.contactName,
      phoneNumber: contact.phoneNumber.replace("+91 ", ""),
      relation: contact.relation,
    });
    setIsModalVisible(true);
  };

  const handleDeleteContact = async (id: string) => {
    Alert.alert(
      "Delete Contact",
      "Are you sure you want to delete this contact?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const token = await getToken();
              const response = await apiRequest(
                `/emergency-contacts/${id}`,
                'DELETE',
                null,
                token
              );

              if (response.success) {
                setContacts(contacts.filter((contact) => contact.id !== id));
                Alert.alert("Success", "Emergency contact deleted successfully.");
              } else {
                Alert.alert("Error", response.message || "Failed to delete emergency contact.");
              }
            } catch (error) {
              console.error("Error deleting emergency contact:", error);
              Alert.alert("Error", "Failed to delete emergency contact. Please check your network and try again.");
            }
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
        {locationLoading && (
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
          onPress={() => handleCallContact("112")}
        >
          <Text style={styles.callButtonText}>SOS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.callButtonPolice}
          onPress={() => handleCallContact("112")}
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
      {contactsLoading ? (
        <ActivityIndicator size="large" color="#3470E4" style={{ marginVertical: 20 }} />
      ) : (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={contacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.contactItem}>
              <View>
                <Text style={styles.contactName}>{item.contactName}</Text>
                <Text style={styles.contactNumber}>{item.phoneNumber}</Text>
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
              <Text style={styles.emptyListText}>
                No contacts found. Please add your contacts to enable SOS and Share Location.
              </Text>
            </View>
          }
        />
      )}

      {/* Add Contact Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          if(user){
            setIsModalVisible(true);
          }else{
            Alert.alert(
              "Login Required",
              "Please login/signup to add emergency contacts.",
              [
                { text: "OK", onPress: () =>     router.push("/(root)/(auth)/signin")
                }
              ]
            );
          }
        }}
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
              value={newContact.contactName}
              onChangeText={(text) =>
                setNewContact({ ...newContact, contactName: text })
              }
              style={styles.input}
              autoCapitalize="words"
            />
            <CustomTextInput
              label="Phone Number"
              placeholder="Phone Number"
              value={newContact.phoneNumber}
              onChangeText={(text) => {
                const formattedText = text.replace(/\D/g, "").slice(0, 10);
                setNewContact({ ...newContact, phoneNumber: formattedText });
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
  mapContainer: { width: "100%", height: 300 },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
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
    gap: 10,
  },
  emptyListText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "Exo-Regular",
  },
});