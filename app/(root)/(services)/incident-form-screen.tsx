import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  ActivityIndicator, 
  SafeAreaView
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { CustomTextInput } from "@/components/CustomTextInput";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function IncidentFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const existingIncident = params.incident ? JSON.parse(params.incident) : null;

  const [incident, setIncident] = useState(
    existingIncident || { title: "", description: "", type: "", location: null }
  );
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(true);

  // Fetch current location when form is opened
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission Required", "Allow location access to use this feature.");
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      setIncident((prev) => ({
        ...prev,
        location: prev.location || coords, // Set default location only if not already set
      }));
      setLoadingLocation(false);
    })();
  }, []);

  const handleSaveIncident = () => {
    if (!incident.title || !incident.description || !incident.type || !incident.location) {
      alert("Please fill all fields and select a location.");
      return;
    }

    router.push("/(root)/(services)/incident-reporting-screen");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#002045" />
        </TouchableOpacity>
        <Text style={styles.header}>
          {existingIncident ? "Edit Incident" : "Add Incident"}
        </Text>
      </View>

      <View style={{ marginHorizontal: 20 }}>
      {/* Incident Form */}
      <CustomTextInput
        label="Title"
        placeholder={"Enter incident title (e.g. Incident)"}
        value={incident.title}
        onChangeText={(text) => setIncident({ ...incident, title: text })}
        autoCapitalize={"none"}
      />
      <CustomTextInput
        placeholder={"Enter incident description"}
        label="Description"
        value={incident.description}
        onChangeText={(text) => setIncident({ ...incident, description: text })}
        autoCapitalize={"none"}
      />
      <CustomTextInput
        placeholder={"Enter incident type"}
        label="Type of Incident (e.g. Accident, Fire, etc.)"
        value={incident.type}
        onChangeText={(text) => setIncident({ ...incident, type: text })}
        autoCapitalize={"none"}
      />

      {/* Select Location Button */}
      <TouchableOpacity style={styles.selectLocationButton} onPress={() => setIsMapVisible(true)}>
        <Text style={styles.selectLocationText}>
          {incident.location ? "Update Location" : "Select Location"}
        </Text>
      </TouchableOpacity>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveIncident}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      {/* Location Picker Modal */}
      <Modal visible={isMapVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.mapWrapper}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: incident.location?.latitude || 37.7749,
                longitude: incident.location?.longitude || -122.4194,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              onPress={(e) => setIncident({ ...incident, location: e.nativeEvent.coordinate })}
            >
              {incident.location && <Marker coordinate={incident.location} title="Selected Location" />}
            </MapView>
            {loadingLocation && <ActivityIndicator size="large" color="#3470E4" style={styles.loader} />}
          </View>

          {/* Confirm Location Button at the Bottom */}
          <TouchableOpacity style={styles.confirmButton} onPress={() => setIsMapVisible(false)}>
            <Text style={styles.confirmButtonText}>Confirm Location</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      </View>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    justifyContent: "center",
  },
  header: {
    fontSize: 18,
    color: "#002045",
    fontFamily:"Exo-Regular",
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  selectLocationButton: {
    backgroundColor: "#3470E4",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  selectLocationText: {
    color: "#fff",
    fontSize: 16,
    fontFamily:"Exo-Regular",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20, // Reduced margin for better spacing
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Exo-Regular",
  },
  modalContainer: {
    flex: 1,
    // justifyContent: "flex-end",
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  mapWrapper: {
    flex: 1, // Makes sure map takes full space
    backgroundColor: "#f5f5f5",
  },
  map: {
    width: "100%",
    height: "95%", // Adjusted to leave space for confirm button
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  confirmButton: {
    backgroundColor: "#3470E4",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 30,
    marginBottom: 20,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily:"Exo-Regular",
  },
});

