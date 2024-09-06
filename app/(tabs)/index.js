// app/(tabs)/index.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';


export default function PokemonScreen() {
  const router = useRouter();
  const [pokemonData, setPokemonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=20');
        const pokemonList = response.data.results;

        // Fetch additional details for each Pokémon to get the image URL and ID
        const detailedPokemonPromises = pokemonList.map(async (pokemon) => {
          const pokemonDetails = await axios.get(pokemon.url);
          return {
            ...pokemon,
            image: pokemonDetails.data.sprites.front_default,
            id: pokemonDetails.data.id // Extract Pokémon ID
          };
        });

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
    router.push(`/profile/${pokemonId}`); // Navigate to the profile page with the Pokémon ID
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokémon List</Text>
      <FlatList
        data={pokemonData}
        keyExtractor={(item) => item.id.toString()} // Use ID as the key
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handleNavigateToDetails(item.id)}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.image} />
            ) : (
              <Text>No Image</Text>
            )}
            <Text>{item.name}</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginRight: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  error: {
    color: 'red',
  },
});
