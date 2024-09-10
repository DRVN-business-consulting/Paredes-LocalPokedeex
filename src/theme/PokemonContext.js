import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchPokemonFromStorage, fetchAndStorePokemonData } from '../utils/storageUtils';

const PokemonContext = createContext();

export const PokemonProvider = ({ children }) => {
  const [pokemonData, setPokemonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPokemonData = async () => {
      setLoading(true);
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

  // Function to refresh Pokémon data
  const refreshPokemonData = async () => {
    setLoading(true);
    try {
      const newData = await fetchAndStorePokemonData();
      setPokemonData(newData);
    } catch (err) {
      console.error('Failed to fetch Pokémon data from API:', err);
      setError('Failed to fetch Pokémon data from API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PokemonContext.Provider value={{ pokemonData, setPokemonData, loading, error, refreshPokemonData }}>
      {children}
    </PokemonContext.Provider>
  );
};

export const usePokemon = () => useContext(PokemonContext);
