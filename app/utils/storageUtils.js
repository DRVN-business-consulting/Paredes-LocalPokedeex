// utils/storageUtils.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://192.168.0.141:8000/pokemon';

// Fetch new Pokémon data from the API and replace existing data in AsyncStorage
const fetchAndStorePokemonData = async () => {
  try {
    // Fetch new data from the API
    const response = await axios.get(`${API_URL}?limit=50`);
    const newPokemonData = response.data;
    console.log('New Pokémon Data:', newPokemonData);

    // Clear existing data from AsyncStorage
    await AsyncStorage.removeItem('pokemon_data');
    console.log('Existing Pokémon Data Cleared from Storage');

    // Store the new data in AsyncStorage
    await AsyncStorage.setItem('pokemon_data', JSON.stringify(newPokemonData));
    console.log('New Pokémon Data Stored Successfully');

    return newPokemonData;
  } catch (error) {
    console.error('Error fetching or storing Pokémon data:', error);
    throw error;
  }
};

// Fetch existing Pokémon data from AsyncStorage
const fetchPokemonFromStorage = async () => {
  try {
    const storedPokemon = await AsyncStorage.getItem('pokemon_data');
    console.log('Fetched Pokémon Data from Storage:', storedPokemon);
    return storedPokemon ? JSON.parse(storedPokemon) : [];
  } catch (error) {
    console.error('Error fetching Pokémon data from storage:', error);
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

export { fetchPokemonFromStorage, fetchAndStorePokemonData, deletePokemonFromStorage };
