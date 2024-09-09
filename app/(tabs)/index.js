// app/(tabs)/Index.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { useFavorites } from '../../src/theme/FavoritesContext'; 
import { fetchPokemonFromStorage } from '../utils/storageUtils'; 
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Index() {
  const router = useRouter();
  const { theme } = useTheme();
  const { favorites, addFavorite, removeFavorite } = useFavorites(); 
  const isDarkMode = theme === 'dark';
  const [pokemonData, setPokemonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedPokemon = await fetchPokemonFromStorage();
        const updatedPokemon = storedPokemon.map(pokemon => ({
          ...pokemon,
          isFavorite: favorites.some(fav => fav.id === pokemon.id),
        }));
        updatedPokemon.sort((a, b) => a.id - b.id); // Sort Pokémon by ID
        setPokemonData(updatedPokemon);
      } catch (err) {
        console.error('Failed to load Pokémon data from storage:', err);
        setError('Failed to load Pokémon data from storage');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [favorites]);

  const handleNavigateToDetails = (pokemonId) => {
    router.push(`/profile/${pokemonId}`);
  };

  const handleToggleFavorite = async (pokemon) => {
    if (pokemon.isFavorite) {
      await removeFavorite(pokemon.id);
    } else {
      await addFavorite(pokemon);
    }

    setPokemonData((prevData) =>
      prevData.map((p) =>
        p.id === pokemon.id ? { ...p, isFavorite: !p.isFavorite } : p
      )
    );
  };

  const handleDeletePokemon = async (pokemonId) => {
    try {
      await AsyncStorage.removeItem(`pokemon_${pokemonId}`);
      setPokemonData((prevData) => prevData.filter(pokemon => pokemon.id !== pokemonId));
    } catch (err) {
      console.error('Failed to delete Pokémon from storage:', err);
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
      <FlatList
        data={pokemonData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.cardContainer, isDarkMode && styles.darkCardContainer]}>
            <TouchableOpacity
              style={styles.cardContent}
              onPress={() => handleNavigateToDetails(item.id)}
            >
              <Image source={{ uri: item.localImage }} style={styles.image} />
              <View style={styles.textContainer}>
                <Text style={[styles.pokemonName, isDarkMode && styles.darkPokemonName]}>
                 {item.name} # {item.id} 
                </Text>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() => handleToggleFavorite(item)}
                    style={styles.favoriteButton}
                  >
                    <Icon
                      name={item.isFavorite ? 'heart' : 'heart-outline'}
                      size={24}
                      color={item.isFavorite ? 'red' : isDarkMode ? '#fff' : '#000'}
                    />
                  </TouchableOpacity>

                  {/* Delete Button */}
                  <TouchableOpacity
                    onPress={() => handleDeletePokemon(item.id)}
                    style={styles.deleteButton}
                  >
                    <Icon
                      name="delete-outline"
                      size={24}
                      color={isDarkMode ? '#fff' : '#000'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
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
  favoriteButton: {
    padding: 5,
  },
  deleteButton: {
    padding: 5,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
});
