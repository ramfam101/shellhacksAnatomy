import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import * as Progress from 'react-native-progress';
import { useProgress } from './ProgressContext'; // Import the custom context hook

export default function SubtopicScreen() {
  // Get the 'chapter' and 'subtopic' from the local search params
  const params = useLocalSearchParams();
  const chapter = params.chapter as string;  // Ensure chapter is a string
  const subtopic = params.subtopic as string;  // Ensure subtopic is a string

  // Use the chapterProgress from the context
  const { chapterProgress } = useProgress();

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
      <Text style={styles.content}>This is the content for {subtopic}.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    fontSize: 16,
    marginTop: 10,
    color: 'white',
  },
  progressText: {
    fontSize: 16,
    color: 'white',
    marginTop: 10,
  },
  progressBar: {
    width: '90%',
    height: 10,
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});
