import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../src/theme/ThemeContext';
import { FavoritesProvider } from '../src/theme/FavoritesContext';

export default function AppLayout() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <Stack>
          {/* Home Screen */}
          <Stack.Screen
            name="index"
            options={{
              title: 'Home',
              headerShown: false, // Hides the header for this screen
              headerStyle: {
                backgroundColor: 'pink', // Customize header background color
              },
              headerTintColor: 'Black', // Customize header text color
            }}
          />
          {/* Tabs Screen */}
          <Stack.Screen
            name="(tabs)"
            options={{
              title: 'My Tabs',
              headerShown: false, // Hides the header for this screen
              headerStyle: {
                backgroundColor: 'green', // Customize header background color
              },
              headerTintColor: 'yellow', // Customize header text color
            }}
          />
        </Stack>
      </FavoritesProvider>
    </ThemeProvider>
  );
}
