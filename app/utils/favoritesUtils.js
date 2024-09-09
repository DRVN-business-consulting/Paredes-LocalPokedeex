// app/utils/favoritesUtils.js

import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'favorites';

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

export const addFavorite = async (pokemon) => {
  try {
    const existingFavorites = await getFavorites();
    const updatedFavorites = [...existingFavorites, pokemon];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return updatedFavorites;
  } catch (error) {
    console.error('Failed to add favorite:', error);
    return existingFavorites;
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
    return existingFavorites;
  }
};
