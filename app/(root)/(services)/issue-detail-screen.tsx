import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { router, useLocalSearchParams } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';

interface WasteReport {
  id: string;
  description: string;
  location: { latitude: string; longitude: string; address: string };
  photo: string;
  status: string;
}

const IssueDetailScreen = () => {
  const { issue } = useLocalSearchParams();
  const parsedIssue: WasteReport = JSON.parse(issue as string);

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
        <Text style={styles.header}>Issue Details</Text>
      </View>

      {/* Issue Details */}
      <View style={styles.detailsContainer}>
        <Image source={{ uri: parsedIssue.photo }} style={styles.issuePhoto} />
        <Text style={styles.descriptionLabel}>Description</Text>
        <Text style={styles.descriptionText}>{parsedIssue.description}</Text>
        <Text style={styles.statusLabel}>Status</Text>
        <Text style={styles.statusText}>{parsedIssue.status}</Text>
        <Text style={styles.locationLabel}>Location</Text>
        <Text style={styles.locationText}>{parsedIssue.location.address}</Text>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: parseFloat(parsedIssue.location.latitude),
              longitude: parseFloat(parsedIssue.location.longitude),
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: parseFloat(parsedIssue.location.latitude),
                longitude: parseFloat(parsedIssue.location.longitude),
              }}
              title="Issue Location"
            />
          </MapView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
  },
  header: {
    fontSize: 18,
    color: '#002045',
    textAlign: 'center',
    fontFamily: 'Exo-Regular',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  detailsContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  issuePhoto: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  descriptionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    fontFamily: 'Exo-Regular',
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    fontFamily: 'Exo-Regular',
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    fontFamily: 'Exo-Regular',
  },
  statusText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    fontFamily: 'Exo-Regular',
  },
  locationLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    fontFamily: 'Exo-Regular',
  },
  locationText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    fontFamily: 'Exo-Regular',
  },
  mapContainer: {
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  map: {
    flex: 1,
  },
});

export default IssueDetailScreen;
