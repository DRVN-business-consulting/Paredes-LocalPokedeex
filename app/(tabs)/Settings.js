// app/(tabs)/groupList.js


import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { useRouter } from 'expo-router';
import * as Updates from 'expo-updates';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const router = useRouter();

  const handleLogout = async () => {
    await Updates.reloadAsync(); // Reloads the app as the on.back gives me a hard time with the samefile names
    //router.replace('/'); doesn't work on my hierarchy 
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <View style={styles.switchContainer}>
        <Text style={[styles.label, isDarkMode && styles.darkText]}>Switch Theme</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
        />
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  text: {
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  switchContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  logoutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ff6f61',
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
  },
});
