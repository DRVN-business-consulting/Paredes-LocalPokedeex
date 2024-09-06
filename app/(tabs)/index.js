import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useTheme } from '../../src/theme/ThemeContext';
import { useRouter } from 'expo-router';

export default function PokemonScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [pokemonData, setPokemonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await axios.get('http://192.168.100.6:8000/pokemon?limit=20');
        const pokemonList = response.data;

        const detailedPokemonPromises = pokemonList.map(async (pokemon) => ({
          id: pokemon.id,
          name: pokemon.name.english,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
        }));

        const detailedPokemon = await Promise.all(detailedPokemonPromises);
        setPokemonData(detailedPokemon);
      } catch (err) {
        setError('Failed to load Pokémon data');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonData();
  }, []);

  const handleNavigateToDetails = (pokemonId) => {
    router.push(`/profile/${pokemonId}`); // Navigate to Pokémon details
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
          <TouchableOpacity
            style={[styles.item, isDarkMode && styles.darkItem]}
            onPress={() => handleNavigateToDetails(item.id)}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={[styles.itemText, isDarkMode && styles.darkItemText]}>{item.name}</Text>
          </TouchableOpacity>
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
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
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
