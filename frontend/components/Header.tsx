import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, SafeAreaView } from 'react-native';
import * as Progress from 'react-native-progress'; // Import progress bar component

export default function Header() {
  // Example progress value (this could be passed as a prop or managed in a higher-level component)
  const [progress, setProgress] = useState(0.4); // 50% progress as an example

  return (
    
      <View style={styles.headerContainer}>
        {/* Label for the progress bar */}
        <Text style={styles.headerTitle}>Progress</Text>
        
        {/* Short description */}
        <Text style={styles.headerDescription}>
          {progress*100}% done
        </Text>

        {/* Progress Bar */}
        <Progress.Bar 
          progress={progress} 
          width={null} // Full width
          color="#FFFFFF" // White color for progress bar
          unfilledColor="rgba(255, 255, 255, 0.3)" // Semi-transparent unfilled color
          borderWidth={1} 
          style={styles.progressBar}
        />
      </View>
    
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'blue', // Safe area background color (same as header)
  },
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 30 : 10, // Reduce padding for the iPhone notch
    paddingBottom: 5, // Minimized padding below the progress bar
    backgroundColor: '#4CAF50', // Header background color
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,  // Reduced font size for compactness
    fontWeight: 'bold',
    marginBottom: 2, // Reduced space between title and description
    paddingTop: 15,
  },
  headerDescription: {
    color: '#fff',
    fontSize: 12,  // Smaller font size
    marginBottom: 4, // Reduced space between description and progress bar
  },
  progressBar: {
    width: '90%', // Progress bar width
    height: 10, // Reduced height of the progress bar
  },
});
