import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'favorites';
const API_URL = 'http://192.168.100.6:8000/pokemon';

// Function to fetch all favorites
export const getFavorites = async () => {
  try {
    const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
    if (storedFavorites) {
      return JSON.parse(storedFavorites);
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch favorites:', error);
    return [];
  }
};

// Function to fetch Pokémon details including image from API
const fetchPokemonDetails = async (pokemonId) => {
  try {
    const response = await fetch(`${API_URL}/${pokemonId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch Pokémon details');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch Pokémon details:', error);
    return null;
  }
};

// Function to add a favorite Pokémon
export const addFavorite = async (pokemon) => {
  try {
    const existingFavorites = await getFavorites();
    
    // Fetch Pokémon details including image
    const pokemonDetails = await fetchPokemonDetails(pokemon.id);
    
    // If details are fetched successfully, include them in the favorite
    const pokemonWithImage = pokemonDetails ? {
      id: pokemon.id,
      name: pokemonDetails.name,
      localImage: pokemonDetails.image.hires, // Ensure this includes the `hires` URL
    } : {
      id: pokemon.id,
      name: pokemon.name,
      localImage: pokemon.image.hires,
    };
    
    const updatedFavorites = [...existingFavorites, pokemonWithImage];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return updatedFavorites;
  } catch (error) {
    console.error('Failed to add favorite:', error);
    return await getFavorites(); // Return the current favorites list if error occurs
  }
};

// Function to remove a favorite Pokémon
export const removeFavorite = async (pokemonId) => {
  try {
    const existingFavorites = await getFavorites();
    const updatedFavorites = existingFavorites.filter(pokemon => pokemon.id !== pokemonId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return updatedFavorites;
  } catch (error) {
    console.error('Failed to remove favorite:', error);
    return await getFavorites(); // Return the current favorites list if error occurs
  }
};
