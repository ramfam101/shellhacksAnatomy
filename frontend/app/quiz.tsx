import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  TouchableOpacity,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native"; // Import useNavigation

// Define the types for the quiz data
interface AnswerOption {
  id: string;
  text: string;
}

interface Question {
  id: string;
  question: string;
  options: AnswerOption[];
  correct: string;
}

interface QuizData {
  chapter: string;
  questions: Question[];
}

// Predefined dummy quiz data
import quizData from "../assets/quiz.json";
import { useRouter } from "expo-router";
import { useQuizResult } from "./QuizContext";


// Define the type for navigation parameters if using React Navigation
type QuizPageRouteProp = RouteProp<{ params: { chapter: string } }, "params">;

export default function QuizPage() {
  const route = useRoute<QuizPageRouteProp>();
  const { chapter } = route.params;
  const navigation = useNavigation(); // Initialize useNavigation
  const router = useRouter();
  const {setResult} = useQuizResult();
  // Initialize state
  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [isSubmitEnabled, setIsSubmitEnabled] = useState<boolean>(false);

  useEffect(() => {
    // Find quiz data based on the chapter
    const selectedQuiz = quizData.find((quiz) => quiz.chapter === chapter);
    if (selectedQuiz) {
      setCurrentQuiz(selectedQuiz);
    } else {
      Alert.alert("Error", "Quiz data for the selected chapter is not available.");
    }
  }, [chapter]);

  useEffect(() => {
    // Enable submit button only if all questions have been answered
    if (currentQuiz) {
      const allAnswered =
        Object.keys(answers).length === currentQuiz.questions.length &&
        currentQuiz.questions.every((q) => answers[q.id]);
      setIsSubmitEnabled(allAnswered);
    }
  }, [answers, currentQuiz]);

  const handleOptionSelect = (questionId: string, optionId: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = () => {
    // Initialize an array to hold the result for each question
    const result: { questionId: string; questionw: string; correct: boolean }[] = [];
    let incorrectCount = 0;
  
    // Iterate over the questions to check correctness and count incorrect answers
    let resultText = "Your Results:\n\n";
    currentQuiz?.questions.forEach((question) => {
      const selectedOptionId = answers[question.id]; // User's selected answer
      const isCorrect = selectedOptionId === question.correct; // Check if it's correct
      result.push({ questionId: question.id, questionw: question.question, correct: isCorrect }); // Store result
  
      if (!isCorrect) {
        incorrectCount++; // Count incorrect answers
      }
  
      const selectedOption = question.options.find(
        (opt) => opt.id === selectedOptionId
      );
      resultText += `${question.question}\nYour Answer: ${
        selectedOption ? selectedOption.text : "Not Answered"
      } - ${isCorrect ? "Correct" : "Incorrect"}\n\n`;
    });
  setResult(result);
    // If the user gets more than 2 questions wrong, navigate to '/visualization' and pass the result
    if (incorrectCount > 2) {
      // Pass the result as a parameter
      router.push({
        pathname: '/visualization', // Dynamic route outside of the tabs directory
        // Pass chapter and subtopic
      });
    } else {
      // Display the quiz results as an alert if there are 2 or fewer incorrect answers
      Alert.alert("Quiz Submitted", resultText, [
        { text: "OK", onPress: () => navigation.goBack() }, // Go back to the previous page
      ]);
    }
  
    console.log(result); // You can use this result array elsewhere in the app if needed
  };
  
  

  if (!currentQuiz) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Quiz...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.chapterTitle}>{chapter} Quiz</Text>
      {currentQuiz.questions.map((question, index) => (
        <View key={question.id} style={styles.questionContainer}>
          <Text style={styles.questionText}>
            {index + 1}. {question.question}
          </Text>
          {question.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                answers[question.id] === option.id && styles.selectedOption,
              ]}
              onPress={() => handleOptionSelect(question.id, option.id)}
            >
              <Text
                style={[
                  styles.optionText,
                  answers[question.id] === option.id && styles.selectedOptionText,
                ]}
              >
                {option.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <Pressable
        style={[
          styles.submitButton,
          isSubmitEnabled
            ? styles.submitButtonEnabled
            : styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={!isSubmitEnabled}
      >
        <Text style={styles.submitButtonText}>Submit</Text>
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
  chapterTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  questionContainer: {
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
  optionButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: "#3399FF",
    borderColor: "#3399FF",
  },
  optionText: {
    fontSize: 14,
    color: "#333",
  },
  selectedOptionText: {
    color: "#fff",
  },
  submitButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonEnabled: {
    backgroundColor: "#28a745",
  },
  submitButtonDisabled: {
    backgroundColor: "#a9a9a9",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#555",
  },
});
