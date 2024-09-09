// app/(tabs)/favorites.js

import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { useFavorites } from '../../src/theme/FavoritesContext'; 
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Favorites() {
  const router = useRouter();
  const { theme } = useTheme();
  const { favorites, removeFavorite, loading, error } = useFavorites(); 
  const isDarkMode = theme === 'dark';

  const handleDeleteFavorite = async (pokemonId) => {
    try {
      await removeFavorite(pokemonId);
    } catch (err) {
      console.error('Failed to delete favorite:', err);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} style={styles.loader} />;
  }

  if (error) {
    return <Text style={[styles.error, isDarkMode && styles.darkError]}>{error}</Text>;
  }

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyMessage, isDarkMode && styles.darkEmptyMessage]}>
            No Favorites Yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.cardContainer, isDarkMode && styles.darkCardContainer]}>
              <TouchableOpacity
                style={styles.cardContent}
                onPress={() => router.push(`/profile/${item.id}`)}
              >
                <Image source={{ uri: item.image.hires }} style={styles.image} />
                <View style={styles.textContainer}>
                  <Text style={[styles.pokemonName, isDarkMode && styles.darkPokemonName]}>
                    {item.name.english || 'Unknown'} # {item.id}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteFavorite(item.id)}
                    style={styles.deleteButton}
                  >
                    <Icon
                      name="delete-outline"
                      size={24}
                      color={isDarkMode ? '#fff' : '#000'}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3, 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 10,
    overflow: 'hidden',
  },
  darkCardContainer: {
    backgroundColor: '#444',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  darkPokemonName: {
    color: '#fff',
  },
  deleteButton: {
    padding: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  error: {
    textAlign: 'center',
    color: 'red',
    fontSize: 16,
  },
  darkError: {
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessage: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  darkEmptyMessage: {
    color: '#fff',
  },
});
