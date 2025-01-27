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

export default function OauthFacebook() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_facebook" });

  const handleFacebookSignIn = useCallback(async () => {
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
        style={[styles.socialButton, styles.facebookButton]}
        onPress={handleFacebookSignIn}
      >
        <MaterialIcons name="facebook" size={25} color="#fff" />
        <Text style={styles.socialButtonText}>Sign In with Facebook</Text>
      </TouchableOpacity>
    </View>
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
  forgotPassword: {
    textAlign: "right",
    color: "#3470E4",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 20,
    fontFamily: "Exo-Regular",
  },
  signInButton: {
    backgroundColor: "#3470E4",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Exo-Bold",
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
