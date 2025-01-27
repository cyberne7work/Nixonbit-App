import { CustomTextInput } from "@/components/CustomTextInput";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useState } from "react";

const exploreData = [
  {
    id: "1",
    title: "Discover Local Events",
    description: "Find the best events happening around you.",
    image: "https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "events",
  },
  {
    id: "2",
    title: "Top Restaurants",
    description: "Explore the best places to eat in your city.",
    image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "restaurants",
  },
  {
    id: "3",
    title: "Adventure Activities",
    description: "Experience thrilling activities near you.",
    image: "https://images.pexels.com/photos/11958343/pexels-photo-11958343.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "activities",
  },
  {
    id: "4",
    title: "Top Schools",
    description: "Enhance your education experience.",
    image: "https://images.pexels.com/photos/256395/pexels-photo-256395.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "school",
  },
  {
    id: "5",
    title: "Top Hospitals",
    description: "Find the best hospitals in your area.",
    image: "https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "hospital",
  },
  {
    id: "6",
    title: "Top Museums",
    description: "Discover hidden treasures in your city.",
    image: "https://images.pexels.com/photos/135018/pexels-photo-135018.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "museum",
  },
  {
    id: "7",
    title: "Beautiful Parks",
    description: "Relax and unwind in scenic parks near you.",
    image: "https://images.pexels.com/photos/955656/pexels-photo-955656.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "parks",
  },
  {
    id: "8",
    title: "Fitness Centers",
    description: "Find the best gyms and fitness centers near you.",
    image: "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "fitness",
  },
  {
    id: "9",
    title: "Libraries",
    description: "Discover quiet spots for reading and learning.",
    image: "https://images.pexels.com/photos/17887502/pexels-photo-17887502/free-photo-of-bike-in-front-of-a-bookshop.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "library",
  },
  {
    id: "10",
    title: "Shopping Malls",
    description: "Explore the best shopping experiences in your city.",
    image: "https://images.pexels.com/photos/264507/pexels-photo-264507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "shopping",
  },
  {
    id: "11",
    title: "Hotels and Resorts",
    description: "Find the perfect place to stay for your next trip.",
    image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "hotels",
  },
];



export default function ExploreScreen() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  const handleExploreNow = (category) => {
    router.push({
      pathname: "/explore-list-screen",
      params: { category },
    });
  };

  const renderExploreItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => handleExploreNow(item.category)}
        >
          <Text style={styles.exploreButtonText}>Explore Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Explore</Text>
      </View>
      <View>
        <CustomTextInput
          label={null}
          placeholder={"Search"}
          value={searchValue}
          onChangeText={setSearchValue}
          autoCapitalize="none"
        />
        <FlatList
          data={exploreData}
          renderItem={renderExploreItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListFooterComponent={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 16, marginBottom: 20 }}>
                No more result found.
              </Text>
            </View>
          }
          ListFooterComponentStyle={{
            paddingBottom: 150,
          }}
          style={{
            marginHorizontal: 5,
          }}
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: "100%",
    height: 150,
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#002045",
    marginBottom: 5,
    fontFamily: "Exo-Bold",
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    fontFamily: "Exo-Regular",
  },
  exploreButton: {
    backgroundColor: "#3470E4",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Exo-Bold",
  },
});
