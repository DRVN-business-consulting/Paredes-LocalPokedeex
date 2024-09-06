
import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          headerStyle: {
            backgroundColor: 'pink',
          },
          headerTintColor: 'Black',
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          title: 'My Tabs',
          headerShown: false,
          headerStyle: {
            backgroundColor: 'green',
          },
          headerTintColor: 'yellow',
        }}
      />
    </Stack>
  );
}
