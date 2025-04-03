import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { useAuth } from '@clerk/clerk-expo';
import { apiRequest } from '@/utils/api';

export default function IncidentDetailsScreen() {
  const router = useRouter();
  const { getToken, userId } = useAuth();
  const params = useLocalSearchParams();
  const incident = params.incident ? JSON.parse(params.incident) : null;
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);



  if (!incident) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Incident not found!</Text>
      </View>
    );
  }

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
        <Text style={styles.header}>Incident Details</Text>
      </View>

      <View style={{ marginHorizontal: 20 }}>
        {/* Incident Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.incidentTitle}>{incident.title}</Text>
          <Text style={styles.incidentDescription}>{incident.description}</Text>
          <Text style={styles.incidentAddress}>
            Address: {incident.address || 'Not provided'}
          </Text>
          <Text style={styles.incidentType}>Type: {incident.type}</Text>
          <Text style={styles.incidentStatus}>
            Status: {incident.status || 'Pending'}
          </Text>
          <Text style={styles.incidentStatus}>
            Date: {incident.createdAt || ''}
          </Text>
        </View>

        {/* Map Section */}
        <View style={styles.mapContainer}>
          <MapView
            style={StyleSheet.absoluteFillObject}
            initialRegion={{
              latitude: incident.location.latitude,
              longitude: incident.location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={incident.location} title={incident.title} />
          </MapView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
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
  detailsContainer: { marginVertical: 20 },
  incidentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#002045',
    fontFamily: 'Exo-Regular',
  },
  incidentDescription: {
    fontSize: 16,
    color: '#FF0000',
    marginVertical: 5,
    fontFamily: 'Exo-Regular',
  },
  incidentType: { fontSize: 16, color: '#3470E4', fontFamily: 'Exo-Regular' },
  incidentStatus: { fontSize: 16, color: '#666', fontFamily: 'Exo-Regular' },
  mapContainer: { width: '100%', height: 300, marginTop: 20 },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#FF0000',
    fontFamily: 'Exo-Regular',
  },
  incidentAddress: {
    fontSize: 16,
    color: '#666',
    marginVertical: 5,
    fontFamily: 'Exo-Regular',
  },
  adminActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '45%',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Exo-Regular',
  },
});
