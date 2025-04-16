import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Alert,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import IncidentCard from '@/components/IncidentCard';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { apiRequest } from '@/utils/api';

interface Incident {
  id: string;
  title: string;
  description: string;
  type: string;
  location: { latitude: number; longitude: number };
  address?: string;
  status?: string;
}

export default function IncidentReportScreen() {
  const { getToken } = useAuth();
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [incidentsLoading, setIncidentsLoading] = useState(true);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const { user } = useUser();

  // Memoize fetchIncidents to prevent recreation on every render
  const fetchIncidents = useCallback(async (retries = 3, delay = 2000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const token = await getToken();
        const response = await apiRequest('/incidents', 'GET', null, token);
        if (response.success) {
          return response;
        } else {
          throw new Error(response.message || 'Failed to fetch incidents.');
        }
      } catch (error) {
        console.error(`Attempt ${attempt} - Error fetching incidents:`, error);
        if (attempt === retries) throw error;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }, []); // getToken is now a dependency of fetchIncidents

  // Fetch location
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Allow location access.');
          setLocationLoading(false);
          return;
        }

        let { coords } = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          timeInterval: 10000,
        });
        setLocation(coords);
      } catch (error) {
        console.error('Error fetching location:', error);
        Alert.alert('Location Error', 'Failed to fetch location.');
      } finally {
        setLocationLoading(false);
      }
    })();
  }, []);

  // Fetch incidents on mount
  useEffect(() => {
    let isMounted = true; // To prevent state updates after unmount

    const loadIncidents = async () => {
      try {
        if (user) {
          const token = await getToken();
          const response = await apiRequest(
            `/incidents/${user.id}`,
            'GET',
            null,
            token
          );
          if (response.success) {
            setIncidents(
              response.data.incidents.map((incident: any) => ({
                id: incident.id,
                title: incident.title,
                description: incident.description,
                type: incident.type,
                location: incident.location,
                address: incident.address,
                status: incident.status,
                createdAt: incident.createdAt,
              }))
            );
          } else {
            setIncidents([]);
          }
        }
        if (user) {
          const token = await getToken();
          const response = await apiRequest(
            `/incidents/${user.id}`,
            'GET',
            null,
            token
          );
          if (response.success) {
            setIncidents(
              response.data.incidents.map((incident: any) => ({
                id: incident.id,
                title: incident.title,
                description: incident.description,
                type: incident.type,
                location: incident.location,
                address: incident.address,
                status: incident.status,
                createdAt: incident.createdAt,
              }))
            );
          } else {
            setIncidents([]);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching incidents:', error);
          Alert.alert(
            'Error',
            'Failed to fetch incidents. Please check your network and try again.',
            [
              {
                text: 'Retry',
                onPress: async () => {
                  try {
                    const response = await fetchIncidents();
                    if (isMounted) {
                      setIncidents(
                        response.data.incidents.map((incident: any) => ({
                          id: incident.id,
                          title: incident.title,
                          description: incident.description,
                          type: incident.type,
                          location: incident.location,
                          address: incident.address,
                          status: incident.status,
                          createdAt: incident.createdAt,
                        }))
                      );
                    }
                  } catch (err) {
                    console.error('Retry failed:', err);
                  }
                },
              },
              { text: 'Cancel', style: 'cancel' },
            ]
          );
        }
      } finally {
        if (isMounted) {
          setIncidentsLoading(false);
        }
      }
    };

    loadIncidents();

    return () => {
      isMounted = false; // Cleanup to prevent state updates after unmount
    };
  }, [fetchIncidents]); // Depend on fetchIncidents instead of getToken

  // Function to delete an incident
  const handleDeleteIncident = async (id: string) => {
    Alert.alert(
      'Delete Incident',
      'Are you sure you want to delete this report?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const token = await getToken();
              const response = await apiRequest(
                `/incidents/${id}`,
                'DELETE',
                null,
                token
              );
              if (response.success) {
                setIncidents(
                  incidents.filter((incident) => incident.id !== id)
                );
                Alert.alert('Success', 'Incident deleted successfully.');
              } else {
                Alert.alert(
                  'Error',
                  response.message || 'Failed to delete incident.'
                );
              }
            } catch (error) {
              console.error('Error deleting incident:', error);
              Alert.alert('Error', 'Failed to delete incident.');
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
        {locationLoading && (
          <ActivityIndicator
            size="large"
            color="#3470E4"
            style={styles.loader}
          />
        )}
      </View>

      {/* Incident List */}
      <Text style={styles.sectionTitle}>Reported Incidents</Text>
      {incidentsLoading ? (
        <ActivityIndicator
          size="large"
          color="#3470E4"
          style={{ marginVertical: 20 }}
        />
      ) : (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={incidents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <IncidentCard
              incident={item}
              onEdit={(incident) =>
                router.push({
                  pathname: '/(root)/(services)/incident-form-screen',
                  params: { incident: JSON.stringify(incident) },
                })
              }
              onDelete={handleDeleteIncident}
            />
          )}
          ListEmptyComponent={
            <View>
              <Text style={styles.emptyListText}>
                No incidents reported yet.
              </Text>
            </View>
          }
        />
      )}

      {/* Add Incident Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          if (user) {
            router.push('/(root)/(services)/incident-form-screen');
          } else {
            Alert.alert(
              'Login Required',
              'Please login/signup to add emergency contacts.',
              [
                {
                  text: 'OK',
                  onPress: () => router.push('/(root)/(auth)/signin'),
                },
              ]
            );
          }
        }}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
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
  mapContainer: { width: '100%', height: 300 },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  sectionTitle: {
    fontSize: 18,
    color: '#002045',
    margin: 15,
    fontFamily: 'Exo-Regular',
  },
  listContent: { flexGrow: 1 },
  emptyListText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'Exo-Regular',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#3470E4',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
