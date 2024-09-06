import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';



export default function GroupList() {
  const [pokemonData, setPokemonData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100');
        const pokemonList = response.data.results;
        
        // Fetch additional details for each Pokémon to get the types and images
        const detailedPokemonPromises = pokemonList.map(async (pokemon) => {
          const pokemonDetails = await axios.get(pokemon.url);
          return {
            ...pokemon,
            types: pokemonDetails.data.types.map(typeInfo => typeInfo.type.name),
            image: pokemonDetails.data.sprites.front_default // Fetch Pokémon image
          };
        });

        const detailedPokemon = await Promise.all(detailedPokemonPromises);

        // Group Pokémon by type
        const groupedByType = detailedPokemon.reduce((acc, pokemon) => {
          pokemon.types.forEach(type => {
            if (!acc[type]) {
              acc[type] = [];
            }
            acc[type].push(pokemon);
          });
          return acc;
        }, {});

        setPokemonData(groupedByType);
      } catch (err) {
        setError('Failed to load Pokémon data');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={Object.keys(pokemonData)}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.group}>
            <Text style={styles.groupTitle}>{item.charAt(0).toUpperCase() + item.slice(1)}</Text>
            <FlatList
              data={pokemonData[item]}
              keyExtractor={(pokemon) => pokemon.name}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.item}>
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <Text>{item.name}</Text>
                </TouchableOpacity>
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
  group: {
    marginBottom: 16,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 50,
    height: 50,
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
