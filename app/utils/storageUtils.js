// app/utils/storageUtils.js

import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchPokemonFromStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const pokemonKeys = keys.filter(key => key.startsWith('pokemon_'));

    if (pokemonKeys.length === 0) {
      throw new Error('No Pokémon data found in storage');
    }

    const pokemonValues = await AsyncStorage.multiGet(pokemonKeys);

    const storedPokemon = pokemonValues.map(([key, value]) => {
      try {
        return JSON.parse(value);
      } catch (parseError) {
        console.error(`Failed to parse Pokémon data for key ${key}:`, parseError);
        return null;
      }
    }).filter(pokemon => pokemon !== null);

    if (storedPokemon.length === 0) {
      throw new Error('No valid Pokémon data found in storage');
    }

    return storedPokemon;
  } catch (error) {
    console.error('Error fetching Pokémon data from storage:', error);
    throw error;
  }
};
