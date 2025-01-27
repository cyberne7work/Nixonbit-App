import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { CustomTextInput } from "@/components/CustomTextInput";

export default function ProfileDetails() {
  const route = useRouter();
  const params = useLocalSearchParams();
  const profile = JSON.parse(params.profile || "{}"); // Parse the serialized profile
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Simulate login state
  const [rating, setRating] = useState(0); // User-given rating
  const [review, setReview] = useState(""); // User-written review

  const handleCall = () => {
    if (profile.phoneNumber) {
      Linking.openURL(`tel:${profile.phoneNumber}`).catch((err) =>
        Alert.alert("Error", "Unable to make a call.")
      );
    } else {
      Alert.alert("Info", "Phone number not available.");
    }
  };

  const handleSubmitReview = () => {
    if (rating === 0 || review.trim() === "") {
      Alert.alert("Error", "Please provide both a rating and a review.");
      return;
    }
    Alert.alert("Thank You!", "Your review has been submitted.");
    // Logic to save the review can be added here
    setRating(0);
    setReview("");
  };
  console.log(profile);

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
          <Text style={styles.header}>Provider</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Profile Picture */}

          <Image
            source={{ uri: profile.profilePic }}
            style={styles.profilePic}
          />

          {/* Name and Details */}
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.rating}>Rating: {profile.rating} / 5</Text>
          <Text style={styles.experience}>
            {profile.experience} years of experience
          </Text>

          {/* Call Button */}
          <TouchableOpacity style={styles.callButton} onPress={handleCall}>
            <MaterialIcons name="phone" size={20} color="#fff" />
            <Text style={styles.callButtonText}>Call Now</Text>
          </TouchableOpacity>

          {/* Reviews */}
          <Text style={styles.reviewsHeader}>Reviews</Text>
          <Text style={styles.review}>
            - "Excellent work! Very professional." - Client A
          </Text>
          <Text style={styles.review}>
            - "Great experience, highly recommend." - Client B
          </Text>

          {/* Add Review Section (Only if logged in) */}
          {isLoggedIn && (
            <View style={styles.addReviewContainer}>
              <Text style={styles.addReviewHeader}>Add Your Review</Text>

              {/* Star Rating */}
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    style={styles.star}
                  >
                    <MaterialIcons
                      name="star"
                      size={30}
                      color={star <= rating ? "#FFD700" : "#ccc"}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <CustomTextInput
                label={null}
                placeholder="Write your review here..."
                value={review}
                onChangeText={setReview}
                multiline={true}
              />

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitReview}
              >
                <Text style={styles.submitButtonText}>Submit Review</Text>
              </TouchableOpacity>
            </View>
          )}
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
    padding: 16,
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

  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: "center",
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#3470E4",
  },
  name: {
    fontSize: 26,
    fontFamily: "Exo-Bold",
    textAlign: "center",
    marginBottom: 8,
  },
  rating: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 8,
    fontFamily: "Exo-Regular",
  },
  experience: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
    fontFamily: "Exo-Regular",
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3470E4",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  callButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
    fontFamily: "Exo-Regular",
  },
  reviewsHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    fontFamily: "Exo-Regular",
  },
  review: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: "Exo-Regular",
  },
  addReviewContainer: {
    marginTop: 20,
    marginBottom: 60,
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addReviewHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "Exo-Regular",
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  star: {
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: "#3470E4",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Exo-Regular",
  },
});
