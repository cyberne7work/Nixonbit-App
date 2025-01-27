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
        name="servicelist-screen"
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="servicelist-detail-screen"
      />
    </Stack>
  );
}
