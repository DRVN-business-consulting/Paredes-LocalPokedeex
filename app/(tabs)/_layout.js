
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name='index'
        options={{
          title: 'Pokémon List',
        }}
      />
      <Tabs.Screen
        name='groupList'
        options={{
          title: 'Group List',
        }}
      />
            <Tabs.Screen
        name='favorites'
        options={{
          title: 'favorites',
        }}
      />
      <Tabs.Screen
        name='Settings'
        options={{
          title: 'Settings',
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
