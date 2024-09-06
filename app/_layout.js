// app/_layout.js
import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../src/theme/ThemeContext';

export default function AppLayout() {
  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
}
