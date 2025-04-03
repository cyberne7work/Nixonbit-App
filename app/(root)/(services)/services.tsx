import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useState,useEffect } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { CustomTextInput } from "@/components/CustomTextInput";
import { useRouter } from "expo-router";
import { apiRequest } from '@/utils/api';



export default function ServiceScreen() {

  const router = useRouter();
  const [services, setServices] = useState([]);

  const [searchValue, setSearchValue] = useState("");
  const filteredCategories = services.filter((categories) =>
    categories.name.toLowerCase().includes(searchValue.toLowerCase())
  );



    // Fetch data from API on component mount
    useEffect(() => {
      const fetchData = async () => {
        try {
          // Fetch Notices
          const servicesResponse = await apiRequest(
            '/services/list',
            'GET',
            null,
            ''
          );
          const data = servicesResponse.data;
          setServices(data);
  
  
        } catch (error) {
          console.error('[ERROR]: Failed to fetch data:', error);
        }
      };
  
      fetchData();
    }, []);

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
