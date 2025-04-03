import React, { useState, useEffect } from "react";
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
import { apiRequest } from "@/utils/api"; // Assuming you have this utility

// Define TypeScript interface for job listing
interface Coordinates {
  latitude?: number;
  longitude?: number;
}

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  type: string;
  salary: string;
  requirements: string[];
  postedDate: string;
  contactPhone?: string; // Optional, not in API but in mock
  coordinates?: Coordinates | null; // Optional, not in API but in mock
  mapLink?: string; // From API
  applyLink?: string; // From API
  createdAt: string;
  updatedAt: string;
}

export default function JobListingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobListings = async () => {
      try {
        const response = await apiRequest('/job-listings', 'GET', null, '');
        if (response.success) {
          setJobListings(response.data.jobs);
        } else {
          Alert.alert(
            'Error',
            response.message || 'Failed to fetch job listings.'
          );
          // Fallback to mock data if API fails
          setJobListings([
            {
              id: "1",
              title: "Senior Software Engineer SD",
              company: "TechCorp",
              location: "San Francisco, CA",
              description: "Join our innovative team to design and develop cutting-edge applications.",
              type: "Full-Time",
              salary: "$140,000 - $180,000",
              requirements: ["5+ years of software development experience", "Proficiency in React Native and JavaScript"],
              postedDate: "2025-02-10",
              contactPhone: "415-555-1234",
              coordinates: { latitude: 37.7749, longitude: -122.4194 },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching job listings:', error);
        Alert.alert('Error', 'Failed to fetch job listings.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobListings();
  }, []);

  const filteredJobListings = jobListings.filter(
    (job) =>
      job.title.toLowerCase().includes(filterText.toLowerCase()) ||
      job.company.toLowerCase().includes(filterText.toLowerCase())
  );

  const navigateToJobDetail = (job: JobListing) => {
    router.push({
      pathname: "/(root)/(services)/explore-detailed-screen",
      params: { job: JSON.stringify(job) },
    });
  };

  const handleCall = (phoneNumber?: string) => {
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
      .catch((err) => Alert.alert("Error", "Failed to make a call: " + err.message));
  };

  const handleLocation = (location: string, coordinates?: Coordinates | null, mapLink?: string) => {
    if (mapLink) {
      Linking.openURL(mapLink).catch((err) =>
        Alert.alert("Error", "Failed to open map link: " + err.message)
      );
    } else if (coordinates) {
      const { latitude, longitude } = coordinates;
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      Linking.openURL(url).catch((err) =>
        Alert.alert("Error", "Failed to open maps: " + err.message)
      );
    } else {
      Alert.alert("Info", "This is a remote job with no specific location.");
    }
  };

  const handleShare = (job: JobListing) => {
    const message = `${job.title} at ${job.company}\nLocation: ${job.location}\nSalary: ${job.salary}\nApply now!`;
    Linking.openURL(`sms:&body=${encodeURIComponent(message)}`).catch((err) =>
      Alert.alert("Error", "Failed to share: " + err.message)
    );
  };

  const renderJobItem = ({ item }: { item: JobListing }) => (
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
          onPress={() => handleLocation(item.location, item.coordinates, item.mapLink)}
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

      {loading ? (
        <Text style={styles.loadingText}>Loading job listings...</Text>
      ) : (
        <FlatList
          data={filteredJobListings}
          renderItem={renderJobItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContentContainer}
          ListHeaderComponentStyle={styles.headerListStyle}
        />
      )}
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
    transform: [{ translateY: -12 }],
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
  loadingText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
    fontFamily: "Exo-Regular",
  },
});