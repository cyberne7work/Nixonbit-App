import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
} from "react-native";

export default function OtpModal({
  isVisible,
  onClose,
  onSubmit,
  error = null,
}) {
  const [otp, setOtp] = useState("");

  const handlePaste = async () => {
    const clipboardText = await navigator.clipboard.readText();
    if (clipboardText && /^\d{6}$/.test(clipboardText)) {
      setOtp(clipboardText);
    } else {
      Alert.alert("Error", "Please paste a valid 6-digit OTP.");
    }
  };

  const handleSubmit = () => {
    if (otp.length === 6) {
      onSubmit(otp);
    } else {
      Alert.alert("Error", "Please enter a valid 6-digit OTP.");
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.message}>
            We have sent a 6-digit OTP to your email. Please enter it below to
            verify your email address.
          </Text>

          {/* OTP Input */}
          <TextInput
            style={styles.otpInput}
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
            maxLength={6}
            placeholder="Enter OTP"
            autoFocus
            autoCapitalize="none"
            allowFontScaling={false}
          />

          {error ? (
            <>
              <Text>{error}</Text>
            </>
          ) : null}

          {/* Paste Button */}
          <TouchableOpacity style={styles.pasteButton} onPress={handlePaste}>
            <Text style={styles.pasteText}>Paste OTP</Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Verify</Text>
          </TouchableOpacity>

          {/* Close Modal */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#002045",
    marginBottom: 10,
    fontFamily: "Exo-Bold",
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
    fontFamily: "Exo-Regular",
  },
  otpInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 18,
    textAlign: "center",
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    fontFamily: "Exo-Regular",
  },
  pasteButton: {
    alignSelf: "center",
    marginBottom: 20,
  },
  pasteText: {
    fontSize: 16,
    color: "#3470E4",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  submitButton: {
    backgroundColor: "#3470E4",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Exo-Bold",
  },
  closeButton: {
    alignSelf: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "bold",
    fontFamily: "Exo-Regular",
  },
});
