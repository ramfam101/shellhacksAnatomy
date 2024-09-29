import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useQuizResult } from "../app/QuizContext"; // Import the custom hook for the context
import axios from 'axios'; // For making API requests

export default function VisualizationPage() {
  const { result } = useQuizResult(); // Access the result from the context
  const [correctAnswers, setCorrectAnswers] = useState<Record<string, string>>({}); // Store correct answers
  const [loading, setLoading] = useState<Record<string, boolean>>({}); // Track loading state for each incorrect question

  useEffect(() => {
    const fetchCorrectAnswers = async () => {
      const newCorrectAnswers: Record<string, string> = {};
      const newLoading: Record<string, boolean> = {};

      // Loop through the results and fetch the explanation for incorrect answers
      for (const res of result) {
        if (!res.correct) {
          newLoading[res.questionId] = true; // Start loading for this question

          try {
            const response = await axios.post(
              'https://api.openai.com/v1/chat/completions',
              {
                model: 'gpt-4', // Or 'gpt-3.5-turbo'
                messages: [
                  { role: 'system', content: 'You are a helpful assistant.' },
                  {
                    role: 'user',
                    content: `This is the correct answer ${res.correctanswer} for the question: ${res.questionw}, explain why the question matches up with the ${res.chapter}, keep it brief no  more than 4 sentence`,
                  }
                ],
                max_tokens: 150,
                temperature: 0.7
              },
              {
                headers: {
                  Authorization: `Bearer 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`, // Replace with your OpenAI API key
                  'Content-Type': 'application/json'
                }
              }
            );

            // Save the explanation for the incorrect answer
            newCorrectAnswers[res.questionId] = response.data.choices[0].message.content.trim();
          } catch (error) {
            console.error("Error fetching correct answer explanation:");
            newCorrectAnswers[res.questionId] = 'Error fetching explanation.';
          }

          newLoading[res.questionId] = false; // Stop loading for this question
        }
      }

      setCorrectAnswers(newCorrectAnswers);
      setLoading(newLoading);
    };

    if (result.length > 0) {
      fetchCorrectAnswers(); // Fetch correct answers if there are results
    }
  }, [result]);

  // Debugging: Check the state of correctAnswers


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Quiz Results</Text>
      {result.length > 0 ? (
        result.map((res, index) => (
          <View key={res.questionId} style={styles.resultContainer}>
            <Text style={styles.questionText}>
              {index + 1}. Question: {res.questionw}
            </Text>
            <Text style={res.correct ? styles.correctText : styles.incorrectText}>
              {res.correct ? "Correct" : "Incorrect"}
            </Text>

            {!res.correct && (
              <>
                {loading[res.questionId] ? (
                  <ActivityIndicator size="small" color="#0000ff" />
                ) : (
                  <Text style={styles.correctAnswerText}>
                    Correct Answer Explanation: {correctAnswers[res.questionId] || 'Explanation Loading...'}
                  </Text>
                )}
              </>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.noResultsText}>No results available yet.</Text>
      )}
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
  correctAnswerText: {
    marginTop: 10,
    fontSize: 14,
    color: "#007bff", 
  },
  noResultsText: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#000",
  },
});
