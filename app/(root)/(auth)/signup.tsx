import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { CustomTextInput } from "@/components/CustomTextInput";
import OtpModal from "@/components/OtpModel";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import OauthFacebook from "@/components/OauthFacebook";
import OauthGoogle from "@/components/OauthGoogle";

export default function Signup() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [name, setName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  console.log("code", code);

  const handleSignup = async () => {
    if (!name || !emailAddress || !password) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (!isLoaded) return;

    try {
      // Start signup process
      await signUp.create({
        emailAddress,
        password,
      });

      // Send OTP to user's email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true); // Show OTP modal
    } catch (err) {
      console.error("Signup Error:", err);
      Alert.alert(
        "Error",
        "An error occurred during signup. Please try again."
      );
    }
  };

  const handleVerifyOTP = async (code) => {
    if (!isLoaded) return;
    console.log("Verification OTP", code);

    try {
      // Verify OTP
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        Alert.alert("Success", "Signup successful!");
        router.replace("/"); // Redirect to the homepage
      } else {
        console.error("Verification Error:", signUpAttempt);
        Alert.alert("Error", "Verification failed. Please try again.");
      }
    } catch (err) {
      console.error("Verification Error:", err);
      Alert.alert("Error", "Invalid verification code. Please try again.");
    }
  };

  const handleFacebookSignup = () => {
    Alert.alert("Facebook Signup", "Redirecting to Facebook signup...");
    // Add Facebook signup logic here
  };

  const handleGoogleSignup = () => {
    Alert.alert("Google Signup", "Redirecting to Google signup...");
    // Add Google signup logic here
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Create your Account</Text>

        <CustomTextInput
          label={"Your Name"}
          style={styles.input}
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
        />
        <CustomTextInput
          label={"Your Email"}
          style={styles.input}
          placeholder="example@domain.com"
          value={emailAddress}
          onChangeText={setEmailAddress}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <CustomTextInput
          label={"Password"}
          style={styles.input}
          placeholder="Enter a strong password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          showToggleIcon
        />

        {/* Signup Button */}
        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Terms and Conditions Message */}
        <Text style={styles.termsText}>
          By signing up, you agree to our{" "}
          <Text
            style={styles.link}
            onPress={() => router.push("/(root)/(auth)/term-and-condition")}
          >
            Terms of Service
          </Text>{" "}
          and{" "}
          <Text
            style={styles.link}
            onPress={() => router.push("/(root)/(auth)/privacy-policy")}
          >
            Privacy Policy
          </Text>
          .
        </Text>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>

        {/* Sign In with Facebook */}
        <OauthFacebook />

        {/* Sign In with Google */}
        <OauthGoogle />
        {/* Already have an account? */}
        <Text style={styles.login}>
          Already have an Account{" "}
          <Text
            style={styles.link}
            onPress={() => router.push("/(root)/(auth)/signin")}
          >
            Login
          </Text>
        </Text>
      </ScrollView>

      {/* OTP Modal */}
      {pendingVerification && (
        <OtpModal
          isVisible={pendingVerification}
          onClose={() => setPendingVerification(false)}
          onSubmit={(enteredCode) => {
            console.log("enteredCode", enteredCode);
            setCode(enteredCode);
            handleVerifyOTP(enteredCode);
          }}
        />
      )}
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
    marginBottom: 20,
    color: "#002045",
    fontFamily: "Exo-Bold",
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: "#333",
    fontFamily: "Exo-Regular",
  },
  signupButton: {
    backgroundColor: "#3470E4",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Exo-Bold",
  },
  termsText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "Exo-Regular",
  },
  link: {
    color: "#3470E4",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: "#666",
    fontFamily: "Exo-Regular",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  facebookButton: {
    backgroundColor: "#3b5998",
  },
  googleButton: {
    backgroundColor: "#fff",
  },
  googleButtonText: {
    color: "#002045",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "bold",
    fontFamily: "Exo-Bold",
  },
  login: {
    fontSize: 15,
    color: "#002045",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "Exo-Regular",
  },
  socialButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "bold",
    fontFamily: "Exo-Bold",
  },
});
