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
import { router } from "expo-router";
import { CustomTextInput } from "@/components/CustomTextInput";
import IncidentCard from "@/components/IncidentCard";

const dummyIncidents = [
  {
    id: "1",
    title: "Car Accident",
    description: "Two vehicles collided at the intersection.",
    type: "Accident",
    location: { latitude: 37.7749, longitude: -122.4194 },
  },
  {
    id: "2",
    title: "Fire Breakout",
    description: "Fire reported in a residential building.",
    type: "Fire",
    location: { latitude: 34.0522, longitude: -118.2437 },
  },
  {
    id: "3",
    title: "Gas Leak",
    description: "Gas leakage detected in an apartment complex.",
    type: "Hazard",
    location: { latitude: 40.7128, longitude: -74.0060 },
  },
  {
    id: "4",
    title: "Medical Emergency",
    description: "Person fainted at a bus stop.",
    type: "Medical",
    location: { latitude: 51.5074, longitude: -0.1278 },
  },
  {
    id: "5",
    title: "Robbery Attempt",
    description: "Suspicious individuals seen breaking into a store.",
    type: "Crime",
    location: { latitude: 48.8566, longitude: 2.3522 },
  },
  {
    id: "6",
    title: "Flooded Road",
    description: "Heavy rains caused flooding on main street.",
    type: "Weather",
    location: { latitude: 35.6895, longitude: 139.6917 },
  },
  {
    id: "7",
    title: "Power Outage",
    description: "Entire neighborhood lost electricity.",
    type: "Utility",
    location: { latitude: 41.8781, longitude: -87.6298 },
  },
  {
    id: "8",
    title: "Lost Child",
    description: "A child was found wandering alone in the mall.",
    type: "Missing Person",
    location: { latitude: 28.7041, longitude: 77.1025 },
  },
  {
    id: "9",
    title: "Earthquake Tremors",
    description: "Mild earthquake tremors felt in the area.",
    type: "Earthquake",
    location: { latitude: -33.8688, longitude: 151.2093 },
  },
  {
    id: "10",
    title: "Chemical Spill",
    description: "Chemical leakage in a nearby factory.",
    type: "Hazard",
    location: { latitude: 19.0760, longitude: 72.8777 },
  },
];


export default function IncidentReportScreen() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [incidents, setIncidents] = useState(dummyIncidents);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [newIncident, setNewIncident] = useState({
    title: "",
    description: "",
    type: "",
    location: null,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Allow location access.");
        return;
      }
  
      let { coords } = await Location.getCurrentPositionAsync({});
      setLocation(coords);
      setLoading(false);
    })();
  }, []); // Adding [] makes it run only once when the component mounts
  
  

  // Function to save or update an incident report
  const handleSaveOrUpdateIncident = () => {
    if (!newIncident.title || !newIncident.description || !newIncident.type) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (!selectedLocation) {
      Alert.alert(
        "Select Location",
        "Please select the location of the incident."
      );
      return;
    }

    const updatedIncident = { ...newIncident, location: selectedLocation };

    if (newIncident.id) {
      setIncidents(
        incidents.map((incident) =>
          incident.id === newIncident.id ? updatedIncident : incident
        )
      );
    } else {
      setIncidents([
        ...incidents,
        { ...updatedIncident, id: (incidents.length + 1).toString() },
      ]);
    }

    setIsModalVisible(false);
    setNewIncident({ title: "", description: "", type: "", location: null });
    setSelectedLocation(null);
  };

  // Function to edit an incident report
  const handleEditIncident = (incident) => {
    setNewIncident(incident);
    setSelectedLocation(incident.location);
    setIsModalVisible(true);
  };

  // Function to delete an incident report
  const handleDeleteIncident = (id) => {
    Alert.alert(
      "Delete Incident",
      "Are you sure you want to delete this report?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            setIncidents(incidents.filter((incident) => incident.id !== id));
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
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#002045" />
        </TouchableOpacity>
        <Text style={styles.header}>Incident Report</Text>
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
          {location && (
            <Marker coordinate={location} title="Current Location" />
          )}
        </MapView>
        {loading && (
          <ActivityIndicator
            size="large"
            color="#3470E4"
            style={styles.loader}
          />
        )}
      </View>

      {/* Incident List */}
      <Text style={styles.sectionTitle}>Reported Incidents</Text>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={incidents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <IncidentCard 
            incident={item} 
            onEdit={handleEditIncident} 
            onDelete={handleDeleteIncident}
          />
        )}
        ListEmptyComponent={
          <View>
            <Text style={styles.emptyListText}>No incidents reported yet.</Text>
          </View>
        }
      />

      {/* Add Incident Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/(root)/(services)/incident-form-screen")}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Styles
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
    textAlign: "center",
    fontFamily: "Exo-Regular",
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
  sectionTitle: { fontSize: 18, color: "#002045", margin: 15 },
  listContent: { flexGrow: 1 },
  incidentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 3,
    marginHorizontal: 15,
  },
  incidentTitle: { fontSize: 16, fontWeight: "bold", color: "#002045" },
  incidentDescription: { fontSize: 14, color: "#666" },
  incidentType: { fontSize: 14, color: "#3470E4" },
  iconContainer: { flexDirection: "row", alignItems: "center", gap: 10 },
  emptyListText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 20,
  },
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
    fontFamily: "Exo-Bold",
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
    marginBottom: 10,
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
});
