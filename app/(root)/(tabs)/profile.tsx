import {
  StyleSheet,
  Image,
  View,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useUser, useAuth } from "@clerk/clerk-expo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function ProfileScreen() {
  // State to simulate login status (true if logged in, false otherwise)
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const route = useRouter();
  const { userId, signOut, isSignedIn } = useAuth();
  const { user } = useUser();

  const handleLoginPress = () => {
    route.push("/(root)/(auth)/signin");
  };

  const handleRegisterPress = () => {
    route.push("/(root)/(auth)/signup");
  };

  return (
    <SafeAreaView style={styles.container}>
      {isSignedIn ? (
        // Logged-In State
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Profile Header */}
          <View style={styles.header}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb", // Replace with actual user profile image
              }}
              style={styles.profileImage}
            />
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userEmail}>
              {user?.emailAddresses[0].emailAddress}
            </Text>
          </View>

          {/* Profile Details Section */}
          <View style={styles.detailsContainer}>
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
          <View
            style={{
              marginBottom: 50,
            }}
          ></View>
        </ScrollView>
      ) : (
        // Not Logged-In State
        <View style={styles.notLoggedInContainer}>
          <Text style={styles.notLoggedInText}>You are not logged in.</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLoginPress}
          >
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

// import {
//   StyleSheet,
//   Image,
//   View,
//   Text,
//   TouchableOpacity,
//   Alert,
//   SafeAreaView,
//   ScrollView,
// } from "react-native";
// import { useState } from "react";
// import { useRouter } from "expo-router";
// import { useUser, useAuth } from "@clerk/clerk-expo";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// export default function ProfileScreen() {
//   const [isLoggedIn, setIsLoggedIn] = useState(true);
//   const route = useRouter();
//   const { userId, signOut, isSignedIn } = useAuth();
//   const { user } = useUser();

//   const handleLoginPress = () => {
//     route.push("/(root)/(auth)/signin");
//   };

//   const handleRegisterPress = () => {
//     route.push("/(root)/(auth)/signup");
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {isSignedIn ? (
//         <ScrollView contentContainerStyle={styles.scrollContent}>
//           {/* Profile Header */}
//           <View style={styles.header}>
//             <Image
//               source={{
//                 uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb", // Replace with actual user profile image
//               }}
//               style={styles.profileImage}
//             />
//             <Text style={styles.userName}>John Doe</Text>
//             <Text style={styles.userEmail}>
//               {user?.emailAddresses[0].emailAddress}
//             </Text>
//           </View>

//           {/* Profile Details Section */}
//           <View style={styles.detailsContainer}>
//             <TouchableOpacity style={styles.detailItem}>
//               <Text style={styles.detailText}>Account Settings</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.detailItem}>
//               <Text style={styles.detailText}>My Orders</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.detailItem}>
//               <Text style={styles.detailText}>Payment Methods</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.detailItem}>
//               <Text style={styles.detailText}>Help & Support</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.detailItem}>
//               <Text style={styles.detailText}>About Us</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.detailItem}>
//               <Text style={styles.detailText}>Feedback</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.detailItem}>
//               <Text style={styles.detailText}>Terms & Conditions</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.detailItem}>
//               <Text style={styles.detailText}>Privacy Policy</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.detailItem}>
//               <Text style={styles.detailText}>Contact Us</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Logout Button */}
//           <TouchableOpacity
//             style={styles.logoutButton}
//             onPress={() => {
//               signOut();
//             }}
//           >
//             <Text style={styles.logoutText}>Log Out</Text>
//           </TouchableOpacity>
//           <View
//             style={{
//               marginBottom: 50,
//             }}
//           ></View>
//         </ScrollView>
//       ) : (
//         <View style={styles.notLoggedInContainer}>
//           <Text style={styles.notLoggedInText}>You are not logged in.</Text>
//           <TouchableOpacity
//             style={styles.loginButton}
//             onPress={handleLoginPress}
//           >
//             <Text style={styles.loginButtonText}>Log In</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.registerButton}
//             onPress={handleRegisterPress}
//           >
//             <Text style={styles.registerButtonText}>Register</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000000", // Dark background from the watch face
//   },
//   scrollContent: {
//     paddingHorizontal: 10,
//     paddingBottom: 20,
//   },
//   header: {
//     alignItems: "center",
//     marginBottom: 30,
//     backgroundColor: "#000000", // Match dark background
//   },
//   profileImage: {
//     width: 150,
//     height: 150,
//     borderRadius: 50,
//     marginVertical: 15,
//     borderWidth: 2,
//     borderColor: "#1E90FF", // Light blue border to match watch face accents
//   },
//   userName: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#FFFFFF", // White text for contrast on dark background
//     fontFamily: "Exo-Bold",
//   },
//   userEmail: {
//     fontSize: 14,
//     color: "#A9A9A9", // Light gray text for secondary info, inspired by watch face
//     fontFamily: "Exo-Regular",
//   },
//   detailsContainer: {
//     marginTop: 20,
//     backgroundColor: "#1C1C1C", // Slightly lighter dark gray for contrast
//     borderRadius: 10,
//     paddingVertical: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   detailItem: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: "#2F2F2F", // Darker gray for borders
//   },
//   detailText: {
//     fontSize: 16,
//     color: "#FFFFFF", // White text for readability
//     fontFamily: "Exo-Regular",
//   },
//   logoutButton: {
//     marginTop: 10,
//     backgroundColor: "#1E90FF", // Blue accent from watch face
//     padding: 15,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   logoutText: {
//     fontSize: 16,
//     color: "#FFFFFF", // White text for button
//     fontWeight: "bold",
//     fontFamily: "Exo-Bold",
//   },
//   notLoggedInContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#000000", // Dark background
//   },
//   notLoggedInText: {
//     fontSize: 18,
//     color: "#FFFFFF", // White text
//     fontFamily: "Exo-Regular",
//     marginBottom: 20,
//   },
//   loginButton: {
//     backgroundColor: "#1E90FF", // Blue accent
//     padding: 15,
//     borderRadius: 10,
//     width: "60%",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   loginButtonText: {
//     color: "#FFFFFF", // White text
//     fontSize: 16,
//     fontWeight: "bold",
//     fontFamily: "Exo-Bold",
//   },
//   registerButton: {
//     backgroundColor: "transparent",
//     borderColor: "#1E90FF", // Blue accent for border
//     borderWidth: 1,
//     padding: 15,
//     borderRadius: 10,
//     width: "60%",
//     alignItems: "center",
//   },
//   registerButtonText: {
//     color: "#1E90FF", // Blue text for register button
//     fontSize: 16,
//     fontWeight: "bold",
//     fontFamily: "Exo-Bold",
//   },
// });