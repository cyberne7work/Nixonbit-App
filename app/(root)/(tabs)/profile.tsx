import {
  StyleSheet,
  Image,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { useUser, useAuth } from "@clerk/clerk-expo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { apiRequest } from "@/utils/api";

export default function ProfileScreen() {
  const [profileData, setProfileData] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const router = useRouter();
  const { userId, signOut, isSignedIn } = useAuth();
  const { user } = useUser();

  console.log(`User ${user?.emailAddresses[0].emailAddress}`);

  const handleLoginPress = () => {
    router.push("/(root)/(auth)/signin");
  };

  const handleRegisterPress = () => {
    router.push("/(root)/(auth)/signup");
  };

  const handleEditProfilePress = () => {
    router.push("/(root)/(auth)/edit-profile-screen");
  };

  // Function to fetch profile data
  const fetchProfile = useCallback(async () => {
    if (!user?.id) return; // Guard against missing user
    setIsLoading(true);
    try {
      const response = await apiRequest(`/nixonbit/users/${user.id}`, "GET");
      if (response.success) {
        console.log("Profile data:", response.data);
        setProfileData(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]); // Depend on user.id

  // Initial fetch when signed in
  useEffect(() => {
    if (isSignedIn) {
      fetchProfile();
    }
  }, [isSignedIn, fetchProfile]);

  // Refetch when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (isSignedIn) {
        fetchProfile();
      }
    }, [isSignedIn, fetchProfile])
  );

  return (
    <SafeAreaView style={styles.container}>
      {isSignedIn ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Profile Header */}
          <View style={styles.header}>
            <Image
              source={{
                uri:
                  user?.imageUrl ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
              }}
              style={styles.profileImage}
            />
            <Text style={styles.userName}>{profileData?.name || "John Doe"}</Text>
            <Text style={styles.userEmail}>
              {user?.emailAddresses[0].emailAddress}
            </Text>
            <View style={styles.profileInfo}>
              <Text style={styles.profileLabel}>Address:</Text>
              <Text style={styles.profileText}>
                {profileData.address || "Not set"}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileLabel}>Bio:</Text>
              <Text style={styles.profileText}>
                {profileData.bio || "Not set"}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileLabel}>Phone:</Text>
              <Text style={styles.profileText}>
                {profileData.phone || "Not set"}
              </Text>
            </View>
          </View>

          {/* Profile Details Section */}
          <View style={styles.detailsContainer}>
            <TouchableOpacity
              style={styles.detailItem}
              onPress={handleEditProfilePress}
            >
              <Text style={styles.detailText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailItem}>
              <Text style={styles.detailText}>Account Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailItem}>
              <Text style={styles.detailText}>My Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailItem}>
              <Text style={styles.detailText}>Payment Methods</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailItem}>
              <Text style={styles.detailText}>Help & Support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailItem}>
              <Text style={styles.detailText}>About Us</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailItem}>
              <Text style={styles.detailText}>Feedback</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailItem}>
              <Text style={styles.detailText}>Terms & Conditions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailItem}>
              <Text style={styles.detailText}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailItem}>
              <Text style={styles.detailText}>Contact Us</Text>
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              signOut();
            }}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
          <View style={{ marginBottom: 50 }}></View>
        </ScrollView>
      ) : (
        <View style={styles.notLoggedInContainer}>
          <Text style={styles.notLoggedInText}>You are not logged in.</Text>
          <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegisterPress}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 50,
    marginVertical: 15,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#002045",
    fontFamily: "Exo-Bold",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Exo-Regular",
    marginBottom: 10, // Added spacing
  },
  profileText: {
    fontSize: 14,
    color: "#333", // Darker color for better readability
    fontFamily: "Exo-Regular",
    marginTop: 2, // Space between label and text
    flexWrap: "wrap", // Allow bio to wrap if it's long
  },
  profileInfo: {
    width: "90%", // Control width to align with other elements
    marginVertical: 5, // Spacing between items
    alignItems: "flex-start",
  },
  profileLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#002045",
    fontFamily: "Exo-Bold",
  },
  detailsContainer: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailText: {
    fontSize: 16,
    color: "#002045",
    fontFamily: "Exo-Regular",
  },
  logoutButton: {
    marginTop: 10,
    backgroundColor: "#3470E4",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "Exo-Bold",
  },
  notLoggedInContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notLoggedInText: {
    fontSize: 18,
    color: "#002045",
    fontFamily: "Exo-Regular",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#3470E4",
    padding: 15,
    borderRadius: 10,
    width: "60%",
    alignItems: "center",
    marginBottom: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Exo-Bold",
  },
  registerButton: {
    backgroundColor: "#fff",
    borderColor: "#3470E4",
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    width: "60%",
    alignItems: "center",
  },
  registerButtonText: {
    color: "#3470E4",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Exo-Bold",
  },
});