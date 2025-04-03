import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Platform,
  FlatList,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CustomTextInput } from '@/components/CustomTextInput';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useAuth } from '@clerk/clerk-expo';
import { apiRequest } from '@/utils/api';
import { Picker } from '@react-native-picker/picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// Define the list of incident types (must match the backend enum)
const INCIDENT_TYPES = ['Accident', 'Fire', 'Gas Leak', 'Other'];

export default function IncidentFormScreen() {
  const router = useRouter();
  const { getToken } = useAuth();
  const params = useLocalSearchParams();
  const existingIncident = params.incident ? JSON.parse(params.incident) : null;

  // Initialize the incident state with a proper location structure
  const [incident, setIncident] = useState(
    existingIncident || {
      title: '',
      description: '',
      type: '', // Will be set via dropdown
      location: {
        latitude: null,
        longitude: null,
        address: '',
        city: '',
      },
      address: '', // Temporary field for manual address input (optional)
    }
  );
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTypeModalVisible, setIsTypeModalVisible] = useState(false); // For custom dropdown

  // Fetch current location when form is opened
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Allow location access to use this feature.'
          );
          setLocationLoading(false);
          return;
        }

        let { coords } = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        const { latitude, longitude } = coords;

        // Reverse geocode to get address and city
        let geocode = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        let address = '';
        let city = '';
        if (geocode.length > 0) {
          const {
            street,
            city: geoCity,
            region,
            postalCode,
            country,
          } = geocode[0];
          address = `${street || ''}, ${geoCity || ''}, ${region || ''} ${
            postalCode || ''
          }, ${country || ''}`;
          city = geoCity || '';
        }

        setIncident((prev) => ({
          ...prev,
          location: prev.location.latitude
            ? prev.location
            : { latitude, longitude, address, city },
          address: prev.address || address, // Update the address field
        }));
      } catch (error) {
        console.error('Error fetching location:', error);
        Alert.alert('Location Error', 'Failed to fetch location.');
      } finally {
        setLocationLoading(false);
      }
    })();
  }, []);

  // Handle map press to update location with reverse geocoded address and city
  const handleMapPress = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    try {
      let geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      let address = '';
      let city = '';
      if (geocode.length > 0) {
        const {
          street,
          city: geoCity,
          region,
          postalCode,
          country,
        } = geocode[0];
        address = `${street || ''}, ${geoCity || ''}, ${region || ''} ${
          postalCode || ''
        }, ${country || ''}`;
        city = geoCity || '';
      }
      setIncident({
        ...incident,
        location: { latitude, longitude, address, city },
        address: address, // Update the address field to reflect the selected location
      });
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      Alert.alert(
        'Error',
        'Failed to fetch address for the selected location.'
      );
      setIncident({
        ...incident,
        location: { latitude, longitude, address: '', city: '' },
        address: '',
      });
    }
  };

  const handleSaveIncident = async () => {
    if (
      !incident.title ||
      !incident.description ||
      !incident.type ||
      !incident.location.latitude ||
      !incident.location.longitude
    ) {
      Alert.alert('Error', 'Please fill all fields and select a location.');
      return;
    }

    setIsSaving(true);
    try {
      const token = await getToken();
      let response;

      // Structure the location data in the desired format
      const locationData = {
        latitude: incident.location.latitude.toString(), // Convert to string
        longitude: incident.location.longitude.toString(), // Convert to string
        address: incident.address || incident.location.address || '', // Use manual address if provided, else use geocoded address
        city: incident.location.city || 'Unknown', // Include city
      };

      if (existingIncident) {
        console.log('Updating existing incident:',           {
          title: incident.title,
          description: incident.description,
          type: incident.type,
          location: locationData,
        });
        // Update existing incident
        response = await apiRequest(
          `/incidents/${existingIncident.id}`,
          'PUT',
          {
            title: incident.title,
            description: incident.description,
            type: incident.type,
            location: locationData,
          },
          token
        );

        if (response.success) {
          Alert.alert('Success', 'Incident updated successfully.', [
            {
              text: 'OK',
              onPress: () =>
                router.push('/(root)/(services)/incident-reporting-screen'),
            },
          ]);
        } else {
          Alert.alert(
            'Error',
            response.message || 'Failed to update incident.'
          );
        }
      } else {
        // Add new incident
        response = await apiRequest(
          '/incidents',
          'POST',
          {
            title: incident.title,
            description: incident.description,
            type: incident.type,
            location: locationData,
          },
          token
        );

        if (response.success) {
          Alert.alert('Success', 'Incident added successfully.', [
            {
              text: 'OK',
              onPress: () =>
                // router.push('/(root)/(services)/incident-reporting-screen'),
              router.back(),
            },
          ]);
        } else {
          Alert.alert('Error', response.message || 'Failed to add incident.');
        }
      }
    } catch (error) {
      console.error('Error saving incident:', error);
      Alert.alert(
        'Error',
        'Failed to save incident. Please check your network and try again.'
      );
    } finally {
      setIsSaving(false);
    }
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
        <Text style={styles.header}>
          {existingIncident ? 'Edit Incident' : 'Add Incident'}
        </Text>
      </View>

      {/* Wrap the form in KeyboardAwareScrollView */}
      <KeyboardAwareScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'ios' ? 100 : 150}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          {/* Incident Form */}
          <CustomTextInput
            label="Title"
            placeholder="Enter incident title (e.g. Incident)"
            value={incident.title}
            onChangeText={(text) => setIncident({ ...incident, title: text })}
            autoCapitalize="none"
          />
          <CustomTextInput
            placeholder="Enter incident description"
            label="Description"
            value={incident.description}
            onChangeText={(text) =>
              setIncident({ ...incident, description: text })
            }
            autoCapitalize="none"
          />

          {/* Fallback Custom Dropdown (Uncomment if Picker is not visible) */}

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Type of Incident</Text>
            <TouchableOpacity
              style={styles.customPicker}
              onPress={() => setIsTypeModalVisible(true)}
            >
              <Text style={styles.customPickerText}>
                {incident.type || 'Select incident type'}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <CustomTextInput
            placeholder="Enter incident address (optional)"
            label="Address"
            value={incident.address}
            onChangeText={(text) => setIncident({ ...incident, address: text })}
            autoCapitalize="none"
          />

          {/* Select Location Button */}
          <TouchableOpacity
            style={styles.selectLocationButton}
            onPress={() => setIsMapVisible(true)}
            disabled={locationLoading}
          >
            {locationLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.selectLocationText}>
                {incident.location.latitude
                  ? 'Update Location'
                  : 'Select Location'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, isSaving && { opacity: 0.7 }]}
            onPress={handleSaveIncident}
            disabled={isSaving || locationLoading}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>

      {/* Location Picker Modal */}
      <Modal visible={isMapVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.mapWrapper}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: incident.location.latitude || 37.7749,
                longitude: incident.location.longitude || -122.4194,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              onPress={handleMapPress}
            >
              {incident.location.latitude && (
                <Marker
                  coordinate={{
                    latitude: incident.location.latitude,
                    longitude: incident.location.longitude,
                  }}
                  title="Selected Location"
                />
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

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => setIsMapVisible(false)}
          >
            <Text style={styles.confirmButtonText}>Confirm Location</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Custom Dropdown Modal (Uncomment if Picker is not visible) */}

      <Modal visible={isTypeModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={INCIDENT_TYPES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setIncident({ ...incident, type: item });
                    setIsTypeModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setIsTypeModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
  },
  header: {
    fontSize: 18,
    color: '#002045',
    fontFamily: 'Exo-Regular',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  formContainer: {
    marginHorizontal: 20,
  },
  pickerContainer: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    zIndex: 1000, // Ensure the picker is above other elements
  },
  label: {
    fontSize: 16,
    color: '#002045',
    fontFamily: 'Exo-Regular',
    marginBottom: 5,
    marginLeft: 10,
    marginTop: 5,
  },
  picker: {
    height: Platform.OS === 'ios' ? 150 : 50, // Increased height for iOS wheel picker
    width: '100%',
    color: '#002045', // Ensure text is visible
    backgroundColor: '#fff', // Ensure background is visible
  },
  pickerItem: {
    fontSize: 16,
    fontFamily: 'Exo-Regular',
    color: '#002045',
  },
  customPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    height: 50,
  },
  customPickerText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Exo-Regular',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    maxHeight: 300,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalItemText: {
    fontSize: 16,
    fontFamily: 'Exo-Regular',
    color: '#002045',
  },
  modalCancelButton: {
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#3470E4',
    fontFamily: 'Exo-Regular',
  },
  selectLocationButton: {
    backgroundColor: '#3470E4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  selectLocationText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Exo-Regular',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Exo-Regular',
  },
  modalContainer: {
    flex: 1,
  },
  mapWrapper: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  map: {
    width: '100%',
    height: '95%',
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  confirmButton: {
    backgroundColor: '#3470E4',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 30,
    marginBottom: 20,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Exo-Regular',
  },
});
