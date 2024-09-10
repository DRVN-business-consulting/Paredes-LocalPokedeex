// app/(tabs)/EditPokemonModal.js
import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { updatePokemonInStorage } from '../utils/storageUtils';

export default function EditPokemonModal({ visible, onClose, pokemon, onSave }) {
  const [name, setName] = useState(pokemon.name.english);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const handleSave = async () => {
    try {
      await updatePokemonInStorage(pokemon.id, { ...pokemon, name: { ...pokemon.name, english: name } });
      onSave(); // Call onSave to refresh the data
      onClose(); // Close the modal
    } catch (error) {
      console.error('Failed to update Pokémon:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, isDarkMode && styles.darkModalContainer]}>
        <View style={styles.modalContent}>
          <Text style={[styles.modalTitle, isDarkMode && styles.darkModalTitle]}>Edit Pokémon</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={[styles.input, isDarkMode && styles.darkInput]}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={[styles.buttonText, isDarkMode && styles.darkButtonText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={[styles.buttonText, isDarkMode && styles.darkButtonText]}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  darkModalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  darkModalContent: {
    backgroundColor: '#333',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  darkModalTitle: {
    color: '#fff',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  darkInput: {
    backgroundColor: '#444',
    borderColor: '#666',
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  darkButtonText: {
    color: '#fff',
  },
});
