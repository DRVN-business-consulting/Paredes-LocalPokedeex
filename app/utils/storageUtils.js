// app/utils/storageUtils.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://192.168.100.6:8000/pokemon';

// Function to fetch Pokémon data from API and store in AsyncStorage
const fetchAndStorePokemonData = async () => {
  try {
    const response = await axios.get(`${API_URL}?limit=50`);
    const pokemonData = response.data;

    // Save each Pokémon item in AsyncStorage with a unique key
    await Promise.all(pokemonData.map(pokemon => {
      // Add the image URL to the Pokémon data
      const pokemonWithImage = {
        ...pokemon,
        image: {
          ...pokemon.image,
          localImage: pokemon.image.hires // or another appropriate image URL
        }
      };

      return AsyncStorage.setItem(`pokemon_${pokemon.id}`, JSON.stringify(pokemonWithImage));
    }));

    return pokemonData;
  } catch (error) {
    console.error('Error fetching or storing Pokémon data:', error);
    throw error;
  }
};

// Function to always fetch Pokémon data from API and store in AsyncStorage
const fetchPokemonFromStorage = async () => {
  try {
    // Fetch data from API and store it in AsyncStorage
    return await fetchAndStorePokemonData();
  } catch (error) {
    console.error('Error fetching Pokémon data:', error);
    throw error;
  }
};

export { fetchPokemonFromStorage };
