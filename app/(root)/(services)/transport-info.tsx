import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { CustomTextInput } from "@/components/CustomTextInput";

const transportCategories = [
  { id: "1", name: "Bus" },
  { id: "2", name: "Train" },
  { id: "3", name: "Metro" },
  { id: "4", name: "Taxi" },
  { id: "5", name: "Bicycle Rental" },
  { id: "6", name: "Car Rental" },
  { id: "7", name: "Airport Shuttle" },
  { id: "8", name: "Rickshaw" },
  { id: "9", name: "Boat Transport" },
  { id: "10", name: "Tram" },
];

export default function TransportInfoScreen() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  const filteredCategories = transportCategories.filter((category) =>
    category.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => {
        router.push({
          pathname: "/(root)/(explore)/explore-detailed-screen",
          params: { category: item.name },
        });
      }}
    >
      <View style={styles.categoryRow}>
        <View style={styles.leftContent}>
          <MaterialIcons name="directions-bus" size={25} color={"#3470E4"} />
          <Text style={styles.categoryText}>{item.name}</Text>
        </View>
        <MaterialIcons name="chevron-right" size={25} color={"#3470E4"} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#002045" />
        </TouchableOpacity>
        <Text style={styles.header}>Transport Information</Text>
      </View>

      {/* Search Bar */}
      <CustomTextInput
        label={null}
        placeholder="Search Transport"
        value={searchValue}
        onChangeText={setSearchValue}
        style={styles.searchInput}
        autoCapitalize="none"
      />

      {/* Transport List */}
      <FlatList
        data={filteredCategories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transport services found.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 10 },
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
  searchInput: { marginHorizontal: 5 },
  listContainer: { paddingBottom: 20 },
  categoryItem: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 5,
    padding: 10,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  leftContent: { flexDirection: "row", alignItems: "center" },
  categoryText: {
    fontSize: 14,
    color: "#002045",
    fontFamily: "Exo-Regular",
    marginLeft: 10, // Space between icon and text
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -12 }], // Vertically center icon
  },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 18, color: "#002045" },
});
