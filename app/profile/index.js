// app/profile/index.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProfileIndex() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Pokémon to view its details</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
