import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchPokemonFromStorage } from '../utils/storageUtils';

const PokemonContext = createContext();

export const PokemonProvider = ({ children }) => {
  const [pokemonData, setPokemonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPokemonData = async () => {
      try {
        const storedPokemon = await fetchPokemonFromStorage();
        setPokemonData(storedPokemon);
      } catch (err) {
        console.error('Failed to load Pokémon data from storage:', err);
        setError('Failed to load Pokémon data from storage');
      } finally {
        setLoading(false);
      }
    };

    loadPokemonData();
  }, []);

  return (
    <PokemonContext.Provider value={{ pokemonData, setPokemonData, loading, error }}>
      {children}
    </PokemonContext.Provider>
  );
};

export const usePokemon = () => useContext(PokemonContext);
