// app/utils/storageUtils.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://192.168.100.6:8000/pokemon';

const fetchAndStorePokemonData = async () => {
  try {
    const response = await axios.get(`${API_URL}?limit=50`);
    const pokemonData = response.data;

    await Promise.all(pokemonData.map(pokemon => {

      const pokemonWithImage = {
        ...pokemon,
        image: {
          ...pokemon.image,
          localImage: pokemon.image.hires 
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

const fetchPokemonFromStorage = async () => {
  try {
    return await fetchAndStorePokemonData();
  } catch (error) {
    console.error('Error fetching Pokémon data:', error);
    throw error;
  }
};

export { fetchPokemonFromStorage };
