import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { CustomTextInput } from '@/components/CustomTextInput';
import { useAuth,useUser } from '@clerk/clerk-expo';
import { apiRequest } from '@/utils/api';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LinearGradient } from 'expo-linear-gradient';
import IssueCard from '@/components/IssueCard';

interface WasteReport {
  id: string;
  description: string;
  location: { latitude: string; longitude: string; address: string };
  photo: string;
  status: string;
}

const WasteManagementScreen = () => {
  const { getToken } = useAuth();
    const { user } = useUser();
  
  const [location, setLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    address: '',
  });
  const [locationLoading, setLocationLoading] = useState(true);
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState('');
  const [reportedIssues, setReportedIssues] = useState<WasteReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingIssue, setEditingIssue] = useState<WasteReport | null>(null);
  // Fetch current location
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Allow location access to mark the waste location.'
          );
          setLocationLoading(false);
          return;
        }

        let { coords } = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        const { latitude, longitude } = coords;

        let geocode = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        let address = '';
        if (geocode.length > 0) {
          const { street, city, region, postalCode, country } = geocode[0];
          address = `${street || ''}, ${city || ''}, ${region || ''} ${
            postalCode || ''
          }, ${country || ''}`;
        }

        setLocation({ latitude, longitude, address });
      } catch (error) {
        console.error('Error fetching location:', error);
        Alert.alert(
          'Location Error',
          'Failed to fetch location. Using default location.'
        );
      } finally {
        setLocationLoading(false);
      }
    })();
  }, []);

  // Fetch reported issues
  useEffect(() => {
    (async () => {
      try {
        if(user){
          const token = await getToken();
          const response = await apiRequest('/waste', 'GET', null, token);
          if (response.success) {
            console.log(response.data.reports);
            setReportedIssues(response.data.reports);
          } else {
            Alert.alert(
              'Error',
              response.message || 'Failed to fetch reported issues.'
            );
          }
        }else{
          setReportedIssues([]);
        }

      } catch (error) {
        console.error('Error fetching reported issues:', error);
        Alert.alert('Error', 'Failed to fetch reported issues.');
      } finally {
        setReportsLoading(false);
      }
    })();
  }, []);

  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Sorry, we need camera roll permissions to upload photos.'
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
      setPhoto(result.assets[0]);
    }
  };

  const handleMapPress = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    try {
      let geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      let address = '';
      if (geocode.length > 0) {
        const { street, city, region, postalCode, country } = geocode[0];
        address = `${street || ''}, ${city || ''}, ${region || ''} ${
          postalCode || ''
        }, ${country || ''}`;
      }
      setLocation({ latitude, longitude, address });
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      Alert.alert(
        'Error',
        'Failed to fetch address for the selected location.'
      );
      setLocation({ latitude, longitude, address: '' });
    }
  };

  const handleSubmitReport = async () => {
    if (!description || !photo) {
      Alert.alert(
        'Incomplete Report',
        'Please provide a description and upload a photo.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await getToken();
      // const formData = new FormData();
      // formData.append('description', description);
      // formData.append('location[latitude]', location.latitude.toString());
      // formData.append('location[longitude]', location.longitude.toString());
      // formData.append('location[address]', location.address || '');
      // formData.append('photo', {
      //   uri: photo.uri,
      //   name: photo.uri.split('/').pop(),
      //   type: 'image/jpeg',
      // });

      const data = {
        description,
        location: {
          latitude: location.latitude.toString(),
          longitude: location.longitude.toString(),
          address: location.address,
        },
        // photo: photo.uri,
        // status: 'Pending',
      };

      const response = await apiRequest('/waste', 'POST', data, token);

      if (response.success) {
        Alert.alert(
          'Report Submitted',
          'Thank you for reporting the waste issue!'
        );
        setDescription('');
        setPhoto(null);
        setLocation({ latitude: 37.78825, longitude: -122.4324, address: '' });

        const reportsResponse = await apiRequest('/waste', 'GET', null, token);
        if (reportsResponse.success) {
          setReportedIssues(reportsResponse.data.reports);
        }
      } else {
        Alert.alert(
          'Error',
          response.message || 'Failed to submit waste report.'
        );
      }
    } catch (error) {
      console.error('Error submitting waste report:', error);
      Alert.alert('Error', 'Failed to submit waste report.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeleteIssue = (id: string) => {
    setReportedIssues(reportedIssues.filter((issue) => issue.id !== id));
  };

  const handleEditIssue = (issue: WasteReport) => {
    setEditingIssue(issue);
    setDescription(issue.description);
    setPhoto({ uri: issue.photo });
    setLocation({
      latitude: parseFloat(issue.location.latitude),
      longitude: parseFloat(issue.location.longitude),
      address: issue.location.address,
    });
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

      {/* Form with Keyboard Handling */}
      <KeyboardAwareScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'ios' ? 100 : 150}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Map Display */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Select Location</Text>
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  onPress={handleMapPress}
                >
                  <Marker
                    coordinate={{
                      latitude: location.latitude,
                      longitude: location.longitude,
                    }}
                    title="Selected Location"
                  />
                </MapView>
                {locationLoading && (
                  <ActivityIndicator
                    size="large"
                    color="#3470E4"
                    style={styles.loader}
                  />
                )}
              </View>
              <Text style={styles.addressText}>
                {location.address || 'Tap on the map to select a location'}
              </Text>
            </View>

            {/* Upload Photo */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Upload Photo</Text>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handlePickPhoto}
              >
                <LinearGradient
                  colors={['#3470E4', '#2a5bb8']}
                  style={styles.gradientButton}
                >
                  <MaterialIcons
                    name="photo-camera"
                    size={20}
                    color="#fff"
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>
                    {photo ? 'Change Photo' : 'Upload Photo'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              {photo && (
                <Image
                  source={{ uri: photo.uri }}
                  style={styles.uploadedPhoto}
                />
              )}
            </View>

            {/* Description Input */}
            <View style={styles.inputContainer}>
              <CustomTextInput
                placeholder="Describe the waste (e.g., plastic, organic, hazardous)"
                label="Description"
                value={description}
                onChangeText={setDescription}
                autoCapitalize="none"
                multiple={true}
                style={styles.description}
                maxLength={200}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && { opacity: 0.7 }]}
              onPress={handleSubmitReport}
              disabled={isSubmitting || locationLoading}
            >
              <LinearGradient
                colors={['#4CAF50', '#45a049']}
                style={styles.gradientButton}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit Report</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
            {/* Reported Issues List */}
            <Text style={styles.sectionTitle}>Reported Issues</Text>
            {reportsLoading ? (
              <ActivityIndicator
                size="large"
                color="#3470E4"
                style={styles.loader}
              />
            ) : reportedIssues.length === 0 ? (
              <Text style={styles.noIssuesText}>No reported issues yet.</Text>
            ) : (
              reportedIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onDelete={handleDeleteIssue}
                  onEdit={handleEditIssue}
                />
              ))
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  formContainer: {
    marginHorizontal: 10,
  },
  formCard: {
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
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
  addressText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontFamily: 'Exo-Regular',
  },
  actionButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Exo-Regular',
  },
  uploadedPhoto: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: 'Exo-Regular',
  },
  submitButton: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Exo-Regular',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginVertical: 15,
    fontFamily: 'Exo-Regular',
    // marginHorizontal: 20,
  },
  issueCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  issuePhoto: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  issueDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  issueDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
    fontFamily: 'Exo-Regular',
  },
  issueStatus: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    fontFamily: 'Exo-Regular',
  },
  noIssuesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'Exo-Regular',
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  description: {
    // marginHorizontal: 20
  },
});

export default WasteManagementScreen;
