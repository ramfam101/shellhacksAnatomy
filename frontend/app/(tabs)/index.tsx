import React, { useState } from 'react';
import { StyleSheet, ScrollView, Pressable, Text, View } from 'react-native';

import Header from '@/components/Header'; // Import your header if needed


export default function HomeScreen() {
  // State to manage the selected gender (true for male, false for female)
  const [isMale, setIsMale] = useState(true);

  // Handle the custom switch toggle
  const handleToggleSwitch = () => {
    setIsMale((previousState) => !previousState);
  };

  // Dynamically change the image based on the isMale state
  const imageUrl = isMale
    ? 'https://example.com/male-image.jpg' // Replace with actual male image URL
    : 'https://example.com/female-image.jpg'; // Replace with actual female image URL

  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable
          style={[styles.switch, isMale ? styles.switchMale : styles.switchFemale]}
          onPress={handleToggleSwitch}
        >
          <Text style={styles.switchText}>{isMale ? 'Male' : 'Female'}</Text>
        </Pressable>

        <View style={styles.webviewContainer}>

        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  switch: {
    width: 150,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 5,
  },
  switchMale: {
    backgroundColor: "#3399FF",
  },
  switchFemale: {
    backgroundColor: '#FF4081', // Pink for Female
  },
  switchText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  webviewContainer: {
    width: '100%',
    height: 300,
    marginTop: 20,
    backgroundColor: '#f0f0f0',
  },
  webview: {
    flex: 1,
  },
});