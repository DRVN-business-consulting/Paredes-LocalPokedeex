import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../src/theme/ThemeContext';
import { FavoritesProvider } from '../src/theme/FavoritesContext';
import { AuthProvider } from '../src/theme/AuthContext';

export default function AppLayout() {
  return (
    <AuthProvider>
    <ThemeProvider>
      <FavoritesProvider>
        <Stack>
          {/* Home Screen */}
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
          {/* Tabs Screen */}
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

<Stack.Screen
            name="login"
            options={{
              title: 'login',
              headerShown: false,
              headerStyle: {
                backgroundColor: 'green',
              },
              headerTintColor: 'yellow',
            }}
          />
        </Stack>
      </FavoritesProvider>
    </ThemeProvider>
    </AuthProvider>
  );
}
