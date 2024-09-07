import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useTheme } from '../../src/theme/ThemeContext';
import { useRoute } from '@react-navigation/native';

// Define type colors
const typeColors = {
  Grass: '#78C850',
  Poison: '#A040A0',
  Fire: '#F08030',
  Water: '#6890F0',
  Bug: '#A8B820',
  Normal: '#A8A878',
  Electric: '#F8D030',
  Fairy: '#F0B6BC',
  Fighting: '#C03028',
  Flying: '#A890F0',
  Psychic: '#F85888',
  Rock: '#B8A038',
  Ghost: '#705898',
  Ice: '#98D8D8',
  Dragon: '#7038F8',
  Dark: '#705848',
  Steel: '#B8B8D0',
  None: '#FFFFFF', 
};

export default function ProfileScreen() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPrimary, setShowPrimary] = useState(true); // State to toggle between primary and secondary type

  const route = useRoute(); 
  const { id } = route.params || {};

  useEffect(() => {
    if (!id) {
      setError('No Pokémon ID provided');
      setLoading(false);
      return;
    }

    const fetchPokemonDetails = async () => {
      try {
        const response = await axios.get(`http://192.168.100.6:8000/pokemon/${id}`);
        setPokemon(response.data);
      } catch (err) {
        setError('Failed to load Pokémon details');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} style={styles.loader} />;
  }

  if (error) {
    return <Text style={[styles.error, isDarkMode && styles.darkError]}>{error}</Text>;
  }

  if (!pokemon) {
    return <Text style={[styles.error, isDarkMode && styles.darkError]}>Pokémon not found</Text>;
  }

  // Determine the type colors for primary and secondary (if exists)
  const primaryType = pokemon.type[0]; // Get primary type name
  const primaryTypeColor = typeColors[primaryType] || typeColors.None;
  
  const secondaryType = pokemon.type[1] ? pokemon.type[1] : null; // Get secondary type name (if exists)
  const secondaryTypeColor = secondaryType ? typeColors[secondaryType] : typeColors.None;

  // Determine the card background color based on the user's choice (primary or secondary type)
  const cardColor = showPrimary ? primaryTypeColor : secondaryTypeColor || primaryTypeColor;

  // Determine the button color, it should be the opposite type's color
  const buttonColor = showPrimary ? secondaryTypeColor : primaryTypeColor;

  return (
    <ScrollView contentContainerStyle={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={[styles.card, isDarkMode && styles.darkCard, { backgroundColor: cardColor }]}>
        <Text style={[styles.pokemonId, isDarkMode && styles.darkPokemonId]}>Pokémon #{pokemon.id}</Text>
        
        <Image
          source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png` }}
          style={styles.image}
        />
        <Text style={[styles.name, isDarkMode && styles.darkName]}>{pokemon.name.english}</Text>

        {/* Toggle between primary and secondary type */}
        {secondaryType && (
          <TouchableOpacity style={[styles.toggleButton, { backgroundColor: buttonColor }]} onPress={() => setShowPrimary(!showPrimary)}>
            <Text style={styles.toggleButtonText}>
              {showPrimary ? `Primary Type: ${primaryType}` : `Secondary Type: ${secondaryType}`}
            </Text>
          </TouchableOpacity>
        )}

        <Text style={[styles.description, isDarkMode && styles.darkDescription]}>{pokemon.description}</Text>
        <Text style={[styles.text, isDarkMode && styles.darkText]}>
          <Text style={styles.bold}>Species:</Text> {pokemon.species}
        </Text>
        <Text style={[styles.text, isDarkMode && styles.darkText]}>
          <Text style={styles.bold}>Base Stats:</Text>
        </Text>
        <View style={styles.statsContainer}>
          <Text style={[styles.text, isDarkMode && styles.darkText]}>
            HP: {pokemon.base.HP}, Attack: {pokemon.base.Attack}, Defense: {pokemon.base.Defense}, 
            Sp. Attack: {pokemon.base['Sp. Attack']}, Sp. Defense: {pokemon.base['Sp. Defense']}, 
            Speed: {pokemon.base.Speed}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  card: {
    borderRadius: 10,
    padding: 16,
    margin: 16,
    elevation: 5, // for shadow android
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    alignItems: 'center',
  },
  darkCard: {
    shadowColor: '#222', 
  },
  pokemonId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 4,
  },
  darkPokemonId: {
    color: 'white',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  darkName: {
    color: '#fff',
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  darkDescription: {
    color: '#fff',
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  darkText: {
    color: '#fff',
  },
  bold: {
    fontWeight: 'bold',
  },
  statsContainer: {
    marginTop: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  darkError: {
    color: '#f88',
  },
  toggleButton: {
    marginVertical: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  toggleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
