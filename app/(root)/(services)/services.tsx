import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useState } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { CustomTextInput } from "@/components/CustomTextInput";
import { useRouter } from "expo-router";

const categories = [
  { id: "1", name: "Home Cleaning" },
  { id: "2", name: "Plumbing" },
  { id: "3", name: "Electrician" },
  { id: "4", name: "Car Wash" },
  { id: "5", name: "Gardening" },
  { id: "6", name: "Pet Care" },
  { id: "7", name: "Hospital" },
  { id: "8", name: "Gym" },
  { id: "9", name: "Pest Control" },
  { id: "10", name: "Tailoring" },
  { id: "11", name: "Cooking" },
  { id: "12", name: "Laundry" },
  { id: "13", name: "Dry Cleaning" },
  { id: "14", name: "Tailoring" },
  { id: "15", name: "Photography" },
  { id: "16", name: "Travel" },
  { id: "17", name: "Beauty" },
  { id: "18", name: "Health & Fitness" },
  { id: "19", name: "Personal Care" },
  { id: "20", name: "Maintenance" },
  { id: "21", name: "Household" },
  { id: "22", name: "Childcare" },
  { id: "23", name: "Carpentry" },
  { id: "24", name: "Laundry" },
  { id: "25", name: "Dry Cleaning" },
  { id: "26", name: "Tailoring" },
  { id: "28", name: "Travel" },
  { id: "29", name: "Beauty" },
  { id: "30", name: "Health & Fitness" },
];

export default function ServiceScreen() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const filteredCategories = categories.filter((categories) =>
    categories.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => {
        router.push({
          pathname: "/servicelist-screen",
          params: { category: item.name },
        });
      }}
    >
      <View style={styles.categoryRow}>
        <View style={styles.leftContent}>
          <MaterialIcons name="folder-open" size={25} color={"#3470E4"} />
          <Text style={styles.categoryText}>{item.name}</Text>
        </View>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={25}
          color={"#3470E4"}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#002045" />
        </TouchableOpacity>
        <Text style={styles.header}>Provider</Text>
      </View>
      <View>
        <CustomTextInput
          label={null}
          placeholder={"Search"}
          value={searchValue}
          onChangeText={setSearchValue}
          style={{
            marginHorizontal: 5,
          }}
          autoCapitalize="none"
        />
        <FlatList
          data={filteredCategories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListFooterComponent={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            ></View>
          }
          ListFooterComponentStyle={{
            paddingBottom: 70,
          }}
          style={{
            marginHorizontal: 5,
          }}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 18, color: "#002045" }}>
                No services found.
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
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
  listContainer: {
    paddingBottom: 20,
  },
  categoryItem: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 1,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    // marginVertical:5
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryText: {
    fontSize: 14,
    color: "#002045",
    fontFamily: "Exo-Regular",
    marginLeft: 10, // Add spacing between the icon and text
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -12 }], // Vertically center the icon
  },
});
