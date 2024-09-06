import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="Profile"
        options={{
          title: 'Pokémon Profile',
          headerShown: false,
        }}
      />
      <Stack.Screen
      name="[id]"
      options={{
        title:'[id]',
        headerShown:false,
      }}
      />
    </Stack>
  );
}
