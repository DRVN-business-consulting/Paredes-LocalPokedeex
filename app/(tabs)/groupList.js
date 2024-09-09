// app/(tabs)/groupList.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { useFavorites } from '../../src/theme/FavoritesContext'; 
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchPokemonFromStorage } from '../utils/storageUtils'; 

export default function GroupList() {
  const router = useRouter();
  const { theme } = useTheme();
  const { favorites, addFavorite, removeFavorite } = useFavorites(); 
  const isDarkMode = theme === 'dark';
  const [pokemonData, setPokemonData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPokemonData = async () => {
      try {
        const storedPokemon = await fetchPokemonFromStorage(); 

        
        const markedPokemon = storedPokemon.map(pokemon => ({
          ...pokemon,
          isFavorite: favorites.some(fav => fav.id === pokemon.id),
        }));

        
        const allTypes = [...new Set(markedPokemon.map(pokemon => pokemon.type[0]))];
        const groupedByType = allTypes.reduce((acc, type) => {
          acc[type] = markedPokemon.filter(pokemon => pokemon.type[0] === type);
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

    loadPokemonData();
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
    setPokemonData((prevData) => {
      const updatedData = { ...prevData };
      Object.keys(updatedData).forEach((type) => {
        updatedData[type] = updatedData[type].map(p => 
          p.id === pokemon.id ? { ...p, isFavorite: !p.isFavorite } : p
        );
      });
      return updatedData;
    });
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
        data={Object.keys(pokemonData)}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.groupContainer}>
            <Text style={[styles.groupTitle, isDarkMode && styles.darkGroupTitle]}>{item}</Text>
            <FlatList
              data={pokemonData[item]} // List as group
              keyExtractor={(pokemon) => pokemon.id.toString()}
              renderItem={({ item }) => (
                <View style={[styles.itemContainer, isDarkMode && styles.darkItemContainer]}>
                  <TouchableOpacity
                    style={[styles.item, isDarkMode && styles.darkItem]}
                    onPress={() => handleNavigateToDetails(item.id)}
                  >
                    <Image source={{  uri: item.image.hires  }} style={styles.image} />
                    <View style={styles.infoContainer}>
                      <Text style={[styles.pokemonName, isDarkMode && styles.darkPokemonName]}>{item.name.english} #{item.id}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.favoriteButton}
                      onPress={() => handleToggleFavorite(item)}
                    >
                      <Icon
                        name={item.isFavorite ? 'heart' : 'heart-outline'}
                        size={24}
                        color={item.isFavorite ? 'red' : isDarkMode ? '#fff' : '#000'}
                      />
                    </TouchableOpacity>
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
    padding: 16,
  },
  darkContainer: {
    backgroundColor: '#1e1e1e',
  },
  groupContainer: {
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  darkGroupTitle: {
    color: '#fff',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  darkItemContainer: {
    backgroundColor: '#333',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  pokemonName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  darkPokemonName: {
    color: '#fff',
  },
  pokemonId: {
    fontSize: 14,
    color: '#888',
  },
  favoriteButton: {
    padding: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  darkError: {
    color: '#fff',
  },
});
