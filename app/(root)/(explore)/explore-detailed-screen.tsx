import React from "react";
import {
  StyleSheet,
  Image,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useRouter } from "expo-router";

export default function DetailsScreen() {
  // Retrieve the passed item from params
  const params = useLocalSearchParams();
  const item = params.item ? JSON.parse(params.item) : null; // Parse the JSON string
  const route = useRouter();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => route.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#002045" />
          </TouchableOpacity>
          <Text style={styles.header}>{item.name}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header Section */}
          <View style={styles.headerSecond}>
            {item.image && (
              <Image
                source={{ uri: item.image }}
                style={styles.headerImage}
                resizeMode="cover"
              />
            )}
            <Text style={styles.headerTitle}>{item.name}</Text>
            {item.location && (
              <Text style={styles.headerSubtitle}>
                <MaterialIcons name="location-pin" size={18} color="#666" />{" "}
                {item.location}
              </Text>
            )}
          </View>

          {/* Details Section */}
          <View style={styles.detailsContainer}>
            {/* Description */}
            {item.description && (
              <View style={styles.detailItem}>
                <MaterialIcons name="description" size={20} color="#3470E4" />
                <Text style={styles.detailText}>{item.description}</Text>
              </View>
            )}

            {/* Website */}
            {item.website && (
              <View style={styles.detailItem}>
                <MaterialIcons name="public" size={20} color="#3470E4" />
                <Text style={styles.detailText}>Website: {item.website}</Text>
              </View>
            )}

            {/* Email */}
            {item.email && (
              <View style={styles.detailItem}>
                <MaterialIcons name="email" size={20} color="#3470E4" />
                <Text style={styles.detailText}>Email: {item.email}</Text>
              </View>
            )}

            {/* Contact */}
            {item.contactNumber && (
              <View style={styles.detailItem}>
                <MaterialIcons name="phone" size={20} color="#3470E4" />
                <Text style={styles.detailText}>
                  Contact: {item.contactNumber}
                </Text>
              </View>
            )}

            {/* Principal */}
            {item.principal && (
              <View style={styles.detailItem}>
                <MaterialIcons name="person" size={20} color="#3470E4" />
                <Text style={styles.detailText}>
                  Principal: {item.principal}
                </Text>
              </View>
            )}

            {/* Established Year */}
            {item.establishedYear && (
              <View style={styles.detailItem}>
                <MaterialIcons name="event" size={20} color="#3470E4" />
                <Text style={styles.detailText}>
                  Established: {item.establishedYear}
                </Text>
              </View>
            )}

            {/* Students and Faculty */}
            {item.studentCount && item.facultyCount && (
              <View style={styles.detailItem}>
                <MaterialIcons name="group" size={20} color="#3470E4" />
                <Text style={styles.detailText}>
                  Students: {item.studentCount}, Faculty: {item.facultyCount}
                </Text>
              </View>
            )}

            {/* Motto */}
            {item.motto && (
              <View style={styles.detailItem}>
                <MaterialIcons name="flag" size={20} color="#3470E4" />
                <Text style={styles.detailText}>Motto: {item.motto}</Text>
              </View>
            )}

            {/* Grades Offered */}
            {item.gradesOffered && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Grades Offered</Text>
                {item.gradesOffered.map((grade, index) => (
                  <Text key={index} style={styles.listItem}>
                    - {grade}
                  </Text>
                ))}
              </View>
            )}

            {/* Facilities */}
            {item.facilities && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Facilities</Text>
                {item.facilities.map((facility, index) => (
                  <Text key={index} style={styles.listItem}>
                    - {facility}
                  </Text>
                ))}
              </View>
            )}

            {/* Extracurricular Activities */}
            {item.extracurricularActivities && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Extracurricular Activities
                </Text>
                {item.extracurricularActivities.map((activity, index) => (
                  <Text key={index} style={styles.listItem}>
                    - {activity}
                  </Text>
                ))}
              </View>
            )}

            {/* Achievements */}
            {item.achievements && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Achievements</Text>
                {item.achievements.map((achievement, index) => (
                  <Text key={index} style={styles.listItem}>
                    - {achievement}
                  </Text>
                ))}
              </View>
            )}

            {/* Address */}
            {item.address && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Address</Text>
                <Text style={styles.listItem}>
                  Street: {item.address.street}
                </Text>
                <Text style={styles.listItem}>City: {item.address.city}</Text>
                <Text style={styles.listItem}>State: {item.address.state}</Text>
                <Text style={styles.listItem}>
                  Postal Code: {item.address.postalCode}
                </Text>
                <Text style={styles.listItem}>
                  Country: {item.address.country}
                </Text>
              </View>
            )}
          </View>

          {/* Footer Section */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => alert(`Contacting ${item.name}...`)}
          >
            <Text style={styles.actionButtonText}>Contact Now</Text>
          </TouchableOpacity>
          <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            &copy; {new Date().getFullYear()} UberSchool. All rights reserved.
          </Text>
        </View>
        </ScrollView>

      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  scrollContent: {
    // marginHorizontal: 5,
    marginBottom: 50,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
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
    left: 0,
    top: "50%",
    transform: [{ translateY: -12 }], // Vertically center the icon
  },
  headerSecond: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Exo-Bold",
    color: "#002045",
    marginVertical: 10,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontFamily: "Exo-Regular",
  },
  detailsContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 10,
    fontFamily: "Exo-Regular",
  },
  section: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#002045",
    marginBottom: 10,
    fontFamily: "Exo-Regular",
  },
  listItem: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
    paddingLeft: 15,
    fontFamily: "Exo-Regular",
  },
  actionButton: {
    marginTop: 20,
    backgroundColor: "#3470E4",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Exo-Bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    fontWeight: "bold",
    marginTop: 10,
    fontFamily: "Exo-Regular",
  },
  footerContainer: {
    backgroundColor: "#F5F5F5",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  
  },
  footerText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Exo-Regular",
  }
});
