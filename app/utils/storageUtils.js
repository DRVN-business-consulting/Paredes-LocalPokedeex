// app/utils/storageUtils.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://192.168.0.141:8000/pokemon';

// Function to fetch new data from the API and store it in AsyncStorage
const fetchAndStorePokemonData = async () => {
  try {
    const response = await axios.get(`${API_URL}?limit=50`);
    const newPokemonData = response.data;

    await AsyncStorage.removeItem('pokemon_data');
    await AsyncStorage.setItem('pokemon_data', JSON.stringify(newPokemonData));

    return newPokemonData;
  } catch (error) {
    console.error('Error fetching or storing Pokémon data:', error);
    throw error;
  }
};

// Function to fetch Pokémon data from AsyncStorage
const fetchPokemonFromStorage = async () => {
  try {
    const storedPokemon = await AsyncStorage.getItem('pokemon_data');
    return storedPokemon ? JSON.parse(storedPokemon) : [];
  } catch (error) {
    console.error('Error fetching Pokémon data from storage:', error);
    throw error;
  }
};

// Function to delete a specific Pokémon from AsyncStorage
const deletePokemonFromStorage = async (pokemonId) => {
  try {
    const storedPokemon = await fetchPokemonFromStorage();
    const updatedData = storedPokemon.filter(pokemon => pokemon.id !== pokemonId);

    await AsyncStorage.setItem('pokemon_data', JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error deleting Pokémon from storage:', error);
    throw error;
  }
};

// Function to update a specific Pokémon's data in AsyncStorage
const updatePokemonInStorage = async (updatedPokemon) => {
  try {
    const storedPokemon = await fetchPokemonFromStorage();
    const updatedData = storedPokemon.map(p =>
      p.id === updatedPokemon.id ? { ...p, name: updatedPokemon.name } : p
    );

    await AsyncStorage.setItem('pokemon_data', JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error updating Pokémon data in storage:', error);
    throw error;
  }
};

export { fetchPokemonFromStorage, fetchAndStorePokemonData, deletePokemonFromStorage, updatePokemonInStorage };
