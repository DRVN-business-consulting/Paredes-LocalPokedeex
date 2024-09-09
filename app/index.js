import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import PikachuImage from '../assets/image.png'; 

// Caesar cipher encryption function
const caesarEncrypt = (text, shift) => {
  return text
    .split('')
    .map((char) => {
      // Only shift alphabetic characters
      if (char.match(/[a-z]/i)) {
        let code = char.charCodeAt(0);

        // Uppercase letters
        if (code >= 65 && code <= 90) {
          return String.fromCharCode(((code - 65 + shift) % 26) + 65);
        }
        // Lowercase letters
        else if (code >= 97 && code <= 122) {
          return String.fromCharCode(((code - 97 + shift) % 26) + 97);
        }
      }
      return char; // Return non-alphabetic characters as-is
    })
    .join('');
};

// Function to save encrypted password securely
async function saveEncryptedPassword(key, value) {
  await SecureStore.setItemAsync(key, value);
}

// Function to retrieve the stored encrypted password
async function getEncryptedPassword(key) {
  return await SecureStore.getItemAsync(key);
}

export default function App() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Hardcoded credentials (store the encrypted password instead of plain text)
  const validUsername = 'User';
  const validEncryptedPassword = caesarEncrypt('a', 3); // Encrypt the hardcoded password using Caesar cipher

  // Handle login
  const handleLogin = async () => {
    // Encrypt the input password with Caesar cipher
    const encryptedPassword = caesarEncrypt(password, 3);

    // Log the encrypted password to the console
    console.log('Encrypted Password:', encryptedPassword);

    // Save the encrypted password securely
    await saveEncryptedPassword('userPassword', encryptedPassword);

    // Verify username and password
    if (username === validUsername && encryptedPassword === validEncryptedPassword) {
      router.push('/(tabs)');
    } else {
      setError('Incorrect username or password');
    }
  };

  return (
    <ImageBackground
      source={PikachuImage} // refer to the imported local image
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Pokémon Login</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Trainer Name"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#fff"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#fff"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <StatusBar style="light" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    width: '80%',
  },
  title: {
    fontSize: 32,
    color: '#FFCC00', 
    fontWeight: 'bold',
    marginBottom: 24,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#FFCC00',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 18,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  button: {
    backgroundColor: '#FFCC00', // Pokémon yellow
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  buttonText: {
    color: '#000', // Black text for contrast
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
});
