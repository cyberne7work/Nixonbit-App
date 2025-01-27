import { CustomTextInput } from "@/components/CustomTextInput";
import { useRouter, useLocalSearchParams } from "expo-router";
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
import ListItem from "@/components/ListItems";

const exploreDetailsData = {
  coachingCenters: [
    {
      id: "1",
      name: "Bright Minds Coaching Center",
      description:
        "Expert coaching for competitive exams and academic excellence.",
      location: "Downtown, Springfield",
      image: "https://images.pexels.com/photos/30227319/pexels-photo-30227319/free-photo-of-serene-view-of-mount-fuji-at-dusk.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      contactNumber: "+1-555-123-4567",
      services: [
        "Mathematics Coaching",
        "Science Tutoring",
        "Competitive Exam Preparation (SAT, GRE, GMAT)",
      ],
      timings: {
        weekdays: "9:00 AM - 8:00 PM",
        weekends: "10:00 AM - 5:00 PM",
      },
    },
    {
      id: "2",
      name: "Future Scholars Academy",
      description: "Specialized coaching for academic and skill-based courses.",
      location: "Park Avenue, Springfield",
      image: "https://images.pexels.com/photos/30227319/pexels-photo-30227319/free-photo-of-serene-view-of-mount-fuji-at-dusk.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      contactNumber: "+1-555-987-6543",
      services: [
        "English Language Coaching",
        "Coding Classes",
        "Skill Development",
      ],
      timings: {
        weekdays: "10:00 AM - 7:00 PM",
        weekends: "9:00 AM - 3:00 PM",
      },
    },
  ],
  cafes: [
    {
      id: "1",
      name: "The Coffee Corner",
      description: "Cozy cafe with a variety of coffee and snacks.",
      location: "Market Square, Springfield",
      image: "https://images.pexels.com/photos/30227319/pexels-photo-30227319/free-photo-of-serene-view-of-mount-fuji-at-dusk.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      menu: ["Coffee", "Snacks", "Sandwiches", "Pastries"],
      timings: {
        weekdays: "7:00 AM - 10:00 PM",
        weekends: "8:00 AM - 11:00 PM",
      },
    },
    {
      id: "2",
      name: "Urban Cafe Lounge",
      description: "A relaxing cafe with co-working spaces.",
      location: "City Center, Springfield",
      image: "https://images.pexels.com/photos/30227319/pexels-photo-30227319/free-photo-of-serene-view-of-mount-fuji-at-dusk.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      menu: ["Espresso", "Bagels", "Smoothies", "Salads"],
      timings: {
        weekdays: "6:00 AM - 9:00 PM",
        weekends: "7:00 AM - 8:00 PM",
      },
    },
  ],
  gyms: [
    {
      id: "1",
      name: "Flex Gym & Fitness",
      description: "State-of-the-art gym for all your fitness needs.",
      location: "Park Road, Springfield",
      image: "https://images.pexels.com/photos/30227319/pexels-photo-30227319/free-photo-of-serene-view-of-mount-fuji-at-dusk.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      facilities: ["Weight Training", "Cardio Equipment", "Personal Trainers"],
      timings: {
        weekdays: "5:00 AM - 10:00 PM",
        weekends: "6:00 AM - 8:00 PM",
      },
    },
    {
      id: "2",
      name: "Powerhouse Gym",
      description:
        "Best gym in town for weightlifters and fitness enthusiasts.",
      location: "Downtown, Springfield",
      image: "https://images.pexels.com/photos/30227319/pexels-photo-30227319/free-photo-of-serene-view-of-mount-fuji-at-dusk.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      facilities: ["Powerlifting", "CrossFit", "Yoga Classes", "Steam Room"],
      timings: {
        weekdays: "6:00 AM - 9:00 PM",
        weekends: "7:00 AM - 7:00 PM",
      },
    },
  ],
  libraries: [
    {
      id: "1",
      name: "City Central Library",
      description: "A hub for book lovers and learners.",
      location: "Main Street, Springfield",
      image: "https://images.pexels.com/photos/30227319/pexels-photo-30227319/free-photo-of-serene-view-of-mount-fuji-at-dusk.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      facilities: ["Book Lending", "Digital Archives", "Reading Rooms"],
      timings: {
        weekdays: "8:00 AM - 9:00 PM",
        weekends: "9:00 AM - 5:00 PM",
      },
    },
    {
      id: "2",
      name: "Knowledge Haven Library",
      description: "A modern library with extensive digital resources.",
      location: "Elm Street, Springfield",
      image: "https://images.pexels.com/photos/30227319/pexels-photo-30227319/free-photo-of-serene-view-of-mount-fuji-at-dusk.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      facilities: ["Digital Resources", "Group Study Rooms", "Workshops"],
      timings: {
        weekdays: "9:00 AM - 8:00 PM",
        weekends: "10:00 AM - 4:00 PM",
      },
    },
  ],
  parks: [
    {
      id: "1",
      name: "Greenfield Park",
      description: "A serene park with lush greenery and walking trails.",
      location: "Greenfield, Springfield",
      image: "https://images.pexels.com/photos/30227319/pexels-photo-30227319/free-photo-of-serene-view-of-mount-fuji-at-dusk.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      facilities: ["Walking Trails", "Picnic Areas", "Playgrounds"],
      timings: {
        weekdays: "6:00 AM - 9:00 PM",
        weekends: "6:00 AM - 10:00 PM",
      },
    },
    {
      id: "2",
      name: "Hillcrest Park",
      description: "A popular spot for hiking and outdoor activities.",
      location: "Hill Road, Springfield",
      image: "https://images.pexels.com/photos/30227319/pexels-photo-30227319/free-photo-of-serene-view-of-mount-fuji-at-dusk.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      facilities: ["Hiking Trails", "Scenic Viewpoints", "Biking Tracks"],
      timings: {
        weekdays: "7:00 AM - 8:00 PM",
        weekends: "6:00 AM - 9:00 PM",
      },
    },
  ],
  activities: [
    {
      id: "1",
      name: "Hiking Trails",
      description: "Explore nature.",
      image: "https://images.pexels.com/photos/30227319/pexels-photo-30227319/free-photo-of-serene-view-of-mount-fuji-at-dusk.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      distance: "10 miles",
      difficulty: "Easy",
      time: "60 minutes",
      nearByParks: ["Green Park", "Mountain View Park", "Hillcrest Park"],
      activities: ["Hiking", "Biking", "Swimming"],
      nearByRestaurants: ["Bob's Burgers", "The Old Mill", "The Woodshed"],
      nearBySchools: ["Greenfield High School", "St. Patrick's Academy"],
      nearByAttractions: [
        "Mount Everest",
        "Statue of Liberty",
        "Empire State Building",
      ],
      nearByCafes: ["Cafe Mocha", "The Old Mill", "The Woodshed"],
      nearByHospitals: ["City Care Hospital", "St. Patrick's Hospital"],
      nearByLandmarks: ["Old Town Square", "The Old Mill", "The Woodshed"],
    },
    {
      id: "2",
      name: "Rock Climbing",
      description: "Adrenaline rush.",
      image: "https://images.pexels.com/photos/30227319/pexels-photo-30227319/free-photo-of-serene-view-of-mount-fuji-at-dusk.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      distance: "5 miles",
      difficulty: "Moderate",
      time: "1 hour and 30 minutes",
      nearByParks: ["Green Park", "Mountain View Park", "Hillcrest Park"],
      activities: ["Rock Climbing", "Bouldering", "Trampoline"],
      nearByRestaurants: ["Bob's Burgers", "The Old Mill", "The Woodshed"],
      nearBySchools: ["Greenfield High School", "St. Patrick's Academy"],
      nearByAttractions: [
        "Mount Everest",
        "Statue of Liberty",
        "Empire State Building",
      ],
      nearByCafes: ["Cafe Mocha", "The Old Mill", "The Woodshed"],
      nearByHospitals: ["City Care Hospital", "St. Patrick's Hospital"],
      nearByLandmarks: ["Old Town Square", "The Old Mill", "The Woodshed"],
    },
  ],
  school: [
    {
      id: "1",
      name: "Greenfield High School",
      type: "Secondary School",
      description: "Greenfield High School",
      location: "Greenfield, Ireland",
      image: "https://images.pexels.com/photos/30227319/pexels-photo-30227319/free-photo-of-serene-view-of-mount-fuji-at-dusk.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      website: "https://www.greenfieldhigh.ie",
      contactNumber: "+353-1-234-5678",
      email: "info@greenfieldhigh.ie",
      principal: "Dr. Emily Carter",
      establishedYear: 1985,
      studentCount: 1200,
      facultyCount: 80,
      motto: "Learn and Lead",
      gradesOffered: [
        "6th Grade",
        "7th Grade",
        "8th Grade",
        "9th Grade",
        "10th Grade",
        "11th Grade",
        "12th Grade",
      ],
      facilities: [
        "Library",
        "Sports Complex",
        "Science Labs",
        "Computer Labs",
        "Auditorium",
        "Cafeteria",
      ],
      extracurricularActivities: [
        "Soccer",
        "Basketball",
        "Drama Club",
        "Debate Team",
        "Music Band",
      ],
      achievements: [
        "Best Secondary School in Ireland (2023)",
        "National Science Fair Winners (2022)",
      ],
      averageClassSize: 25,
      address: {
        street: "123 Learning Avenue",
        city: "Greenfield",
        state: "County Dublin",
        postalCode: "A45 B67",
        country: "Ireland",
      },
      socialMedia: {
        facebook: "https://facebook.com/greenfieldhigh",
        twitter: "https://twitter.com/greenfieldhigh",
        instagram: "https://instagram.com/greenfieldhigh",
      },
      admissionDetails: {
        applicationStartDate: "2025-01-01",
        applicationEndDate: "2025-03-31",
        requirements: [
          "Birth Certificate",
          "Previous Report Card",
          "Recommendation Letter",
        ],
        fees: "€5,000 per year",
      },
      alumni: [
        { name: "John Doe", year: 2000, achievement: "CEO of TechCorp" },
        {
          name: "Jane Smith",
          year: 1995,
          achievement: "Nobel Prize in Literature",
        },
      ],
      events: [
        {
          name: "Science Fair",
          date: "2025-03-15",
          description:
            "A showcase of student science projects and innovations.",
        },
        {
          name: "Annual Sports Day",
          date: "2025-05-20",
          description: "A day of sports activities and competitions.",
        },
      ],
    },
    {
      id: "2",
      name: "Riverside Elementary School",
      description: "Riverside",
      type: "Primary School",
      location: "Sydney, Australia",
      image: "https://images.pexels.com/photos/30227319/pexels-photo-30227319/free-photo-of-serene-view-of-mount-fuji-at-dusk.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      website: "https://www.riversideelementary.au",
      contactNumber: "+61-2-9876-5432",
      email: "info@riverside.edu.au",
      principal: "Ms. Karen White",
      establishedYear: 1998,
      studentCount: 800,
      facultyCount: 50,
      motto: "Building Bright Futures",
      gradesOffered: [
        "Kindergarten",
        "1st Grade",
        "2nd Grade",
        "3rd Grade",
        "4th Grade",
        "5th Grade",
      ],
      facilities: ["Playground", "Art Room", "Library", "Science Labs"],
      extracurricularActivities: ["Art Club", "Dance", "Choir", "Chess Club"],
      achievements: [
        "Top Primary School in Sydney (2021)",
        "Young Innovators Award (2023)",
      ],
      averageClassSize: 20,
      address: {
        street: "45 River Drive",
        city: "Sydney",
        state: "New South Wales",
        postalCode: "2000",
        country: "Australia",
      },
      socialMedia: {
        facebook: "https://facebook.com/riversideelementary",
        twitter: "https://twitter.com/riversideelem",
      },
      admissionDetails: {
        applicationStartDate: "2025-02-01",
        applicationEndDate: "2025-04-30",
        requirements: ["Birth Certificate", "Proof of Residency"],
        fees: "AU$3,500 per year",
      },
      alumni: [],
      events: [
        {
          name: "Art Showcase",
          date: "2025-04-10",
          description: "A display of student artwork and projects.",
        },
      ],
    },
    {
      id: "3",
      name: "Maple Leaf Academy",
      type: "High School",
      description: "Riverside",
      location: "Toronto, Canada",
      image: "https://images.pexels.com/photos/30227319/pexels-photo-30227319/free-photo-of-serene-view-of-mount-fuji-at-dusk.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      website: "https://www.mapleleafacademy.ca",
      contactNumber: "+1-416-555-9876",
      email: "contact@mapleleafacademy.ca",
      principal: "Mr. David Harris",
      establishedYear: 1975,
      studentCount: 1500,
      facultyCount: 100,
      motto: "Excellence in Education",
      gradesOffered: ["9th Grade", "10th Grade", "11th Grade", "12th Grade"],
      facilities: [
        "Library",
        "Gymnasium",
        "Auditorium",
        "Science Labs",
        "Sports Fields",
      ],
      extracurricularActivities: [
        "Basketball",
        "Hockey",
        "Theatre Club",
        "Robotics",
      ],
      achievements: [
        "Provincial Champions in Basketball (2023)",
        "Top Science School in Ontario (2022)",
      ],
      averageClassSize: 30,
      address: {
        street: "789 Maple Avenue",
        city: "Toronto",
        state: "Ontario",
        postalCode: "M5J 2N8",
        country: "Canada",
      },
      socialMedia: {
        facebook: "https://facebook.com/mapleleafacademy",
        instagram: "https://instagram.com/mapleleafacademy",
      },
      admissionDetails: {
        applicationStartDate: "2025-01-15",
        applicationEndDate: "2025-05-15",
        requirements: ["Report Card", "Reference Letter"],
        fees: "CA$6,000 per year",
      },
      alumni: [
        {
          name: "Sarah Johnson",
          year: 2005,
          achievement: "Award-Winning Scientist",
        },
      ],
      events: [
        {
          name: "Robotics Competition",
          date: "2025-06-12",
          description: "A robotics event featuring student creations.",
        },
      ],
    },
    {
      id: "4",
      name: "Harmony International School",
      type: "International School",
      description: "Riverside",
      location: "Dubai, UAE",
      image: "https://images.pexels.com/photos/30227319/pexels-photo-30227319/free-photo-of-serene-view-of-mount-fuji-at-dusk.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      website: "https://www.harmonyintschool.ae",
      contactNumber: "+971-4-123-4567",
      email: "info@harmony.ae",
      principal: "Dr. Lina Ahmed",
      establishedYear: 2000,
      studentCount: 1000,
      facultyCount: 70,
      motto: "Unity in Diversity",
      gradesOffered: [
        "Kindergarten",
        "Primary",
        "Middle School",
        "High School",
      ],
      facilities: [
        "Swimming Pool",
        "Music Rooms",
        "Science Labs",
        "Computer Labs",
      ],
      extracurricularActivities: [
        "Swimming",
        "Drama Club",
        "Math Olympiad",
        "Model UN",
      ],
      achievements: [
        "International Science Fair Gold Medal (2023)",
        "Global Debate Champions (2022)",
      ],
      averageClassSize: 25,
      address: {
        street: "12 Harmony Street",
        city: "Dubai",
        state: "Emirate of Dubai",
        postalCode: "00000",
        country: "UAE",
      },
      socialMedia: {
        facebook: "https://facebook.com/harmonyintschool",
        twitter: "https://twitter.com/harmonyintschool",
      },
      admissionDetails: {
        applicationStartDate: "2025-03-01",
        applicationEndDate: "2025-07-01",
        requirements: ["Birth Certificate", "Previous School Records"],
        fees: "AED 25,000 per year",
      },
      alumni: [],
      events: [
        {
          name: "Cultural Fest",
          date: "2025-09-05",
          description: "A celebration of global cultures and traditions.",
        },
      ],
    },
  ],
  restaurants: [
    {
      id: "1",
      name: "The Bistro",
      type: "Italian",
      location: "New York, NY",
      image: "https://images.pexels.com/photos/30227319/pexels-photo-30227319/free-photo-of-serene-view-of-mount-fuji-at-dusk.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      menu: [
        {
          id: "1-1",
          name: "Pasta Carbonara",
          price: 12.99,
        },
        {
          id: "1-2",
          name: "Pizza Margherita",
          price: 14.99,
        },
        {
          id: "1-3",
          name: "Burger King",
          price: 8.99,
        },
      ],
    },
    {
      id: "2",
      name: "The Greasy Spoon",
      type: "American",
      location: "Los Angeles, CA",
      image: "https://images.pexels.com/photos/30227319/pexels-photo-30227319/free-photo-of-serene-view-of-mount-fuji-at-dusk.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      menu: [
        {
          id: "2-1",
          name: "Burger",
          price: 10.99,
        },
        {
          id: "2-2",
          name: "Fries",
          price: 5.99,
        },
        {
          id: "2-3",
          name: "Shrimp Scampi",
          price: 12.99,
        },
      ],
    },
    {
      id: "3",
      name: "The Lunchroom",
      type: "Chinese",
      location: "San Francisco, CA",
      image: "https://images.pexels.com/photos/30227319/pexels-photo-30227319/free-photo-of-serene-view-of-mount-fuji-at-dusk.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      menu: [
        {
          id: "3-1",
          name: "Chicken Wings",
          price: 11.99,
        },
        {
          id: "3-2",
          name: "Noodles",
          price: 8.99,
        },
        {
          id: "3-3",
          name: "Peking Duck",
          price: 15.99,
        },
      ],
    },
    {
      id: "4",
      name: "The Café Lou",
      type: "French",
      location: "Chicago, IL",
      image: "https://images.pexels.com/photos/30227319/pexels-photo-30227319/free-photo-of-serene-view-of-mount-fuji-at-dusk.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      menu: [
        {
          id: "4-1",
          name: "Cheeseburger",
          price: 10.99,
        },
        {
          id: "4-2",
          name: "Fries",
          price: 5.99,
        },
        {
          id: "4-3",
          name: "Couscous",
          price: 8.99,
        },
      ],
    },
  ],
  events: [
    {
      id: "1",
      name: "World Cup",
      date: "2022-06-15",
      location: "Rome, Italy",
      image: "https://images.pexels.com/photos/30227319/pexels-photo-30227319/free-photo-of-serene-view-of-mount-fuji-at-dusk.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      description:
        "The FIFA World Cup is an annual football tournament contested by the FIFA (Fédération Internationale de Football Association) football clubs of 32 nations, as well as the FIFA Confederations Cup and the FIFA World Cup qualifying phase. It is the most prestigious and lucrative international sporting event in the world.",
    },
    {
      id: "2",
      name: "NBA All-Star Game",
      date: "2022-10-28",
      location: "Los Angeles, CA",
      image: "https://images.pexels.com/photos/30227319/pexels-photo-30227319/free-photo-of-serene-view-of-mount-fuji-at-dusk.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      description:
        "The NBA All-Star Game is an annual professional basketball tournament that brings together the top 50 NBA players from the 30 best-selling colleges in the United States, as well as the 50 best-selling colleges in Canada. The tournament is played in 2021 and is the fourth-largest professional basketball tournament in the world.",
    },
    {
      id: "3",
      name: "MLB World Series",
      date: "2022-11-03",
      location: "New York, NY",
      image: "https://images.pexels.com/photos/30227319/pexels-photo-30227319/free-photo-of-serene-view-of-mount-fuji-at-dusk.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      description:
        "The MLB World Series is an annual professional baseball tournament held in the National League (NL) and American League (AL) conferences, featuring the top 16 teams from each division. It is the most prestigious and lucrative professional baseball tournament in the world.",
    },
    {
      id: "4",
      name: "NHL All-Star Game",
      date: "2022-11-07",
      location: "Vancouver, BC",
      image: "https://images.pexels.com/photos/30227319/pexels-photo-30227319/free-photo-of-serene-view-of-mount-fuji-at-dusk.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      description:
        "The NHL All-Star Game is an annual professional ice hockey tournament held in the National Hockey League (NHL) conferences, featuring the top 50 NHL players from the 30 best-selling colleges in the United States, as well as the 50 best-selling colleges in Canada. It is the most prestigious and lucrative professional ice hockey tournament in the world.",
    },
  ],
};

export default function ExploreListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const category = params.category || "events";

  const filteredData = exploreDetailsData[category]?.filter((item) =>
    item.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#002045" />
        </TouchableOpacity>
        <Text style={styles.header}>{category}</Text>
      </View>
      <View>
        <CustomTextInput
          label={null}
          placeholder={"Search"}
          value={searchValue}
          onChangeText={setSearchValue}
          style={styles.searchInput}
          autoCapitalize="none"
        />

        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListItem
              name={item.name}
              onPress={() =>
                router.push({
                  pathname: "/(root)/(explore)/explore-detailed-screen",
                  params: { item: JSON.stringify(item) },
                })
              }
            />
          )}
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
    fontFamily: "Exo-Regular",
    textAlign: "center",
    marginBottom: 10,
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -12 }], // Vertically center the icon
  },
  searchInput: {
    marginHorizontal: 5,
  },
  listContainer: {
    paddingBottom: 20,
    paddingHorizontal: 5,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#002045",
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
  },
});
