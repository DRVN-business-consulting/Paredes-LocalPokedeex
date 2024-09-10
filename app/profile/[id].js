import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [showPrimary, setShowPrimary] = useState(true);
  const [showCombined, setShowCombined] = useState(false);

  const route = useRoute();
  const { id } = route.params || {};

  useEffect(() => {
    if (!id) {
      setError('No Pokémon ID provided');
      setLoading(false);
      return;
    }

    const fetchPokemonDetailsFromStorage = async () => {
      try {
        const storedPokemon = await AsyncStorage.getItem('pokemon_data');
        const parsedPokemon = storedPokemon ? JSON.parse(storedPokemon) : [];
        const pokemonDetails = parsedPokemon.find(pokemon => pokemon.id === parseInt(id, 10));

        if (pokemonDetails) {
          setPokemon(pokemonDetails);
        } else {
          setError('Pokémon not found');
        }
      } catch (err) {
        console.error('Error fetching Pokémon from storage:', err);
        setError('Failed to load Pokémon details from storage');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetailsFromStorage();
  }, [id]);

  const calculateGradient = (color1, color2) => {
    return [color1, color2];
  };

  const primaryType = pokemon?.type?.[0] || 'None';
  const primaryTypeColor = typeColors[primaryType] || typeColors.None;
  
  const secondaryType = pokemon?.type?.[1] || null;
  const secondaryTypeColor = secondaryType ? typeColors[secondaryType] : typeColors.None;

  const cardGradient = showCombined
    ? calculateGradient(primaryTypeColor, secondaryTypeColor)
    : [showPrimary ? primaryTypeColor : secondaryTypeColor, showPrimary ? primaryTypeColor : secondaryTypeColor];

  const buttonGradient = showCombined
    ? calculateGradient(primaryTypeColor, secondaryTypeColor)
    : [showPrimary ? secondaryTypeColor : primaryTypeColor, showPrimary ? secondaryTypeColor : primaryTypeColor];

  if (loading) {
    return <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} style={styles.loader} />;
  }

  if (error) {
    return <Text style={[styles.error, isDarkMode && styles.darkError]}>{error}</Text>;
  }

  if (!pokemon) {
    return <Text style={[styles.error, isDarkMode && styles.darkError]}>Pokémon not found</Text>;
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, isDarkMode && styles.darkContainer]}>
      <LinearGradient
        colors={cardGradient}
        style={[styles.card, isDarkMode && styles.darkCard]}
      >
        <View style={styles.headerContainer}>
          <Text style={[styles.pokemonId, isDarkMode && styles.darkPokemonId]}>
            Pokémon #{pokemon.id}
          </Text>
        </View>

        <Image
          source={{ uri: pokemon.image.hires }}
          style={styles.image}
        />
        <Text style={[styles.name, isDarkMode && styles.darkName]}>{pokemon.name?.english || 'Unknown'}</Text>

        {secondaryType && (
          <>
            <LinearGradient
              colors={buttonGradient}
              style={styles.gradientButton}
            >
              <TouchableOpacity style={styles.button} onPress={() => setShowPrimary(!showPrimary)}>
                <Text style={styles.toggleButtonText}>
                  {showPrimary ? `Primary Type: ${primaryType}` : `Secondary Type: ${secondaryType}`}
                </Text>
              </TouchableOpacity>
            </LinearGradient>

            <LinearGradient
              colors={buttonGradient}
              style={styles.gradientButton}
            >
              <TouchableOpacity style={styles.button} onPress={() => setShowCombined(!showCombined)}>
                <Text style={styles.toggleButtonText}>
                  {showCombined ? 'Show Individual Types' : 'Show Combined Type'}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </>
        )}

        <Text style={[styles.description, isDarkMode && styles.darkDescription]}>{pokemon.description || 'No description available'}</Text>
        <Text style={[styles.text, isDarkMode && styles.darkText]}>
          <Text style={styles.bold}>Species:</Text> {pokemon.species || 'Unknown'}
        </Text>
        <Text style={[styles.text, isDarkMode && styles.darkText]}>
          <Text style={styles.bold}>Base Stats:</Text>
        </Text>
        <View style={styles.statsContainer}>
          <Text style={[styles.text, isDarkMode && styles.darkText]}>
            HP: {pokemon.base?.HP || 'Unknown'}, Attack: {pokemon.base?.Attack || 'Unknown'}, Defense: {pokemon.base?.Defense || 'Unknown'}, 
            Sp. Attack: {pokemon.base?.['Sp. Attack'] || 'Unknown'}, Sp. Defense: {pokemon.base?.['Sp. Defense'] || 'Unknown'}, 
            Speed: {pokemon.base?.Speed || 'Unknown'}
          </Text>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  card: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  darkCard: {
    backgroundColor: '#444',
  },
  headerContainer: {
    alignItems: 'center',
  },
  pokemonId: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  darkPokemonId: {
    color: '#fff',
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginVertical: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  darkName: {
    color: '#fff',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  darkDescription: {
    color: '#fff',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  darkText: {
    color: '#fff',
  },
  bold: {
    fontWeight: 'bold',
  },
  statsContainer: {
    marginTop: 10,
  },
  gradientButton: {
    marginVertical: 10,
    borderRadius: 10,
  },
  button: {
    padding: 10,
    alignItems: 'center',
  },
  toggleButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  darkError: {
    color: '#ffcccc',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
});
