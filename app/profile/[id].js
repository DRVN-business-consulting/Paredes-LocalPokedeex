// app/profile/[id].js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';
import { useRouter, useSearchParams } from 'expo-router';

export default function PokemonProfile() {
  const { id } = useSearchParams(); // Use useSearchParams to get query parameters
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      return; // If id is not available, don't make API call
    }

    const fetchPokemonDetails = async () => {
      try {
        setLoading(true); // Set loading true before fetching
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        setPokemonDetails(response.data);
      } catch (err) {
        console.error('Error fetching Pokémon details:', err); // Debugging
        setError('Failed to load Pokémon details');
      } finally {
        setLoading(false); // Set loading false after fetching
      }
    };

    fetchPokemonDetails();
  }, [id]);

  // Debugging output
  console.log('Fetching details for Pokémon with ID:', id);

  if (!id) {
    return <Text>No Pokémon ID provided</Text>; // Handle the case where id is not available
  }

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  if (!pokemonDetails) {
    return <Text>No details available</Text>; // Handle case when no details are available
  }

  return (
    <View style={styles.container}>
      {pokemonDetails && (
        <>
          <Text style={styles.title}>{pokemonDetails.name}</Text>
          <Image source={{ uri: pokemonDetails.sprites.front_default }} style={styles.image} />
          <Text style={styles.description}>
            {pokemonDetails.species.flavor_text_entries[0]?.flavor_text || 'No description available'}
          </Text>
        </>
      )}
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
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  error: {
    color: 'red',
  },
});
