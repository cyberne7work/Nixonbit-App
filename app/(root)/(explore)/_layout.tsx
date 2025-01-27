import { Stack } from "expo-router";
import "react-native-reanimated";

export default function ExploreLayout() {
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
        name="explore-list-screen"
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="explore-detailed-screen"
      />
    </Stack>
  );
}
