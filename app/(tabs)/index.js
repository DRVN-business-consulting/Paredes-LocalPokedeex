// app/(tabs)/index.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { useFavorites } from '../../src/theme/FavoritesContext';
import { fetchPokemonFromStorage, deletePokemonFromStorage, clearPokemonStorage, fetchAndStorePokemonData, updatePokemonInStorage } from '../utils/storageUtils';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const router = useRouter();
  const { theme } = useTheme();
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const isDarkMode = theme === 'dark';
  const [pokemonData, setPokemonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPokemon, setEditingPokemon] = useState(null);
  const [editName, setEditName] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [newPokemonName, setNewPokemonName] = useState('');
  const [newPokemonType, setNewPokemonType] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedPokemon = await fetchPokemonFromStorage();
        const updatedPokemon = storedPokemon.map(pokemon => ({
          ...pokemon,
          isFavorite: favorites.some(fav => fav.id === pokemon.id),
        }));
        setPokemonData(updatedPokemon);
      } catch (err) {
        console.error('Failed to load Pokémon data:', err);
        setError('Failed to load Pokémon data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [favorites]);

  const handleFetchNewData = async () => {
    try {
      setLoading(true);

      const storedPokemon = await fetchPokemonFromStorage();
      const manuallyCreatedPokemon = storedPokemon.filter(pokemon => pokemon.id > 1000); // Keep custom Pokémon

      await clearPokemonStorage(); // Clear existing data
      const newFetchedPokemon = await fetchAndStorePokemonData(); // Fetch new Pokémon data

      const mergedPokemonData = [...newFetchedPokemon, ...manuallyCreatedPokemon]; // Merge custom and fetched Pokémon
      await AsyncStorage.setItem('pokemon_data', JSON.stringify(mergedPokemonData)); // Save merged data

      const updatedPokemon = mergedPokemonData.map(pokemon => ({
        ...pokemon,
        isFavorite: favorites.some(fav => fav.id === pokemon.id),
      }));
      setPokemonData(updatedPokemon);
    } catch (err) {
      console.error('Failed to fetch and store new Pokémon data:', err);
      setError('Failed to fetch and store new Pokémon data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (pokemon) => {
    try {
      if (pokemon.isFavorite) {
        await removeFavorite(pokemon.id);
      } else {
        await addFavorite(pokemon);
      }

      setPokemonData(prevData =>
        prevData.map(p =>
          p.id === pokemon.id ? { ...p, isFavorite: !p.isFavorite } : p
        )
      );
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const handleDeletePokemon = async (pokemonId) => {
    try {
      await deletePokemonFromStorage(pokemonId);
      setPokemonData(prevData => prevData.filter(pokemon => pokemon.id !== pokemonId));
      await removeFavorite(pokemonId);
    } catch (err) {
      console.error('Failed to delete Pokémon from storage:', err);
    }
  };

  const handleEditPokemon = async () => {
    if (!editingPokemon || !editName.trim()) return;

    try {
      const updatedPokemon = { ...editingPokemon, name: { ...editingPokemon.name, english: editName } };
      await updatePokemonInStorage(updatedPokemon);
      setPokemonData(prevData =>
        prevData.map(pokemon =>
          pokemon.id === updatedPokemon.id ? updatedPokemon : pokemon
        )
      );
      setModalVisible(false);
      setEditingPokemon(null);
      setEditName('');
    } catch (err) {
      console.error('Failed to edit Pokémon name:', err);
    }
  };

  const handleCreatePokemon = async () => {
    if (!newPokemonName.trim() || !newPokemonType.trim()) return;

    try {
      const newPokemon = {
        id: pokemonData.length + 1001, // New ID for custom Pokémon
        name: { english: newPokemonName },
        type: [newPokemonType],
        image: {
          hires: 'https://via.placeholder.com/80',
        },
      };

      const updatedPokemonData = [...pokemonData, newPokemon]; // Add new Pokémon to the list
      await AsyncStorage.setItem('pokemon_data', JSON.stringify(updatedPokemonData));
      setPokemonData(updatedPokemonData);

      setNewPokemonName('');
      setNewPokemonType('');
      setCreateModalVisible(false);
    } catch (err) {
      console.error('Failed to create new Pokémon:', err);
    }
  };

  const handleNavigateToDetails = (pokemonId) => {
    router.push(`/profile/${pokemonId}`); // Navigate to the profile screen with the Pokémon ID
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {loading ? (
        <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} />
      ) : (
        <>
          <TouchableOpacity style={styles.modalButton} onPress={() => setCreateModalVisible(true)}>
            <Text style={styles.createText}>Create Pokémon</Text>
          </TouchableOpacity>
          <Button title="Fetch New Data" onPress={handleFetchNewData} />
          <FlatList
            data={pokemonData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={[styles.cardContainer, isDarkMode && styles.darkCardContainer]}>
                <TouchableOpacity
                  style={styles.cardContent}
                  onPress={() => handleNavigateToDetails(item.id)} // Navigate to Pokémon details
                >
                  <Image source={{ uri: item.image.hires }} style={styles.image} />
                  <View style={styles.textContainer}>
                    <Text style={[styles.pokemonName, isDarkMode && styles.darkPokemonName]}>
                      {item.name.english || 'Unknown'} #{item.id}
                    </Text>
                    <View style={styles.iconContainer}>
                      <TouchableOpacity onPress={() => handleToggleFavorite(item)} style={styles.favoriteButton}>
                        <Icon name={item.isFavorite ? 'heart' : 'heart-outline'} size={24} color={item.isFavorite ? 'red' : isDarkMode ? '#fff' : '#000'} />
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => handleDeletePokemon(item.id)} style={styles.deleteButton}>
                        <Icon name="delete-outline" size={24} color={isDarkMode ? '#fff' : '#000'} />
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => { setEditingPokemon(item); setEditName(item.name.english); setModalVisible(true); }} style={styles.editButton}>
                        <Icon name="pencil-outline" size={24} color={isDarkMode ? '#fff' : '#000'} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />

          <Modal visible={isCreateModalVisible} transparent={true} animationType="slide" onRequestClose={() => setCreateModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Create New Pokémon</Text>
                <TextInput style={styles.textInput} value={newPokemonName} onChangeText={setNewPokemonName} placeholder="Enter Pokémon Name" />
                <TextInput style={styles.textInput} value={newPokemonType} onChangeText={setNewPokemonType} placeholder="Enter Pokémon Type" />
                <Button title="Create" onPress={handleCreatePokemon} />
                <Button title="Cancel" onPress={() => setCreateModalVisible(false)} />
              </View>
            </View>
          </Modal>

          <Modal visible={isModalVisible} transparent={true} animationType="slide" onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Pokémon Name</Text>
                <TextInput style={styles.textInput} value={editName} onChangeText={setEditName} placeholder="Enter new name" />
                <Button title="Save Changes" onPress={handleEditPokemon} />
                <Button title="Cancel" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 10,
    overflow: 'hidden',
  },
  darkCardContainer: {
    backgroundColor: '#444',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  darkPokemonName: {
    color: '#fff',
  },
  favoriteButton: {
    padding: 5,
  },
  deleteButton: {
    padding: 5,
  },
  editButton: {
    padding: 5,
    marginLeft: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  error: {
    textAlign: 'center',
    color: 'red',
    fontSize: 16,
  },
  darkError: {
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
