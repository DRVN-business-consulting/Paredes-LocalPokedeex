import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../src/theme/ThemeContext';
import { useRouter } from 'expo-router';
import { useFavorites } from '../../src/theme/FavoritesContext';

export default function Index() {
  const router = useRouter();
  const { theme } = useTheme();
  const { favorites, addFavorite } = useFavorites();
  const isDarkMode = theme === 'dark';
  const [pokemonData, setPokemonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        // Check if Pokémon data is already saved in AsyncStorage
        const savedPokemonData = await AsyncStorage.getItem('pokemonData');
        
        if (savedPokemonData) {
          // If data exists, use it
          setPokemonData(JSON.parse(savedPokemonData));
          setLoading(false);
        } else {
          // If no data in storage, fetch from API
          const response = await axios.get('http://192.168.100.6:8000/pokemon?limit=20');
          const pokemonList = response.data;

          const detailedPokemonPromises = pokemonList.map(async (pokemon) => ({
            id: pokemon.id,
            name: pokemon.name.english,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
            isFavorite: favorites.some(fav => fav.id === pokemon.id), 
          }));

          const detailedPokemon = await Promise.all(detailedPokemonPromises);
          
          // Save the fetched data to AsyncStorage
          await AsyncStorage.setItem('pokemonData', JSON.stringify(detailedPokemon));

          // Update state with the fetched data
          setPokemonData(detailedPokemon);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching Pokémon data:', err); 
        setError('Failed to load Pokémon data');
        setLoading(false);
      }
    };

    fetchPokemonData();
  }, [favorites]); // Add favorites to dependencies to update when favorites change

  const handleNavigateToDetails = (pokemonId) => {
    router.push(`/profile/${pokemonId}`); 
  };

  const handleAddToFavorites = (pokemon) => {
    addFavorite(pokemon); 
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
          <View style={[styles.itemContainer, isDarkMode && styles.darkItemContainer]}>
            <TouchableOpacity
              style={[styles.item, isDarkMode && styles.darkItem]}
              onPress={() => handleNavigateToDetails(item.id)}
            >
              <Image source={{ uri: item.image }} style={styles.image} />           
              <Text style={[styles.itemText, isDarkMode && styles.darkItemText]}>{item.name} #{item.id}</Text>
            </TouchableOpacity>
            
            {/* Add to Favorites Button */}
            <TouchableOpacity onPress={() => handleAddToFavorites(item)}>
              <Text style={[styles.favoriteButton, item.isFavorite ? styles.favorite : styles.notFavorite]}>
                {item.isFavorite ? 'Unfavorite' : 'Favorite'}
              </Text>
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
