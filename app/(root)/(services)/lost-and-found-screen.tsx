import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { CustomTextInput } from "@/components/CustomTextInput";
import { useRouter } from "expo-router";

const lostAndFoundData = [
  {
    id: "1",
    type: "Lost",
    title: "Black Wallet",
    description: "Lost near Central Park on 25th Jan.",
    contact: "+1 234 567 890",
    image: "https://images.pexels.com/photos/915915/pexels-photo-915915.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "2",
    type: "Found",
    title: "Golden Retriever",
    description: "Found near Baker Street on 20th Jan.",
    contact: "+1 345 678 901",
    image: "https://images.pexels.com/photos/1490908/pexels-photo-1490908.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
];

export default function LostAndFoundScreen() {
  const [items, setItems] = useState(lostAndFoundData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [newItem, setNewItem] = useState({
    type: "Lost",
    title: "",
    description: "",
    contact: "",
    image: "",
  });
  const router = useRouter();

  const handleAddItem = () => {
    if (!newItem.title || !newItem.description || !newItem.contact) {
      Alert.alert("Error", "Please fill in all the fields.");
      return;
    }

    setItems([
      ...items,
      {
        ...newItem,
        id: (items.length + 1).toString(),
        image: "https://via.placeholder.com/100",
      },
    ]);
    setNewItem({
      type: "Lost",
      title: "",
      description: "",
      contact: "",
      image: "",
    });
    setIsModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemType}>{item.type}</Text>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemContact}>Contact: {item.contact}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#002045" />
        </TouchableOpacity>
        <Text style={styles.header}>Lost and Found</Text>
      </View>

      {/* Search Input */}
      <CustomTextInput
        label={null}
        placeholder={"Search"}
        value={searchValue}
        onChangeText={setSearchValue}
        style={styles.searchInput}
        autoCapitalize="none"
      />

      {/* List of Lost and Found Items */}
      <FlatList
        data={items.filter((item) =>
          item.title.toLowerCase().includes(searchValue.toLowerCase())
        )}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      {/* Add Item Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/(root)/(services)/add-lost-and-found-item")}
      >
        <MaterialIcons name="add" size={30} color="#fff" />
      </TouchableOpacity>
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
  searchInput: {
    marginHorizontal: 10,
    marginTop: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "center",
  },
  itemType: {
    fontSize: 14,
    color: "#3470E4",
    marginBottom: 5,
    fontFamily: "Exo-Regular",
  },
  itemTitle: {
    fontSize: 16,
    color: "#002045",
    fontFamily: "Exo-Regular",
  },
  itemDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    fontFamily: "Exo-Regular",
  },
  itemContact: {
    fontSize: 14,
    color: "#002045",
    fontFamily: "Exo-Regular",
  },
  addButton: {
    backgroundColor: "#3470E4",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "90%",
  },
  modalHeader: {
    fontSize: 18,
    color: "#002045",
    marginBottom: 10,
    fontFamily: "Exo-Regular",

  },
  typeButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  typeButtonSelected: {
    backgroundColor: "#3470E4",
    borderColor: "#3470E4",
  },
  typeButtonText: {
    fontSize: 14,
    color: "#002045",
    fontFamily: "Exo-Regular",

  },
  saveButton: {
    backgroundColor: "#3470E4",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Exo-Regular",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Exo-Regular",

  },
});
