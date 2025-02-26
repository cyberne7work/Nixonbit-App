import { CustomTextInput } from "@/components/CustomTextInput";
import EventCard from "@/components/EventCard";
import ImageSlider from "@/components/ImageSlider";
import ServiceCard from "@/components/ServiceCard";
import { useState } from "react";
import { useRouter } from "expo-router"; // Add this import
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
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Define TypeScript interface for news data
interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  source: string;
  date?: string; // Optional: added for consistency with detailed view
  content?: string; // Optional: for detailed view
}
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

// Placeholder data for new sections
const noticeBoardData = [
  {
    id: "1",
    title: "Road Closure Alert",
    content: "Main St closed 3/15-3/20 for repairs.",
    date: "2025-03-14",
  },
  {
    id: "2",
    title: "Community Meeting",
    content: "Join us on 3/25 at 7 PM at City Hall.",
    date: "2025-03-20",
  },
];

const advertisementData = [
  {
    id: "1",
    title: "50% Off at TechTrendz",
    imageUrl:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    link: "https://techtrendz.com",
  },
  {
    id: "2",
    title: "Free Coffee at Cafe Mocha",
    imageUrl:
      "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    link: "https://cafemocha.com",
  },
];
const newsData: NewsItem[] = [
  {
    id: "1",
    headline: "New Park Opening",
    summary: "City unveils new park downtown next month.",
    source: "City News",
    date: "2025-03-14",
    content:
      "The city council has announced the grand opening of a new park in the downtown area, featuring green spaces, playgrounds, and a community garden. The event is scheduled for next month with a ribbon-cutting ceremony.",
  },
  {
    id: "2",
    headline: "Tech Expo 2025",
    summary: "Annual tech expo scheduled for April.",
    source: "Tech Daily",
    date: "2025-03-20",
    content:
      "Tech Expo 2025 will showcase the latest innovations in AI, robotics, and renewable energy. Held annually, this event attracts thousands of tech enthusiasts and industry leaders from around the globe.",
  },
  {
    id: "3",
    headline: "Local Art Festival",
    summary: "Art festival to celebrate local talent this weekend.",
    source: "Art Weekly",
    date: "2025-03-15",
    content:
      "This weekend’s art festival will feature local artists, live performances, and interactive workshops. Don’t miss the chance to explore creativity in your community!",
  },
];

export default function HomeScreen() {
  const [searchValue, setSearchValue] = useState("");
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();
  const displayedData = showAll ? servicesData : servicesData.slice(0, 6);
  const eventPress = () => {
    Alert.alert("Event Selected");
  };

  const handleAdPress = (link: string) => {
    Linking.openURL(link).catch((err) =>
      Alert.alert("Error", "Failed to open link: " + err.message)
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: "transparent" }}>
      <FlatList
        ListHeaderComponent={
          <View>
            <View style={styles.headerContainer}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.mainHeader}>
                  Welcome to <Text style={{ color: "#3470E4" }}>NixonBit!</Text>
                </Text>
                <Image
                  source={require("../../../assets/images/nixonbiticon.png")}
                  style={styles.logo}
                />
              </View>

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
              autoCapitalize='none'
            />

            <View>
              <TouchableOpacity
                onPress={() =>
                  router.push("/(root)/(services)/notice-list-screen")
                }
              >
                <View style={styles.headerButton}>
                  <Text style={styles.header}>Notice Board</Text>
                  <Text style={styles.viewAllText}>View All</Text>
                </View>
              </TouchableOpacity>
              <FlatList
                horizontal
                data={noticeBoardData}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  // <TouchableOpacity></TouchableOpacity>
                  <TouchableOpacity
                    style={styles.noticeCard}
                    onPress={() =>
                      router.push({
                        pathname: "/(root)/(services)/notice-detailed-screen",
                        params: { notice: JSON.stringify(item) },
                      })
                    }
                  >
                    <Text style={styles.noticeTitle}>{item.title}</Text>
                    <Text style={styles.noticeContent}>{item.content}</Text>
                    <Text style={styles.noticeDate}>{item.date}</Text>
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>

            {/* Advertisements Section */}
            <View>
              <Text style={styles.header}>Advertisements</Text>
              <FlatList
                horizontal
                data={advertisementData}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.adCard}
                    onPress={() => handleAdPress(item.link)}
                  >
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.adImage}
                      resizeMode='cover'
                    />
                    <Text style={styles.adTitle}>{item.title}</Text>
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>

            {/* News Section */}
            <View>
              <TouchableOpacity
                onPress={() =>
                  router.push("/(root)/(services)/news-list-screen")
                }
              >
                <View style={styles.headerButton}>
                  <Text style={styles.header}>Latest News</Text>
                  <Text style={styles.viewAllText}>View All</Text>
                </View>
              </TouchableOpacity>
              <FlatList
                horizontal
                data={newsData}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.newsCard}
                    onPress={() =>
                      router.push({
                        pathname: "/(root)/(services)/news-detailed-screen",
                        params: { news: JSON.stringify(item) },
                      })
                    }
                  >
                    <Text style={styles.newsHeadline}>{item.headline}</Text>
                    <Text style={styles.newsSummary}>{item.summary}</Text>
                    <Text style={styles.newsSource}>Source: {item.source}</Text>
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>

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
                snapToAlignment='center'
                snapToInterval={300}
                decelerationRate='fast'
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 20 }}
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
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ServiceCard
            iconName={item.iconName}
            serviceName={item.serviceName}
            description={item.description}
            price={item.price}
            availability={item.availability}
          />
        )}
        ListFooterComponentStyle={{ paddingBottom: 100 }}
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
              <ImageSlider images={publicImageUrls} />
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginLeft: 5,
    // marginTop: 20,
  },
  mainHeader: {
    fontSize: 24,
    fontFamily: "Exo-Bold",
    color: "#002045", // Primary color
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
    color: "#002045", // Primary color
  },
  search: {
    marginHorizontal: 5,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewAllButton: {
    alignSelf: "flex-end",
    borderRadius: 4,
    marginRight: 5,
  },

  viewAllText: {
    color: "#3470E4", // Secondary color
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Exo-Bold",
  },
  listContent: {
    paddingHorizontal: 8,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  // Notice Board Styles
  noticeCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    width: 250,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    // borderWidth: 1,
    borderColor: "#3470E4", // Secondary color
    marginBottom: 10,
  },
  noticeTitle: {
    fontSize: 16,
    fontFamily: "Exo-Bold",
    color: "#002045", // Primary color
    marginBottom: 5,
  },
  noticeContent: {
    fontSize: 14,
    fontFamily: "Exo-Regular",
    color: "#666",
  },
  noticeDate: {
    fontSize: 12,
    fontFamily: "Exo-Regular",
    color: "#3470E4", // Secondary color
    marginTop: 5,
  },
  // Advertisement Styles
  adCard: {
    alignItems: "center",
    marginRight: 10,
    width: 300,
    marginBottom: 10,
  },
  adImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 5,
    // borderWidth: 1,
    borderColor: "#002045", // Primary color
  },
  adTitle: {
    fontSize: 14,
    fontFamily: "Exo-Bold",
    color: "#3470E4", // Secondary color
    textAlign: "center",
  },
  // News Styles
  newsCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    width: 250,
    height: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    // borderWidth: 1,
    borderColor: "#002045", // Primary color
    marginBottom: 10,
  },
  newsHeadline: {
    fontSize: 16,
    fontFamily: "Exo-Bold",
    color: "#002045", // Primary color
    marginBottom: 5,
  },
  newsSummary: {
    fontSize: 14,
    fontFamily: "Exo-Regular",
    color: "#666",
  },
  newsSource: {
    fontSize: 12,
    fontFamily: "Exo-Regular",
    color: "#3470E4", // Secondary color
    marginTop: 5,
  },
});
// primary:"#002045"
// secondary:"#3470E4"
