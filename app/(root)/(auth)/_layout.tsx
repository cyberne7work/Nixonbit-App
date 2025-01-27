import { Stack } from "expo-router";
import "react-native-reanimated";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="splash"
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="signup"
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="signin"
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="forget-password"
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="privacy-policy"
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="term-and-condition"
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="reset-password"
      />
    </Stack>
  );
}
