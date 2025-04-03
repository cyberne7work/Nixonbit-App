import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { apiRequest } from '@/utils/api';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function EditProfileScreen() {
  const { user } = useUser();
  const router = useRouter();
  const { getToken, userId } = useAuth();

  // State for editable fields
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhoneNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getToken();
        const response = await apiRequest(
          `/nixonbit/users/${userId}`,
          'GET',
          null,
          token
        );
        if (response.success) {
            console.log(response)
          setFullName(response.data.name || '');
          setPhoneNumber(response.data.phone || '');
          setAddress(response.data.address || '');
          setCity(response.data.city || '');
          setBio(response.data.bio || '');
        } else {
          throw new Error(response.message || 'Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      if (!user) throw new Error('User not found');

      let data = {
        name: fullName,
        phone: phone,
        address: address,
        city: city,
        bio: bio,
      };

      const token = await getToken();
      const response = await apiRequest(
        `/nixonbit/users/${userId}`,
        'PUT',
        data,
        token
      );
      if (response.success) {
        Alert.alert('Success', 'Profile updated successfully!');
        router.back(); // Navigate back to the Profile screen
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <MaterialIcons name="arrow-back" size={24} color="#002045" />
            </TouchableOpacity>
            <Text style={styles.header}>Incident Details</Text>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Full Name */}
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
            />

            {/* Phone Number */}
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhoneNumber}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />

            {/* Address */}
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter your address"
            />

            {/* City */}
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="Enter your city"
            />

            {/* Bio */}
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself"
              multiline
            />

            {/* Save Button */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveProfile}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
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
    textAlign: 'center',
    fontFamily: 'Exo-Regular',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#002045',
    fontFamily: 'Exo-Bold',
  },
  label: {
    fontSize: 16,
    color: '#002045',
    fontFamily: 'Exo-Regular',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#002045',
    fontFamily: 'Exo-Regular',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#3470E4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Exo-Bold',
  },
});
