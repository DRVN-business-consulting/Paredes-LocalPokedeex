import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useFavorites } from '../../src/theme/FavoritesContext';
import { useTheme } from '../../src/theme/ThemeContext';
import { useRouter } from 'expo-router';

export default function FavoritesScreen() {
  const { favorites, removeFavorite } = useFavorites();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const router = useRouter();

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <View style={[styles.itemContainer, isDarkMode && styles.darkItemContainer]}>
              <TouchableOpacity
                onPress={() => router.push(`/profile/${item.id}`)} // Navigate to dynamic route with ID
                style={styles.touchable}
              >
                <Image source={{ uri: item.image }} style={styles.image} />
                <Text style={[styles.itemText, isDarkMode && styles.darkItemText]}>{item.name}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeFavorite(item.id)} style={styles.removeButtonContainer}>
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
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  itemContainer: {
    flex: 0.48,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3, // Shadow for android only
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginBottom: 16,
  },
  darkItemContainer: {
    backgroundColor: '#444',
  },
  image: {
    width: '45%',
    height: 150,
    resizeMode: 'cover',
  },
  itemText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginVertical: 10,
  },
  darkItemText: {
    color: '#fff',
  },
  removeButton: {
    color: 'red',
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
  },
  removeButtonContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#777',
  },
  darkEmptyText: {
    color: '#ccc',
  },
  touchable: {
    alignItems: 'center',
    padding: 10,
  },
});
