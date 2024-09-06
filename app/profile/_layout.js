// app/profile/_layout.js
import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'Pokémon Profile',
            headerShown:false,
         }}
        
      />
    </Stack>
  );
}
