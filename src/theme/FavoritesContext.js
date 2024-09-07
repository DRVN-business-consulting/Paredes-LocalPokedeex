import React, { createContext, useState, useContext } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (pokemon) => {
    if (!favorites.some((fav) => fav.id === pokemon.id)) {
      setFavorites([...favorites, pokemon]);
    }
  };

  const removeFavorite = (pokemonId) => {
    setFavorites(favorites.filter((fav) => fav.id !== pokemonId));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
