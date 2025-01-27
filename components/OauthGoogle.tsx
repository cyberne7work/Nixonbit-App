import { CustomTextInput } from "@/components/CustomTextInput";
import { useRouter } from "expo-router";
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useSignIn } from "@clerk/clerk-expo";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";

export default function OauthGoogle() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const handleGoogleSignIn = useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({
          redirectUrl: Linking.createURL("/(root)/(tabs)/home", {
            scheme: "myapp",
          }),
        });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        if (signIn) {
          setActive!({ session: createdSessionId });
          router.push("/(root)/(tabs)/home");
        }
        if (signUp?.createdUserId) {
          setActive!({ session: createdSessionId });
          router.push("/(root)/(tabs)/home");
        }
      } else {
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  return (
    <View>
      <TouchableOpacity
        style={[styles.socialButton, styles.googleButton]}
        onPress={handleGoogleSignIn}
      >
        <Image
          source={require("../assets/icons/google.png")}
          style={styles.googleIcon}
        />
        <Text style={styles.googleButtonText}>Sign In with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
  googleIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    marginLeft: 10,
  },
  googleButtonText: {
    color: "#002045",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "bold",
    fontFamily: "Exo-Bold",
  },
  socialButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "bold",
    fontFamily: "Exo-Bold",
  },
  signUpRedirect: {
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
});
