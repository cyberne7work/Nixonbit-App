import { CustomTextInput } from "@/components/CustomTextInput";
import ServiceManProfileCard from "@/components/ServiceManProfileCard";
import { useRouter,useLocalSearchParams } from "expo-router";
import React, { useState ,useEffect} from "react";
import { FlatList, StyleSheet, View, Text, SafeAreaView,TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { apiRequest } from '@/utils/api';

const serviceMen = [
  {
    id: "1",
    name: "John Doe",
    profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
    rating: 4.5,
    experience: 5,
    phoneNumber: "+91 8797971422",
  },
  {
    id: "2",
    name: "Jane Smith",
    profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
    rating: 4.8,
    experience: 7,
    phoneNumber: "+91 8797971422",
  },
  {
    id: "3",
    name: "Mike Johnson",
    profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
    rating: 4.2,
    experience: 3,
    phoneNumber: "+91 8797971422",
  },
  {
    id: "4",
    name: "Sarah Williams",
    profilePic: "https://randomuser.me/api/portraits/women/4.jpg",
    rating: 4.6,
    experience: 6,
    phoneNumber: "+91 8797971422",
  },
  {
    id: "5",
    name: "David Brown",
    profilePic: "https://randomuser.me/api/portraits/men/5.jpg",
    rating: 4.7,
    experience: 4,
    phoneNumber: "+91 8797971422",
  },
  {
    id: "6",
    name: "Michael Davis",
    profilePic: "https://randomuser.me/api/portraits/men/6.jpg",
    rating: 4.9,
    experience: 5,
    phoneNumber: "+91 8797971422",
  },
];

export default function ServiceManProfileList() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const params = useLocalSearchParams();
  const Provider = params.category || "Providers";
  const [serviceProviders, setServiceProviders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          serviceCategory: Provider, // Example parameter
        };
  
        const queryString = new URLSearchParams(params).toString(); // Convert params to query string
        const endpoint = `/service-providers?${queryString}`;
  
        const servicesResponse = await apiRequest(endpoint, 'GET', null, '');
        const data = servicesResponse.data.providers || []; // Adjust based on your API response structure
        console.log("Service Providers:", data);
        setServiceProviders(data);
      } catch (error) {
        console.error('[ERROR]: Failed to fetch data:', error);
      }
    };
  
    fetchData();
  }, []);
  

  const handleProfilePress = (profile) => {
    router.push({
      pathname: "/(root)/(services)/servicelist-detail-screen",
      params: { profile: JSON.stringify(profile) },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#002045" />
        </TouchableOpacity>
        <Text style={styles.header}>{Provider}</Text>
      </View>

      <CustomTextInput
        label={null}
        placeholder={"Search"}
        value={searchValue}
        onChangeText={setSearchValue}
        autoCapitalize="none"
        style={{
          marginHorizontal: 5,
        }}
      />
      <FlatList
        data={serviceProviders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ServiceManProfileCard
            profilePic={item.profile_picture}
            name={item.name}
            rating={item.average_rating}
            experience={item.experience}
            phoneNumber={item.phone}
            onProfilePress={() => handleProfilePress(item)}
            services={item.services[0]}
          />
        )}
        contentContainerStyle={styles.list}
        ListFooterComponent={
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          ></View>
        }
        ListFooterComponentStyle={{
          paddingBottom: 50,
        }}
        style={{
          marginHorizontal: 5,
        }}
      />
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
  backButton: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -12 }], // Vertically center the icon
  },
  search: {
    marginHorizontal: 5,
  },
  list: {
    // padding: 16,
  },
});

