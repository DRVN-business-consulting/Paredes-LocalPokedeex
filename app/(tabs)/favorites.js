import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useFavorites } from '../../src/theme/FavoritesContext';
import { useTheme } from '../../src/theme/ThemeContext';
import { useRouter } from 'expo-router'; // Import the router hook from expo-router

export default function FavoritesScreen() {
  const { favorites, removeFavorite } = useFavorites();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const router = useRouter(); // Get the router object for navigation

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.itemContainer, isDarkMode && styles.darkItemContainer]}>
              <TouchableOpacity
                onPress={() => router.push(`/profile/${item.id}`)} // Navigate to dynamic route with ID
              >
                <Image source={{ uri: item.image }} style={styles.image} />
                <Text style={[styles.itemText, isDarkMode && styles.darkItemText]}>{item.name}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeFavorite(item.id)}>
                <Text style={styles.removeButton}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={[styles.emptyText, isDarkMode && styles.darkEmptyText]}>No favorites yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  darkItemContainer: {
    borderBottomColor: '#555',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  itemText: {
    fontSize: 16,
    color: '#000',
  },
  darkItemText: {
    color: '#fff',
  },
  removeButton: {
    color: 'red',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  },
  darkEmptyText: {
    color: '#fff',
  },
});
