import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://192.168.0.141:8000/pokemon';

const fetchAndStorePokemonData = async () => {
  try {
    // Fetch new data from the API
    const response = await axios.get(`${API_URL}?limit=50`);
    const newPokemonData = response.data;
    console.log('New Pokémon Data:', newPokemonData);

    // Store new data
    await AsyncStorage.setItem('pokemon_data', JSON.stringify(newPokemonData));
    console.log('New Pokémon Data Stored Successfully');

    return newPokemonData;
  } catch (error) {
    console.error('Error fetching or storing Pokémon data:', error);
    throw error;
  }
};

const fetchPokemonFromStorage = async () => {
  try {
    const storedPokemon = await AsyncStorage.getItem('pokemon_data');
    return storedPokemon ? JSON.parse(storedPokemon) : [];
  } catch (error) {
    console.error('Error fetching Pokémon data from storage:', error);
    throw error;
  }
};

// Add this function to clear all Pokémon data from AsyncStorage
const clearPokemonStorage = async () => {
  try {
    await AsyncStorage.removeItem('pokemon_data');
    console.log('All Pokémon Data Cleared from Storage');
  } catch (error) {
    console.error('Error clearing Pokémon data from storage:', error);
    throw error;
  }
};

// Delete a specific Pokémon from AsyncStorage
const deletePokemonFromStorage = async (pokemonId) => {
  try {
    // Fetch existing data from storage
    const storedPokemon = await fetchPokemonFromStorage();
    console.log('Stored Pokémon Data Before Deletion:', storedPokemon);

    // Filter out the Pokémon to be deleted
    const updatedData = storedPokemon.filter(pokemon => pokemon.id !== pokemonId);

    // Store the updated data in AsyncStorage
    await AsyncStorage.setItem('pokemon_data', JSON.stringify(updatedData));
    console.log('Pokémon Data After Deletion:', updatedData);
  } catch (error) {
    console.error('Error deleting Pokémon from storage:', error);
    throw error;
  }
};

export { fetchPokemonFromStorage, fetchAndStorePokemonData, deletePokemonFromStorage, clearPokemonStorage };
