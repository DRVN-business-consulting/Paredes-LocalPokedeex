import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'favorites';
const API_URL = 'http://192.168.0.141:8000/pokemon';

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

export const addFavorite = async (pokemon) => {
  try {
    const existingFavorites = await getFavorites();
    
    const pokemonDetails = await fetchPokemonDetails(pokemon.id);
    
    const pokemonWithImage = pokemonDetails ? {
      id: pokemon.id,
      name: pokemonDetails.name,
      localImage: pokemonDetails.image.hires, 
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
    return await getFavorites(); 
  }
};

export const removeFavorite = async (pokemonId) => {
  try {
    const existingFavorites = await getFavorites();
    const updatedFavorites = existingFavorites.filter(pokemon => pokemon.id !== pokemonId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return updatedFavorites;
  } catch (error) {
    console.error('Failed to remove favorite:', error);
    return await getFavorites(); 
  }
};
