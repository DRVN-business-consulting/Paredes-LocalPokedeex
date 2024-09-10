import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://192.168.0.141:8000/pokemon';

// Fetch Pokémon data from AsyncStorage only
const fetchPokemonFromStorage = async () => {
  try {
    const storedPokemon = await AsyncStorage.getItem('pokemon_data');
    return storedPokemon ? JSON.parse(storedPokemon) : [];
  } catch (error) {
    console.error('Error fetching Pokémon data from storage:', error);
    throw error;
  }
};

// Fetch Pokémon data from API and store it in AsyncStorage
const fetchAndStorePokemonData = async () => {
  try {
    const response = await axios.get(`${API_URL}?limit=50`);
    const pokemonData = response.data;

    // Store the data in AsyncStorage
    await AsyncStorage.setItem('pokemon_data', JSON.stringify(pokemonData));

    return pokemonData;
  } catch (error) {
    console.error('Error fetching or storing Pokémon data:', error);
    throw error;
  }
};

// Delete Pokémon from AsyncStorage
const deletePokemonFromStorage = async (pokemonId) => {
  try {
    const storedPokemon = await fetchPokemonFromStorage();
    const updatedData = storedPokemon.filter(pokemon => pokemon.id !== pokemonId);

    // Update AsyncStorage with the new data
    await AsyncStorage.setItem('pokemon_data', JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error deleting Pokémon from storage:', error);
    throw error;
  }
};

export { fetchPokemonFromStorage, fetchAndStorePokemonData, deletePokemonFromStorage };
