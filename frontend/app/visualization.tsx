import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useQuizResult } from "../app/QuizContext"; // Import the custom hook for the context
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import navigation to go back
import { useVisited } from "./VisitedContext";
import { useRouter } from "expo-router";

export default function VisualizationPage() {
  const { result } = useQuizResult(); // Access the result from the context

  const navigation = useNavigation(); // Initialize navigation
  const { markQuizCompleted } = useVisited(); // Hook to mark quiz as completed

  const router = useRouter();
  const handleDonePress = () => {
    // Mark the quiz as done
    // markQuizCompleted(result); // Assuming you pass the chapter name in the result
    // Navigate back to the LearnScreen
    router.push({pathname: '/understand'});
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Quiz Results</Text>
      {result.length > 0 ? (
        result.map((res, index) => (
          <View key={res.questionId} style={styles.resultContainer}>
            <Text style={styles.questionText}>
              {index + 1}. Question ID: {res.questionId}
            </Text>
            <Text style={styles.questionText}>
                {res.questionw}
            </Text>
            <Text style={res.correct ? styles.correctText : styles.incorrectText}>
              {res.correct ? "Correct" : "Incorrect"}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.noResultsText}>No results available.</Text>
      )}

        <Pressable style={styles.doneButton} onPress={handleDonePress}>
            <Text style={styles.doneButtonText}>Done</Text>
        </Pressable>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
    container: {
      padding: 20,
      paddingBottom: 40,
      backgroundColor: "#f5f5f5",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
    },
    resultContainer: {
      marginBottom: 25,
      backgroundColor: "#fff",
      padding: 15,
      borderRadius: 8,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    questionText: {
      fontSize: 16,
      marginBottom: 10,
      fontWeight: "600",
    },
    correctText: {
      fontSize: 14,
      color: "#28a745", // Green for correct answers
      fontWeight: "bold",
    },
    incorrectText: {
      fontSize: 14,
      color: "#dc3545", // Red for incorrect answers
      fontWeight: "bold",
    },
    noResultsText: {
      fontSize: 18,
      color: "#555",
      textAlign: "center",
    },
    doneButton: {
      marginTop: 20,
      padding: 15,
      backgroundColor: "#3399FF",
      borderRadius: 8,
      alignItems: "center",
    },
    doneButtonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
  });
