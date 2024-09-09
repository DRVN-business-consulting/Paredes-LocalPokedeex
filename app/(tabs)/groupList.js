import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../src/theme/ThemeContext';
import { useFavorites } from '../../src/theme/FavoritesContext';
import { useRouter } from 'expo-router';

export default function GroupList() {
  const router = useRouter();
  const { theme } = useTheme();
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const isDarkMode = theme === 'dark';
  const [pokemonData, setPokemonData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const POKEMON_LIMIT_PER_TYPE = 5;

  useEffect(() => {
    const fetchPokemonFromStorage = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const pokemonKeys = keys.filter((key) => key.startsWith('pokemon_')); // Only get Pokémon keys

        const pokemonValues = await AsyncStorage.multiGet(pokemonKeys);
        const storedPokemon = pokemonValues.map(([key, value]) => JSON.parse(value));

        // Gather all unique Pokémon types
        const allTypes = [...new Set(storedPokemon.map(pokemon => pokemon.profile.type[0]))];

        // Group Pokémon by type
        const groupedByType = allTypes.reduce((acc, type) => {
          acc[type] = storedPokemon.filter(pokemon => pokemon.profile.type[0] === type);
          return acc;
        }, {});

        setPokemonData(groupedByType);
      } catch (err) {
        setError('Failed to load Pokémon data from storage');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonFromStorage();
  }, [favorites]);

  const handleNavigateToDetails = (pokemonId) => {
    router.push(`/profile/${pokemonId}`);
  };

  const handleAddToFavorites = (pokemon) => {
    addFavorite(pokemon);
  };

  const handleRemoveFromFavorites = (pokemon) => {
    removeFavorite(pokemon);
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
        data={Object.keys(pokemonData)} // List the types
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.group}>
            <Text style={[styles.groupTitle, isDarkMode && styles.darkGroupTitle]}>
              {item.charAt(0).toUpperCase() + item.slice(1)} Pokémon
            </Text>
            <FlatList
              data={pokemonData[item].slice(0, POKEMON_LIMIT_PER_TYPE)} // Limit per type
              keyExtractor={(pokemon) => pokemon.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                  <TouchableOpacity
                    style={[styles.item, isDarkMode && styles.darkItem]}
                    onPress={() => handleNavigateToDetails(item.id)}
                  >
                    <Image source={{ uri: item.localImage }} style={styles.image} />
                    <Text style={[styles.itemText, isDarkMode && styles.darkItemText]}>
                      {item.name} #{item.id}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      item.isFavorite ? handleRemoveFromFavorites(item) : handleAddToFavorites(item)
                    }
                  >
                    <Text style={[styles.favoriteButton, item.isFavorite && styles.favoriteButtonAdded]}>
                      {item.isFavorite ? 'Added to Favorites' : 'Add to Favorites'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        )}
      />
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
  group: {
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  darkGroupTitle: {
    color: '#fff',
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
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  darkItem: {
    borderBottomColor: '#555',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#000',
  },
  darkItemText: {
    color: '#fff',
  },
  favoriteButton: {
    color: '#007BFF',
    padding: 10,
  },
  favoriteButtonAdded: {
    color: '#28a745',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  error: {
    color: 'red',
  },
  darkError: {
    color: '#f88',
  },
});
