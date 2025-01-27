import { CustomTextInput } from "@/components/CustomTextInput";
import EventCard from "@/components/EventCard";
import ImageSlider from "@/components/ImageSlider";
import ServiceCard from "@/components/ServiceCard";
import { useState } from "react";

import {
  StyleSheet,
  Image,
  Platform,
  View,
  ScrollView,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const publicImageUrls = [
  // "https://images.unsplash.com/photo-1593642634311-18a8d3fd4031?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800", // A workspace
  "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800", // A beautiful beach
  "https://images.unsplash.com/photo-1532619187604-47191f8a3b41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800", // Sunset with a mountain
  "https://images.unsplash.com/photo-1528799636145-dfd4f7d5a3d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800", // Forest pathway
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800", // A scenic lake
];

const servicesData = [
  {
    id: "1",
    serviceName: "Home Cleaning",
    iconName: "cleaning-services", // MaterialIcons
    description:
      "Comprehensive cleaning services for your home, including dusting, vacuuming, and mopping.",
    price: 50, // Price in USD
    duration: "2-3 hours",
    availability: true,
    category: "Household",
  },
  {
    id: "2",
    serviceName: "Plumbing",
    iconName: "plumbing", // MaterialIcons
    description:
      "Expert plumbing services for leaks, installations, and repairs.",
    price: 80,
    duration: "1-2 hours",
    availability: true,
    category: "Maintenance",
  },
  {
    id: "3",
    serviceName: "Electrician",
    iconName: "electrical-services", // MaterialIcons
    description:
      "Certified electricians for installations, repairs, and maintenance.",
    price: 70,
    duration: "1-3 hours",
    availability: false,
    category: "Maintenance",
  },
  {
    id: "4",
    serviceName: "Car Wash",
    iconName: "local-car-wash", // FontAwesome
    description:
      "Professional car washing services, including interior and exterior cleaning.",
    price: 30,
    duration: "1-2 hours",
    availability: true,
    category: "Automobile",
  },
  {
    id: "5",
    serviceName: "Gardening",
    iconName: "nature", // MaterialIcons
    description: "Gardening services for lawn care, planting, and landscaping.",
    price: 60,
    duration: "2-4 hours",
    availability: true,
    category: "Outdoor",
  },
  {
    id: "6",
    serviceName: "Personal Training",
    iconName: "fitness-center", // MaterialIcons
    description:
      "One-on-one fitness training sessions with certified trainers.",
    price: 100,
    duration: "1 hour",
    availability: true,
    category: "Health & Fitness",
  },
  {
    id: "7",
    serviceName: "Babysitting",
    iconName: "child-care", // MaterialIcons
    description: "Experienced babysitters to care for your children.",
    price: 20,
    duration: "Per hour",
    availability: false,
    category: "Personal Care",
  },
  {
    id: "8",
    serviceName: "Carpentry",
    iconName: "construction", // MaterialIcons
    description: "Skilled carpenters for furniture making and repairs.",
    price: 90,
    duration: "2-5 hours",
    availability: true,
    category: "Maintenance",
  },
  {
    id: "9",
    serviceName: "Laundry",
    iconName: "local-laundry-service", // MaterialIcons
    description: "Laundry services including washing, drying, and ironing.",
    price: 25,
    duration: "1 day",
    availability: true,
    category: "Household",
  },
  {
    id: "10",
    serviceName: "Pet Grooming",
    iconName: "pets", // MaterialIcons
    description: "Professional pet grooming services for dogs and cats.",
    price: 40,
    duration: "1-2 hours",
    availability: true,
    category: "Pet Care",
  },
];

const eventsData = [
  {
    id: "1",
    date: "MAR 05",
    eventTitle: "Maroon 5",
    location: "Recife, Brazil",
    imageUrl: "https://via.placeholder.com/150", // Replace with actual image URL
  },
  {
    id: "2",
    date: "APR 12",
    eventTitle: "Coldplay",
    location: "São Paulo, Brazil",
    imageUrl: "https://via.placeholder.com/150", // Replace with actual image URL
  },
  {
    id: "3",
    date: "MAY 18",
    eventTitle: "Ed Sheeran",
    location: "Rio de Janeiro, Brazil",
    imageUrl: "https://via.placeholder.com/150", // Replace with actual image URL
  },
  {
    id: "4",
    date: "JUN 21",
    eventTitle: "Adele",
    location: "London, UK",
    imageUrl: "https://via.placeholder.com/150", // Replace with actual image URL
  },
  {
    id: "5",
    date: "JUL 15",
    eventTitle: "Taylor Swift",
    location: "New York, USA",
    imageUrl: "https://via.placeholder.com/150", // Replace with actual image URL
  },
  {
    id: "6",
    date: "AUG 10",
    eventTitle: "The Weeknd",
    location: "Toronto, Canada",
    imageUrl: "https://via.placeholder.com/150", // Replace with actual image URL
  },
];

const mixedData = [
  {
    id: "1",
    name: "The Gourmet Kitchen",
    type: "Restaurant",
    location: "New York, USA",
    imageUrl: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d", // Restaurant interior
    website: "https://www.thegourmetkitchen.com",
  },
  {
    id: "2",
    name: "Cafe Mocha",
    type: "Restaurant",
    location: "Paris, France",
    imageUrl: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0", // Coffee shop
    website: "https://www.cafemocha.fr",
  },
  {
    id: "3",
    name: "Greenfield High School",
    type: "School",
    location: "California, USA",
    imageUrl: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc", // School building
    website: "https://www.greenfieldhigh.edu",
  },
  {
    id: "4",
    name: "St. Patrick's Academy",
    type: "School",
    location: "Dublin, Ireland",
    imageUrl: "https://images.unsplash.com/photo-1596495577886-d920f1ff04f2", // Classroom
    website: "https://www.stpatricks.ie",
  },
  {
    id: "5",
    name: "City Care Hospital",
    type: "Hospital",
    location: "London, UK",
    imageUrl: "https://images.unsplash.com/photo-1586772001873-4d71b0fdc101", // Hospital exterior
    website: "https://www.citycarehospital.co.uk",
  },
  {
    id: "6",
    name: "Sunrise Medical Center",
    type: "Hospital",
    location: "Dubai, UAE",
    imageUrl: "https://images.unsplash.com/photo-1584438785041-c5c89e3df9b1", // Hospital room
    website: "https://www.sunrisemedical.ae",
  },
  {
    id: "7",
    name: "FitLife Gym",
    type: "Gym",
    location: "San Francisco, USA",
    imageUrl: "https://images.unsplash.com/photo-1558611848-73f7eb4001df", // Gym interior
    website: "https://www.fitlife.com",
  },
  {
    id: "8",
    name: "Muscle Factory",
    type: "Gym",
    location: "Bangkok, Thailand",
    imageUrl: "https://images.unsplash.com/photo-1517964603305-676044d3ad39", // Gym equipment
    website: "https://www.musclefactory.co.th",
  },
  {
    id: "9",
    name: "Pasta Paradise",
    type: "Restaurant",
    location: "Rome, Italy",
    imageUrl: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092", // Italian food
    website: "https://www.pastaparadise.it",
  },
  {
    id: "10",
    name: "Bright Future International",
    type: "School",
    location: "Sydney, Australia",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161ea178e", // Students studying
    website: "https://www.brightfuture.edu.au",
  },
];

export default function HomeScreen() {
  const [searchValue, setSearchValue] = useState("");
  const [showAll, setShowAll] = useState(false);
  const displayedData = showAll ? servicesData : servicesData.slice(0, 6);
  const eventPress = () => {
    Alert.alert("Event Selected");
  };
  return (
    <SafeAreaView
      style={{
        backgroundColor: "transparent",
      }}
    >
      <FlatList
        ListHeaderComponent={
          <View>
            <View style={styles.headerContainer}>
              <Text style={styles.mainHeader}>
                Welcome to{" "}
                <Text
                  style={{
                    color: "#3470E4",
                  }}
                >
                  NixonBit!
                </Text>
              </Text>
              <Text style={styles.description}>
                Discover your city, all in one place!
              </Text>
            </View>
            <CustomTextInput
              label={null}
              placeholder={"Search"}
              value={searchValue}
              onChangeText={setSearchValue}
              style={styles.search}
            />

            <View>
              <Text style={styles.header}>Trending in City</Text>
              <FlatList
                horizontal
                data={mixedData}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  <EventCard
                    eventTitle={item.name}
                    location={item.location}
                    type={item.type}
                    image={item.imageUrl}
                    onPress={eventPress}
                  />
                )}
                pagingEnabled
                snapToAlignment="center"
                snapToInterval={300} // Set this value based on the card width + margin
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                style={{
                  marginBottom: 20,
                }}
              />
            </View>
            <View>
              <Text style={styles.header}>Featured Services</Text>
            </View>
          </View>
        }
        data={displayedData}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent} // Apply styles here
        renderItem={({ item }) => (
          <ServiceCard
            iconName={item.iconName}
            serviceName={item.serviceName}
            description={item.description}
            price={item.price}
            availability={item.availability}
          />
        )}
        ListFooterComponentStyle={{
          paddingBottom: 100,
        }}
        ListFooterComponent={
          <View>
            {!showAll ? (
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => setShowAll(true)}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => setShowAll(false)}
              >
                <Text style={styles.viewAllText}>Hide</Text>
              </TouchableOpacity>
            )}
            <View>
              <Text style={styles.header}>City Gallery</Text>
            </View>
            <ImageSlider images={publicImageUrls} />
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginLeft: 5,
    marginTop: 10,
  },

  mainHeader: {
    fontSize: 24,
    fontFamily: "Exo-Bold",
  },
  description: {
    fontFamily: "Exo-Regular",
    lineHeight: 24,
    color: "#002045",
  },
  header: {
    fontSize: 17,
    fontFamily: "Exo-Bold",
    marginBottom: 15,
    marginLeft: 5,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  search: {
    marginHorizontal: 5,
  },
  card: {
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  viewAllButton: {
    alignSelf: "flex-end", // Align the button to the right
    borderRadius: 4,
    marginRight: 5, // Add some spacing from the right edge
  },
  viewAllText: {
    color: "#3470E4", // Set text color to white for better contrast
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Exo-Bold",
  },
  listContent: {
    // backgroundColor: "red", // Light gray background color
    // paddingVertical: 16, // Optional padding for better spacing
    // paddingHorizontal: 8, // Horizontal padding to match the card layout
  },
});

// primary:"#002045"
// secondary:"#3470E4"
