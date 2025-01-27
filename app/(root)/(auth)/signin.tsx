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
import OauthFacebook from "@/components/OauthFacebook";
import OauthGoogle from "@/components/OauthGoogle";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, setActive, isLoaded } = useSignIn();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        setIsLoading(false);
        router.push("/(root)/(tabs)/home");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error", "Invalid credentials. Please try again.");
    }
  };

  const handleForgotPassword = () => {
    router.push("/(root)/(auth)/forget-password");
  };

  const handleFacebookSignIn = useCallback(async () => {
    try {
      const { startOAuthFlow } = useOAuth({ strategy: "oauth_facebook" });

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

  const handleGoogleSignIn = useCallback(async () => {
    try {
      const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Welcome Back!</Text>
        <Text style={styles.subHeader}>Sign in to your account</Text>

        <CustomTextInput
          label={"Email"}
          style={styles.input}
          placeholder="example@domain.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <CustomTextInput
          label={"Password"}
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          showToggleIcon
        />

        {/* Forgot Password Link */}
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity
          style={styles.signInButton}
          onPress={handleSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signInButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>

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

        {/* Sign-Up Redirect */}
        <Text style={styles.signUpRedirect}>
          Don't have an account?{" "}
          <Text
            style={styles.link}
            onPress={() => router.push("/(root)/(auth)/signup")}
          >
            Sign Up
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
