import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://192.168.0.141:8000/pokemon';


const fetchPokemonFromStorage = async () => {
  try {
    const storedPokemon = await AsyncStorage.getItem('pokemon_data');
    return storedPokemon ? JSON.parse(storedPokemon) : [];
  } catch (error) {
    console.error('Error fetching Pokémon data from storage:', error);
    throw error;
  }
};


const fetchAndStorePokemonData = async () => {
  try {
    const response = await axios.get(`${API_URL}?limit=50`);
    const pokemonData = response.data;

    await AsyncStorage.setItem('pokemon_data', JSON.stringify(pokemonData));

    return pokemonData;
  } catch (error) {
    console.error('Error fetching or storing Pokémon data:', error);
    throw error;
  }
};

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

export { fetchPokemonFromStorage, fetchAndStorePokemonData, deletePokemonFromStorage };
