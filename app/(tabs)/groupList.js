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

  useEffect(() => {
    const fetchPokemonFromStorage = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const pokemonKeys = keys.filter(key => key.startsWith('pokemon_'));

        if (pokemonKeys.length === 0) {
          throw new Error('No Pokémon data found in storage');
        }

        const pokemonValues = await AsyncStorage.multiGet(pokemonKeys);

        const storedPokemon = pokemonValues.map(([key, value]) => {
          try {
            return JSON.parse(value);
          } catch (parseError) {
            console.error(`Failed to parse Pokémon data for key ${key}:`, parseError);
            return null;
          }
        }).filter(pokemon => pokemon !== null);

        if (storedPokemon.length === 0) {
          throw new Error('No valid Pokémon data found in storage');
        }

        const allTypes = [...new Set(storedPokemon.map(pokemon => pokemon.type[0]))];

        const groupedByType = allTypes.reduce((acc, type) => {
          acc[type] = storedPokemon.filter(pokemon => pokemon.type[0] === type);
          return acc;
        }, {});

        setPokemonData(groupedByType);
      } catch (err) {
        console.error('Failed to load Pokémon data from storage:', err);
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
        data={Object.keys(pokemonData)} // List of types
        keyExtractor={(item) => item}
        renderItem={({ item: type }) => (
          <View style={styles.group}>
            <Text style={[styles.groupTitle, isDarkMode && styles.darkGroupTitle]}>
              {type.charAt(0).toUpperCase() + type.slice(1)} Pokémon
            </Text>
            <FlatList
              data={pokemonData[type]} // List of Pokémon in each type
              keyExtractor={(pokemon) => pokemon.id.toString()}
              renderItem={({ item }) => (
                <View style={[styles.itemContainer, isDarkMode && styles.darkItemContainer]}>
                  <TouchableOpacity
                    style={[styles.item, isDarkMode && styles.darkItem]}
                    onPress={() => handleNavigateToDetails(item.id)}
                  >
                    <Image source={{ uri: item.localImage }} style={styles.image} />           
                    <Text style={[styles.itemText, isDarkMode && styles.darkItemText]}>
                      {item.name} #{item.id}
                    </Text>
                  </TouchableOpacity>
                  
                  {/* Add to Favorites Button */}
                  <TouchableOpacity onPress={() => handleAddToFavorites(item)}>
                    <Text style={[styles.favoriteButton, item.isFavorite && styles.favoriteButtonActive]}>
                      {item.isFavorite ? '★' : '☆'}
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
    padding: 10,
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
    alignItems: 'center',
    marginBottom: 10,
  },
  darkItemContainer: {
    backgroundColor: '#444',
    borderRadius: 5,
    padding: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  darkItem: {
    backgroundColor: '#555',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
    flex: 1,
  },
  darkItemText: {
    color: '#fff',
  },
  favoriteButton: {
    fontSize: 24,
    color: '#888',
  },
  favoriteButtonActive: {
    color: '#f00',
  },
  loader: {
    marginTop: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  darkError: {
    color: '#f88',
  },
});
