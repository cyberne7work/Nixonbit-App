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

export default function ResetPassword() {
  const router = useRouter();
  const { signIn, isLoaded } = useSignIn();

  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async () => {
    if (!otpCode || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      if (!isLoaded) return;

      // Attempt password reset
      const response = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: otpCode,
        password: newPassword,
      });

      if (response.status === "complete") {
        Alert.alert("Success", "Password reset successfully.");
        router.replace("/(root)/(auth)/signin"); // Redirect to Sign-In page
      } else {
        Alert.alert("Error", "Invalid OTP or reset failed. Please try again.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
    //   console.error('error', error.errors[0].longMessage)

      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Reset Password</Text>
        <Text style={styles.subHeader}>
          Enter the OTP sent to your email along with your new password.
        </Text>

        {/* OTP Input */}
        <CustomTextInput
          label={"OTP"}
          style={styles.input}
          placeholder="Enter OTP"
          value={otpCode}
          onChangeText={setOtpCode}
          keyboardType="numeric"
        />

        {/* New Password Input */}
        <CustomTextInput
          label={"New Password"}
          style={styles.input}
          placeholder="Enter new password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />

        {/* Confirm Password Input */}
        <CustomTextInput
          label={"Confirm Password"}
          style={styles.input}
          placeholder="Re-enter new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {/* Reset Password Button */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetPassword}
        >
          <Text style={styles.resetButtonText}>Reset Password</Text>
        </TouchableOpacity>
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
    marginBottom: 15,
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
});
