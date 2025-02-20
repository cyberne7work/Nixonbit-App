import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import MapView, { Marker } from "react-native-maps";
import { CustomTextInput } from "@/components/CustomTextInput";

const WasteManagementScreen = () => {
  const [location, setLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState("");
  const [reportedIssues, setReportedIssues] = useState([]);

  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "Sorry, we need camera roll permissions to upload photos."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSubmitReport = () => {
    if (!description || !photo) {
      Alert.alert(
        "Incomplete Report",
        "Please provide a description and upload a photo."
      );
      return;
    }

    const newIssue = {
      id: Date.now(),
      location,
      photo,
      description,
      status: "Pending",
    };

    setReportedIssues([...reportedIssues, newIssue]);
    setDescription("");
    setPhoto(null);
    Alert.alert("Report Submitted", "Thank you for reporting the waste issue!");
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
        <Text style={styles.header}>Waste Management</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Map to Mark Waste Location */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={(e) => setLocation(e.nativeEvent.coordinate)}
          >
            <Marker coordinate={location} />
          </MapView>
        </View>

        {/* Upload Photo */}
        <TouchableOpacity style={styles.uploadButton} onPress={handlePickPhoto}>
          <Text style={styles.uploadButtonText}>
            {photo ? "Change Photo" : "Upload Photo"}
          </Text>
        </TouchableOpacity>
        {photo && <Image source={{ uri: photo }} style={styles.photo} />}

        {/* Waste Details Form */}
        <CustomTextInput
        label="Describe Details"
          style={styles.input}
          placeholder="Describe the waste (e.g., plastic, organic, hazardous)"
          value={description}
          onChangeText={setDescription}
          multiple
          autoCapitalize="none"

        />

        {/* Submit Report Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitReport}
        >
          <Text style={styles.submitButtonText}>Submit Report</Text>
        </TouchableOpacity>

        {/* Reported Issues List */}
        <Text style={styles.sectionTitle}>Reported Issues</Text>
        {reportedIssues.map((issue) => (
          <View key={issue.id} style={styles.issueCard}>
            <Image source={{ uri: issue.photo }} style={styles.issuePhoto} />
            <Text style={styles.issueDescription}>{issue.description}</Text>
            <Text style={styles.issueStatus}>Status: {issue.status}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 18,
    fontFamily: "Exo-Regular",
    textAlign: "center",
    color: "#002045",
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  mapContainer: {
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  map: {
    flex: 1,
  },
  uploadButton: {
    backgroundColor: "#3470E4",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Exo-Regular",
  },
  photo: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 30,
    // minHeight: 100,
  },
  submitButton: {
    backgroundColor: "#3470E4",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Exo-Regular",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#002045",
  },
  issueCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  issuePhoto: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  issueDescription: {
    fontSize: 16,
    marginBottom: 5,
    color: "#002045",
  },
  issueStatus: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
  },
});

export default WasteManagementScreen;
