import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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

    const fetchPokemonDetails = async () => {
      try {
        const response = await axios.get(`http://192.168.100.6:8000/pokemon/${id}`);
        

        if (Array.isArray(response.data) && response.data.length > 0) {
          setPokemon(response.data[0]);
        } else {
          setError('Pokémon not found');
        }
      } catch (err) {
        console.error('Error fetching Pokémon details:', err);
        setError('Failed to load Pokémon details');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetails();
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
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  card: {
    borderRadius: 10,
    padding: 16,
    margin: 16,
    maxWidth: 700,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  darkCard: {
    shadowColor: '#222',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
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
    width: 150,
    height: 150,
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  darkName: {
    color: '#fff',
  },
  gradientButton: {
    borderRadius: 5,
    marginVertical: 8,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
  },
  darkDescription: {
    color: '#ddd',
  },
  text: {
    fontSize: 16,
  },
  darkText: {
    color: '#ccc',
  },
  bold: {
    fontWeight: 'bold',
  },
  statsContainer: {
    marginVertical: 8,
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  darkError: {
    color: '#f08080',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
