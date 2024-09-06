import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function App() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Hardcoded credentials
  const validUsername = 'User';
  const validPassword = '123';

  const handleLogin = () => {
    if (username === validUsername && password === validPassword) {
      // Navigate to the (tabs) screen on successful login
      router.push('/(tabs)');
    } else {
      setError('Incorrect username or password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      {/* Input for Username */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      
      {/* Input for Password */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      {/* Error Message */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Login Button */}
      <Button title="Login" onPress={handleLogin} />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
});
