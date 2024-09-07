import React from 'react';
import { useTheme } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs>
      <Tabs.Screen
        name='index'
        options={{
          title: 'Pokémon List',
          tabBarIcon: ({ color, size, focused }) => (
            <FontAwesome
              name="circle"
              color={focused ? 'red' : colors.icon} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name='groupList'
        options={{
          title: 'Group List',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name="people"
              color={focused ? 'red' : colors.icon} 
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='favorites'
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name="heart"
              color={focused ? 'red' : colors.icon} 
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='Settings'
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name="settings"
              color={focused ? 'red' : colors.icon} // Use theme color for non-focused state
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
