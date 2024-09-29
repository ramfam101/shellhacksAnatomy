import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, Pressable} from 'react-native';
import * as Progress from 'react-native-progress';
import { useProgress } from './ProgressContext'; // Import the custom context hook
import axios from "axios";

const API_BASE_URL = 'http://131.94.186.10:5001';
const TIMEOUT_DURATION = 120000000; // 2 minutes


export default function SubtopicScreen() {
  // Get the 'chapter' and 'subtopic' from the local search params
  const params = useLocalSearchParams();
  const chapter = params.chapter as string; // Ensure chapter is a string
  const subtopic = params.subtopic as string; // Ensure subtopic is a string

  // Use the chapterProgress from the context
  const { chapterProgress } = useProgress();

  // State variables for summary
  const [summary, setSummary] = useState<string>('');
  const [loadingSummary, setLoadingSummary] = useState<boolean>(false);
  const [errorSummary, setErrorSummary] = useState<string | null>(null);

  // Function to fetch the summary from the backend
  const fetchSummary = async () => {
    try {
      setLoadingSummary(true);
      setErrorSummary(null);

      const response = await axios.post(
        `${API_BASE_URL}/get_summary`,
        { subtopic: subtopic }, // Correct key based on backend expectations
        { timeout: TIMEOUT_DURATION }
      );

      if (response.status === 200) {
        const data = response.data;
        if (data.summary) {
          setSummary(data.summary);
        } else {
          throw new Error('Summary not found in the response.');
        }
      } else {
        throw new Error('Failed to fetch summary.');
      }
    } catch (error: any) {
      console.error('Error fetching summary:', error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'An unexpected error occurred while fetching the summary.';
      setErrorSummary(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoadingSummary(false);
    }
  };

  // Fetch the summary when the component mounts or when 'subtopic' changes
  useEffect(() => {
    if (subtopic) {
      fetchSummary();
    } else {
      setErrorSummary('Subtopic is missing.');
      Alert.alert('Error', 'Subtopic is missing.');
    }
  }, [subtopic]);


  
  return (
    <ScrollView style={styles.container}>
      {/* Dynamically set the page title */}
      <Text style={styles.title}>{subtopic}</Text>

      {/* Display progress bar for the current chapter */}
      {chapterProgress[chapter] !== undefined ? (
        <>
          <Text style={styles.progressText}>
            Chapter Progress: {Math.round(chapterProgress[chapter])}% done
          </Text>
          <Progress.Bar
            progress={chapterProgress[chapter]}
            width={null}
            color="#FFFFFF"
            unfilledColor="rgba(255, 255, 255, 0.3)"
            borderWidth={1}
            style={styles.progressBar}
          />
        </>
      ) : (
        <Text style={styles.errorText}>Invalid chapter selected.</Text>
      )}

      {/* Display any content related to the subtopic */}
      <Text style={styles.title}>A Dive into {subtopic}.</Text>
    {/* Handle Loading State */}
    {loadingSummary && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Fetching summary...</Text>
        </View>
      )}

      {/* Handle Error State */}
      {errorSummary && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorSummary}</Text>
          <Pressable style={styles.retryButton} onPress={fetchSummary}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      )}

      {/* Handle Success State: Display Summary */}
      {!loadingSummary && !errorSummary && summary ? (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Summary</Text>
          <Text style={styles.summaryText}>{summary}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1E1E1E', // Dark background for better contrast
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  progressText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 10,
  },
  progressBar: {
    width: '100%',
    height: 10,
    marginTop: 5,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 10,
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FF6347',
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  summaryContainer: {
    marginTop: 20,
    backgroundColor: '#2E2E2E',
    padding: 15,
    borderRadius: 8,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 16,
    color: '#DDDDDD',
    lineHeight: 22,
  },
});