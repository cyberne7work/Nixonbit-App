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
import { useRouter, useLocalSearchParams } from "expo-router";
import { CustomTextInput } from "@/components/CustomTextInput";

// Mock data for job listings with added fields
const mockJobListings = [
  {
    id: "1",
    title: "Senior Software Engineer SD",
    company: "TechCorp",
    location: "San Francisco, CA",
    description:
      "Join our innovative team to design and develop cutting-edge applications.",
    type: "Full-Time",
    salary: "$140,000 - $180,000",
    requirements: [
      "5+ years of software development experience",
      "Proficiency in React Native and JavaScript",
    ],
    postedDate: "2025-02-10",
    contactPhone: "415-555-1234", // Added for call feature
    coordinates: { latitude: 37.7749, longitude: -122.4194 }, // For location
  },
  {
    id: "2",
    title: "Data Scientist",
    company: "Data Innovators",
    location: "New York, NY",
    description:
      "Seeking a skilled Data Scientist to analyze complex datasets.",
    type: "Contract",
    salary: "$70 - $100 per hour",
    requirements: [
      "Advanced degree in Statistics or Computer Science",
      "Expertise in Python",
    ],
    postedDate: "2025-02-15",
    contactPhone: "212-555-5678",
    coordinates: { latitude: 40.7128, longitude: -74.0060 },
  },
  {
    id: "3",
    title: "Frontend Developer",
    company: "Creative Solutions",
    location: "Remote",
    description:
      "Create beautiful, responsive web applications remotely.",
    type: "Part-Time",
    salary: "$90,000 - $120,000 (pro-rated)",
    requirements: ["3+ years of frontend experience", "Expertise in React.js"],
    postedDate: "2025-02-18",
    contactPhone: "800-555-9012",
    coordinates: null, // Remote job, no specific coordinates
  },
  {
    id: "4",
    title: "DevOps Engineer",
    company: "CloudMasters",
    location: "Seattle, WA",
    description:
      "Build and maintain robust CI/CD pipelines and cloud infrastructure.",
    type: "Full-Time",
    salary: "$130,000 - $160,000",
    requirements: ["Experience with Docker", "Knowledge of CI/CD tools"],
    postedDate: "2025-02-12",
    contactPhone: "206-555-3456",
    coordinates: { latitude: 47.6062, longitude: -122.3321 },
  },
];

export default function JobListingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const jobListings = params.jobListings
    ? JSON.parse(params.jobListings)
    : mockJobListings;

  const [filterText, setFilterText] = useState("");

  const filteredJobListings = jobListings.filter(
    (job) =>
      job.title.toLowerCase().includes(filterText.toLowerCase()) ||
      job.company.toLowerCase().includes(filterText.toLowerCase())
  );

  const navigateToJobDetail = (job) => {
    console.log(job);
    router.push({
      pathname: "/(root)/(services)/explore-detailed-screen",
      params: { job: JSON.stringify(job) },
    });
  };

  // Function to handle phone call
  const handleCall = (phoneNumber) => {
    const url = `tel:${phoneNumber}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Error", "Phone calls are not supported on this device.");
        }
      })
      .catch((err) => Alert.alert("Error", "Failed to make a call: " + err.message));
  };

  // Function to open location in maps
  const handleLocation = (location, coordinates) => {
    if (!coordinates) {
      Alert.alert("Info", "This is a remote job with no specific location.");
      return;
    }
    const { latitude, longitude } = coordinates;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url).catch((err) =>
      Alert.alert("Error", "Failed to open maps: " + err.message)
    );
  };

  // Function to share job (optional feature)
  const handleShare = (job) => {
    const message = `${job.title} at ${job.company}\nLocation: ${job.location}\nSalary: ${job.salary}\nApply now!`;
    Linking.openURL(`sms:&body=${encodeURIComponent(message)}`).catch((err) =>
      Alert.alert("Error", "Failed to share: " + err.message)
    );
  };

  const renderJobItem = ({ item }) => (
    <View style={styles.jobItem}>
      <TouchableOpacity onPress={() => navigateToJobDetail(item)}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text style={styles.jobCompany}>{item.company}</Text>
        <Text style={styles.jobLocation}>{item.location}</Text>
        <Text style={styles.jobType}>Type: {item.type}</Text>
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
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#002045" />
        </TouchableOpacity>
        <Text style={styles.header}>Job Listings</Text>
      </View>

      <CustomTextInput
        label={null}
        placeholder="Filter by title or company"
        value={filterText}
        onChangeText={(text) => setFilterText(text)}
        autoCapitalize="none"
        style={{
          marginHorizontal: 5,
          marginVertical: 5,
        }}
      />

      <FlatList
        data={filteredJobListings}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.id}
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
    transform: [{ translateY: -12 }], // Vertically center the icon
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  jobItem: {
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
  jobTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#002045",
    fontFamily: "Exo-Regular",
  },
  jobCompany: {
    fontSize: 16,
    color: "#666",
    marginVertical: 5,
    fontFamily: "Exo-Regular",
  },
  jobLocation: {
    fontSize: 14,
    color: "#3470E4",
    fontFamily: "Exo-Regular",
  },
  jobType: {
    fontSize: 14,
    color: "#888",
    fontFamily: "Exo-Regular",
  },
  headerListStyle: {
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  actionText: {
    marginLeft: 5,
    color: "#3470E4",
    fontSize: 14,
    fontFamily: "Exo-Regular",
  },
});