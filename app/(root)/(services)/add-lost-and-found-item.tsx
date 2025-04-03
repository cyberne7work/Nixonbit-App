import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CustomTextInput } from '@/components/CustomTextInput';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@clerk/clerk-expo';
import { apiRequest } from '@/utils/api';

interface LostAndFoundItem {
  id?: string;
  type: string;
  item: string;
  description: string;
  contact: string;
  image: string;
}

export default function AddLostFoundItemScreen() {
  const { item } = useLocalSearchParams();
  const parsedItem: LostAndFoundItem | undefined = item
    ? JSON.parse(item as string)
    : undefined;
  const [newItem, setNewItem] = useState<LostAndFoundItem>({
    type: parsedItem?.type || 'Lost',
    item: parsedItem?.item || '',
    description: parsedItem?.description || '',
    contact: parsedItem?.contact || '',
    image: parsedItem?.image || '',
  });
  const [photo, setPhoto] = useState<any>(
    parsedItem?.image ? { uri: parsedItem.image } : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { getToken } = useAuth();

  const handleImageUpload = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'You need to allow access to photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0]);
      setNewItem({ ...newItem, image: result.assets[0].uri });
    }
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        'Permission Required',
        'You need to allow access to the camera.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0]);
      setNewItem({ ...newItem, image: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    if (
      !newItem.item ||
      !newItem.description ||
      !newItem.contact ||
      !newItem.image
    ) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await getToken();
      const data = {
        type: newItem.type,
        item: newItem.item,
        description: newItem.description,
        contact: newItem.contact,
        image: newItem.image,
        date: new Date().toISOString(),
      };

      let response;
      if (parsedItem) {
        response = await apiRequest(
          `/lost-and-found/${parsedItem.id}`,
          'PUT',
          data,
          token
        );
      } else {
        response = await apiRequest('/lost-and-found', 'POST', data, token);
      }

      if (response.success) {
        Alert.alert(
          'Success',
          parsedItem ? 'Item updated successfully!' : 'Item added successfully!'
        );
        router.back();
      } else {
        Alert.alert(
          'Error',
          response.message ||
            (parsedItem ? 'Failed to update item.' : 'Failed to add item.')
        );
      }
    } catch (error) {
      console.error('Error saving item:', error);
      Alert.alert(
        'Error',
        parsedItem ? 'Failed to update item.' : 'Failed to add item.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={styles.innerContainer}>
            <View style={styles.headerContainer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <MaterialIcons name="arrow-back" size={24} color="#002045" />
              </TouchableOpacity>
              <Text style={styles.header}>
                {parsedItem ? 'Edit Item' : 'Add Item'}
              </Text>
            </View>

            <ScrollView
              style={styles.formContainer}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              {/* Image Preview */}
              <View style={styles.imageContainer}>
                {newItem.image ? (
                  <Image
                    source={{ uri: newItem.image }}
                    style={styles.imagePreview}
                  />
                ) : (
                  <View style={styles.placeholder}>
                    <MaterialIcons name="image" size={64} color="#ccc" />
                    <Text style={styles.placeholderText}>No Image Added</Text>
                  </View>
                )}
              </View>

              {/* Type Selection */}
              <Text style={styles.label}>Choose Type</Text>
              <View style={styles.typeButtons}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    newItem.type === 'Lost' && styles.typeButtonSelected,
                  ]}
                  onPress={() => setNewItem({ ...newItem, type: 'Lost' })}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      newItem.type === 'Lost' && styles.typeButtonTextSelected,
                    ]}
                  >
                    Lost
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    newItem.type === 'Found' && styles.typeButtonSelected,
                  ]}
                  onPress={() => setNewItem({ ...newItem, type: 'Found' })}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      newItem.type === 'Found' && styles.typeButtonTextSelected,
                    ]}
                  >
                    Found
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Input Fields */}
              <View style={styles.inputContainer}>
                <CustomTextInput
                  label="Title"
                  placeholder="Enter item title"
                  value={newItem.item}
                  onChangeText={(text) => setNewItem({ ...newItem, item: text })}
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.inputContainer}>
                <View style={styles.descriptionContainer}>
                  <CustomTextInput
                    label="Description"
                    placeholder="Enter description"
                    value={newItem.description}
                    onChangeText={(text) =>
                      setNewItem({ ...newItem, description: text })
                    }
                    autoCapitalize="none"
                    maxLength={250}
                    multiline={true}
                    style={styles.descriptionInput}
                  />
                </View>
              </View>
              <View style={styles.inputContainer}>
                <CustomTextInput
                  label="Contact Number"
                  placeholder="Enter contact number (e.g., +1 234 567 890)"
                  value={newItem.contact}
                  onChangeText={(text) =>
                    setNewItem({ ...newItem, contact: text })
                  }
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                />
              </View>

              {/* Image Upload Options */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Upload Image</Text>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleImageUpload}
                >
                  <LinearGradient
                    colors={['#3470E4', '#2a5bb8']}
                    style={styles.gradientButton}
                  >
                    <MaterialIcons
                      name="add-a-photo"
                      size={20}
                      color="#fff"
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.buttonText}>Upload from Gallery</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleTakePhoto}
                >
                  <LinearGradient
                    colors={['#3470E4', '#2a5bb8']}
                    style={styles.gradientButton}
                  >
                    <MaterialIcons
                      name="camera-alt"
                      size={20}
                      color="#fff"
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.buttonText}>Take a Photo</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={[styles.saveButton, isSubmitting && { opacity: 0.7 }]}
                onPress={handleSave}
                disabled={isSubmitting}
              >
                <LinearGradient
                  colors={['#4CAF50', '#45a049']}
                  style={styles.gradientButton}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.saveButtonText}>
                      {parsedItem ? 'Update Item' : 'Add Item'}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 18,
    color: '#002045',
    fontWeight: 'bold',
    fontFamily: 'Exo-Regular',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  formContainer: {
    marginHorizontal: 15,
    marginTop: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  placeholder: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    marginTop: 10,
    fontSize: 14,
    color: '#888',
    fontFamily: 'Exo-Regular',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
    fontFamily: 'Exo-Regularwaste',
  },
  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  typeButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#f5f5f5',
  },
  typeButtonSelected: {
    backgroundColor: '#3470E4',
    borderColor: '#3470E4',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#002045',
    fontFamily: 'Exo-Regular',
  },
  typeButtonTextSelected: {
    color: '#fff',
  },
  inputContainer: {
    marginBottom: 15,
  },
  descriptionContainer: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
  },
  descriptionInput: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: 10,
    paddingVertical: 10,
  },
  actionButton: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
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
  saveButton: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Exo-Regular',
  },
});