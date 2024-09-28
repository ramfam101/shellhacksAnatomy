import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import * as Progress from 'react-native-progress'; // Import progress bar component
import { useProgress } from '../app/ProgressContext'; // Import the custom context hook

export default function Header() {
  // Get the overall progress from the context
  const { overallProgress } = useProgress(); // Assuming overallProgress is calculated in the context

  return (
    <View style={styles.headerContainer}>
      {/* Label for the progress bar */}
      <Text style={styles.headerTitle}>Overall Progress</Text>
      
      {/* Short description */}
      <Text style={styles.headerDescription}>
        {Math.round(overallProgress * 100)}% done
      </Text>

      {/* Progress Bar */}
      <Progress.Bar 
        progress={overallProgress} 
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
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 30 : 10,
    paddingBottom: 5,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
    paddingTop: 15,
  },
  headerDescription: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 4,
  },
  progressBar: {
    width: '90%',
    height: 10,
  },
});
