// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   SafeAreaView,
//   ScrollView,
// } from "react-native";
// import { CustomTextInput } from "@/components/CustomTextInput";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import { useRouter } from "expo-router";

// export default function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const router = useRouter();

//   const handleResetPassword = () => {
//     if (!email) {
//       Alert.alert("Error", "Please enter your email address.");
//       return;
//     }
//     Alert.alert(
//       "Success",
//       "If this email is registered, you will receive a password reset link shortly."
//     );
//     // Logic to handle sending password reset link can be added here
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <Text style={styles.header}>Forgot Password?</Text>
//         <Text style={styles.subHeader}>
//           Enter your email address and we’ll send you a link to reset your
//           password.
//         </Text>

//         <CustomTextInput
//           label={"Email Address"}
//           style={styles.input}
//           placeholder="example@domain.com"
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />

//         {/* Reset Password Button */}
//         <TouchableOpacity
//           style={styles.resetButton}
//           onPress={handleResetPassword}
//         >
//           <Text style={styles.resetButtonText}>Send Reset Link</Text>
//         </TouchableOpacity>

//         {/* Back to Login */}
//         <Text style={styles.backToLogin}>
//           Remembered your password?{" "}
//           <Text
//             style={styles.link}
//             onPress={() => router.push("/(root)/(auth)/signin")}
//           >
//             Log In
//           </Text>
//         </Text>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollContent: {
//     marginHorizontal: 15,
//     paddingVertical: 20,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 10,
//     color: "#002045",
//     fontFamily: "Exo-Bold",
//   },
//   subHeader: {
//     fontSize: 16,
//     textAlign: "center",
//     marginBottom: 20,
//     color: "#666",
//     fontFamily: "Exo-Regular",
//   },
//   input: {
//     marginBottom: 15,
//   },
//   resetButton: {
//     backgroundColor: "#3470E4",
//     paddingVertical: 15,
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   resetButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//     fontFamily: "Exo-Bold",
//   },
//   backToLogin: {
//     fontSize: 14,
//     textAlign: "center",
//     marginTop: 20,
//     color: "#666",
//     fontFamily: "Exo-Regular",
//   },
//   link: {
//     color: "#3470E4",
//     fontWeight: "bold",
//     textDecorationLine: "underline",
//   },
// });

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { CustomTextInput } from "@/components/CustomTextInput";
import { useRouter } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { signIn, isLoaded } = useSignIn();
  const [ errorMessage, setErrorMessage ] = useState("");

  const handleSendResetLink = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    try {
      if (!isLoaded) return;

      // Request password reset email
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      Alert.alert(
        "Verification Code Sent",
        "Please check your email for the verification code."
      );
      router.push("/(root)/(auth)/reset-password");

    } catch (error) {
    //   console.error("Error requesting reset link:", error.message);
      setErrorMessage(error?.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Forgot Password?</Text>
        <Text style={styles.subHeader}>
          Enter your email address and we’ll send you a link to reset your
          password.
        </Text>

        <CustomTextInput
          label={"Email Address"}
          style={styles.input}
          placeholder="example@domain.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}

        {/* Send Reset Link Button */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleSendResetLink}
        >
          <Text style={styles.resetButtonText}>Send Reset Link</Text>
        </TouchableOpacity>

        {/* Back to Login */}
        <Text style={styles.backToLogin}>
          Remembered your password?{" "}
          <Text
            style={styles.link}
            onPress={() => router.push("/(root)/(auth)/signin")}
          >
            Log In
          </Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    marginHorizontal: 15,
    paddingVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#002045",
    fontFamily: "Exo-Bold",
  },
  subHeader: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
    fontFamily: "Exo-Regular",
  },
  input: {
    marginBottom: 5,
  },
  resetButton: {
    backgroundColor: "#3470E4",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Exo-Bold",
  },
  backToLogin: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
    color: "#666",
    fontFamily: "Exo-Regular",
  },
  link: {
    color: "#3470E4",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  errorMessage: {
    color: "#ff0000",
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 15,
    fontFamily: "Exo-Regular",
  }
});
