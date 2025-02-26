import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { CustomTextInput } from "@/components/CustomTextInput";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

export default function AddLostFoundItemScreen() {
  const [newItem, setNewItem] = useState({
    type: "Lost",
    title: "",
    description: "",
    contact: "",
    image: "",
  });

  const handleImageUpload = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "You need to allow access to photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setNewItem({ ...newItem, image: result.uri });
    }
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "You need to allow access to the camera."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setNewItem({ ...newItem, image: result.uri });
    }
  };

  const handleSave = () => {
    if (!newItem.title || !newItem.description || !newItem.contact) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    Alert.alert("Success", "Item saved successfully!");

    setNewItem({
      type: "Lost",
      title: "",
      description: "",
      contact: "",
      image: "",
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
          <MaterialIcons name='arrow-back' size={24} color='#002045' />
        </TouchableOpacity>
        <Text style={styles.header}>Lost and Found</Text>
      </View>

      {/* Form */}
      <ScrollView style={{ margin: 10 }}>
        {/* Image Preview */}
        <View style={styles.imageContainer}>
          {newItem.image ? (
            <Image
              source={{ uri: newItem.image }}
              style={styles.imagePreview}
            />
          ) : (
            <View style={styles.placeholder}>
              <MaterialIcons name='image' size={64} color='#ccc' />
              <Text style={styles.placeholderText}>No Image Added</Text>
            </View>
          )}
        </View>
        {/* Type Selection */}
        <Text style={styles.choose}>Choose your option</Text>
        <TouchableOpacity
          style={[
            styles.typeButton,
            newItem.type === "Lost" && styles.typeButtonSelected,
          ]}
          onPress={() => setNewItem({ ...newItem, type: "Lost" })}
        >
          <Text style={styles.typeButtonText}>Lost</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.typeButton,
            newItem.type === "Found" && styles.typeButtonSelected,
          ]}
          onPress={() => setNewItem({ ...newItem, type: "Found" })}
        >
          <Text style={styles.typeButtonText}>Found</Text>
        </TouchableOpacity>

        {/* Input Fields */}
        <CustomTextInput
          label={"Title"}
          placeholder='Enter item title'
          value={newItem.title}
          onChangeText={(text) => setNewItem({ ...newItem, title: text })}
          autoCapitalize={"none"}
        />
        <CustomTextInput
          label={"Description"}
          placeholder='Enter description'
          value={newItem.description}
          onChangeText={(text) => setNewItem({ ...newItem, description: text })}
          autoCapitalize={"none"}
        />
        <CustomTextInput
          label={"Contact Number"}
          placeholder='Enter contact number'
          value={newItem.contact}
          onChangeText={(text) => setNewItem({ ...newItem, contact: text })}
          keyboardType='phone-pad'
          autoCapitalize={"none"}
        />

        {/* Image Upload Options */}
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleImageUpload}
        >
          <MaterialIcons name='add-a-photo' size={24} color='#002045' />
          <Text style={styles.uploadText}>Upload from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.uploadButton} onPress={handleTakePhoto}>
          <MaterialIcons name='camera-alt' size={24} color='#002045' />
          <Text style={styles.uploadText}>Take a Photo</Text>
        </TouchableOpacity>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
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
  imageContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  placeholder: {
    width: 200,
    height: 200,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    marginTop: 10,
    fontSize: 14,
    color: "#888",
  },
  choose: {
    fontSize: 16,
    color: "#002045",
    fontFamily: "Exo-Regular",
    marginBottom: 10,
  },
  typeButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
    backgroundColor: "#f5f5f5", // Add a background color for unselected buttons
  },
  typeButtonSelected: {
    backgroundColor: "#3470E4",
    borderColor: "#3470E4",
  },
  typeButtonText: {
    fontSize: 14,
    color: "#002045", // Default text color for unselected buttons
  },
  typeButtonTextSelected: {
    fontSize: 14,
    color: "#fff", // White text for selected buttons
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  uploadText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#002045",
  },
  saveButton: {
    backgroundColor: "#3470E4",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Exo-Regular",
  },
});
