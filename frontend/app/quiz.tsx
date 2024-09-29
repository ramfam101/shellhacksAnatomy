// import React, { useState, useEffect } from "react";
// import {
//   Text,
//   View,
//   ScrollView,
//   StyleSheet,
//   Pressable,
//   Alert,
//   TouchableOpacity,
//   ActivityIndicator,
// } from "react-native";
// import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
// import axios from "axios";


// // Define the types for the quiz data
// interface AnswerOption {
//   id: string;
//   text: string;
// }

// interface Question {
//     id: string;
//     question: string;
//     options: AnswerOption[];
//     correct: string;
//     chosen?: string;
// }

// interface QuizData {
//   chapter: string;
//   questions: Question[];
// }

// // Predefined dummy quiz data

// const API_BASE_URL = 'http://10.108.88.1:5000';

// // Define the type for navigation parameters if using React Navigation
// type QuizPageRouteProp = RouteProp<{ params: { chapter: string } }, "params">;

// export default function QuizPage() {
//   const route = useRoute<QuizPageRouteProp>();
//   const { chapter } = route.params;
//   const navigation = useNavigation(); // Initialize useNavigation

//   // Initialize state
//   const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null);
//   const [answers, setAnswers] = useState<{ [key: string]: string }>({});
//   const [isSubmitEnabled, setIsSubmitEnabled] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(true);

//   // useEffect(() => {
//   //   // Function to start the quiz and fetch questions
//   //   const initializeQuiz = async () => {
//   //     try {
//   //       // 1. Start the quiz by sending a POST request to /start_quiz
//   //       setLoading(true);
//   //       const startResponse = await axios.post(
//   //         `${API_BASE_URL}/start_quiz`,
//   //         { content: chapter }, // Assuming 'content' is the quiz topic
//   //         {
//   //           withCredentials: true, // Ensure cookies are sent with the request
//   //           timeout: 10000, // Set a reasonable timeout (adjust as needed)
//   //         }
//   //       );

//   //       // Check if the response is successful
//   //       if (startResponse.status === 200) {
//   //         const { chapter, questions } = startResponse.data;  // Destructure response data

//   //         // Check if both chapter and questions exist
//   //         if (chapter && questions) {
//   //           const quizData: QuizData = {
//   //             chapter: chapter,  // Directly map chapter
//   //             questions: questions, // Directly pass the questions array
//   //           };
//   //           setCurrentQuiz(quizData);  // Update the state with quiz data
//   //         } else {
//   //           // Handle case where chapter or questions are missing
//   //           Alert.alert("Error", "Invalid quiz data received.");
//   //         }
//   //       } else {
//   //         // Handle error if the status is not 200
//   //         Alert.alert("Error", "Failed to start the quiz.");
//   //       }
//   //     } catch (error: any) {
//   //       // Catch and log any errors that occur during the process
//   //       console.error(error);
//   //       Alert.alert("Error", `An error occurred while initializing the quiz: ${error.message}`);
//   //     } finally {
//   //       // Ensure that loading state is reset after the request completes
//   //       setLoading(false);
//   //     }
//   //   };

//   //   initializeQuiz();  // Call the function when the component mounts
//   // }, [chapter]);  // Re-run if 'chapter' changes

//   const handleOptionSelect = (questionId: string, optionId: string) => {
//     setAnswers((prevAnswers) => ({
//       ...prevAnswers,
//       [questionId]: optionId,
//     }));
  
//     setCurrentQuiz((prevQuiz) => {
//       if (!prevQuiz) return null;
  
//       const updatedQuestions = prevQuiz.questions.map((q) => {
//         if (q.id === questionId) {
//           return { ...q, chosen: optionId };
//         }
//         return q;
//       });
  
//       return { ...prevQuiz, questions: updatedQuestions };
//     });
//   };

//   useEffect(() => {
//     if (currentQuiz) {
//       const allAnswered = currentQuiz.questions.every((q) => q.chosen);
//       setIsSubmitEnabled(allAnswered);
//     }
//   }, [currentQuiz]);

//   const handleSubmit = async () => {
//     try {
//       // Send the updated quiz data (with chosen answers) to the backend
//       const response = await axios.post(`${API_BASE_URL}/submit_quiz`, {
//         chapter: currentQuiz?.chapter,
//         questions: currentQuiz?.questions,  // Send the entire questions array
//       });
      
//       if (response.status == 200) {
//         Alert.alert(
//             "Quiz Submitted",
//             "Your quiz has been submitted successfully! We'll analyze your answers and provide feedback shortly.",
//             [{ text: "OK", onPress: () => navigation.goBack() }]  // Go back after confirmation
//         );
//       } else {
//         Alert.alert("Error", "Failed to submit quiz.");
//       }
//     } catch (error: any) {
//       console.error(error);
//       Alert.alert("Error", "An error occurred while submitting the quiz.");
//     }
//     };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text style={styles.loadingText}>Loading Quiz...</Text>
//       </View>
//     );
//   }
//   if (!currentQuiz) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text style={styles.loadingText}>No Quiz Data Available</Text>
//       </View>
//     );
//   }
//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.chapterTitle}>{chapter} Quiz</Text>
//       {currentQuiz.questions.map((question, index) => (
//         <View key={question.id} style={styles.questionContainer}>
//           <Text style={styles.questionText}>
//             {index + 1}. {question.question}
//           </Text>
//           {question.options.map((option) => (
//             <TouchableOpacity
//               key={option.id}
//               style={[
//                 styles.optionButton,
//                 answers[question.id] === option.id && styles.selectedOption,
//               ]}
//               onPress={() => handleOptionSelect(question.id, option.id)}
//             >
//               <Text
//                 style={[
//                   styles.optionText,
//                   answers[question.id] === option.id && styles.selectedOptionText,
//                 ]}
//               >
//                 {option.text}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       ))}

//       <Pressable
//         style={[
//           styles.submitButton,
//           isSubmitEnabled
//             ? styles.submitButtonEnabled
//             : styles.submitButtonDisabled,
//         ]}
//         onPress={handleSubmit}
//         disabled={!isSubmitEnabled}
//       >
//         <Text style={styles.submitButtonText}>Submit</Text>
//       </Pressable>
//     </ScrollView>
//   );
// }

// // Styles
// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     paddingBottom: 40,
//     backgroundColor: "#f5f5f5",
//   },
//   chapterTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   questionContainer: {
//     marginBottom: 25,
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 8,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   questionText: {
//     fontSize: 16,
//     marginBottom: 10,
//     fontWeight: "600",
//   },
//   optionButton: {
//     padding: 10,
//     borderRadius: 5,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     marginBottom: 8,
//   },
//   selectedOption: {
//     backgroundColor: "#3399FF",
//     borderColor: "#3399FF",
//   },
//   optionText: {
//     fontSize: 14,
//     color: "#333",
//   },
//   selectedOptionText: {
//     color: "#fff",
//   },
//   submitButton: {
//     marginTop: 20,
//     padding: 15,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   submitButtonEnabled: {
//     backgroundColor: "#28a745",
//   },
//   submitButtonDisabled: {
//     backgroundColor: "#a9a9a9",
//   },
//   submitButtonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loadingText: {
//     fontSize: 18,
//     color: "#555",
//   },
// });
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
}

interface QuizData {
  chapter: string;
  questions: Question[];
}

// Predefined dummy quiz data
const quizData: QuizData[] = [
  {
    chapter: "Mathematics",
    questions: [
      {
        id: "q1",
        question: "What is 2 + 2?",
        options: [
          { id: "a1", text: "3" },
          { id: "a2", text: "4" },
          { id: "a3", text: "5" },
          { id: "a4", text: "6" },
        ],
      },
      {
        id: "q2",
        question: "What is the capital of France?",
        options: [
          { id: "a1", text: "Berlin" },
          { id: "a2", text: "Madrid" },
          { id: "a3", text: "Paris" },
          { id: "a4", text: "Rome" },
        ],
      },
      {
        id: "q3",
        question: "Which planet is known as the Red Planet?",
        options: [
          { id: "a1", text: "Earth" },
          { id: "a2", text: "Mars" },
          { id: "a3", text: "Jupiter" },
          { id: "a4", text: "Saturn" },
        ],
      },
      {
        id: "q4",
        question: "What is the largest ocean on Earth?",
        options: [
          { id: "a1", text: "Atlantic Ocean" },
          { id: "a2", text: "Indian Ocean" },
          { id: "a3", text: "Arctic Ocean" },
          { id: "a4", text: "Pacific Ocean" },
        ],
      },
      {
        id: "q5",
        question: "Who wrote 'Romeo and Juliet'?",
        options: [
          { id: "a1", text: "Charles Dickens" },
          { id: "a2", text: "William Shakespeare" },
          { id: "a3", text: "Leo Tolstoy" },
          { id: "a4", text: "Mark Twain" },
        ],
      },
      {
        id: "q6",
        question: "What is the chemical symbol for Gold?",
        options: [
          { id: "a1", text: "Au" },
          { id: "a2", text: "Ag" },
          { id: "a3", text: "Gd" },
          { id: "a4", text: "Go" },
        ],
      },
      {
        id: "q7",
        question: "How many continents are there on Earth?",
        options: [
          { id: "a1", text: "5" },
          { id: "a2", text: "6" },
          { id: "a3", text: "7" },
          { id: "a4", text: "8" },
        ],
      },
      {
        id: "q8",
        question: "What is the boiling point of water?",
        options: [
          { id: "a1", text: "50°C" },
          { id: "a2", text: "100°C" },
          { id: "a3", text: "150°C" },
          { id: "a4", text: "200°C" },
        ],
      },
      {
        id: "q9",
        question: "Which language is primarily spoken in Brazil?",
        options: [
          { id: "a1", text: "Spanish" },
          { id: "a2", text: "Portuguese" },
          { id: "a3", text: "French" },
          { id: "a4", text: "English" },
        ],
      },
      {
        id: "q10",
        question: "What is the smallest prime number?",
        options: [
          { id: "a1", text: "0" },
          { id: "a2", text: "1" },
          { id: "a3", text: "2" },
          { id: "a4", text: "3" },
        ],
      },
      {
        id: "q11",
        question: "What is the square root of 16?",
        options: [
          { id: "a1", text: "2" },
          { id: "a2", text: "4" },
          { id: "a3", text: "8" },
          { id: "a4", text: "16" },
        ],
      },
      {
        id: "q12",
        question: "What is 15% of 200?",
        options: [
          { id: "a1", text: "15" },
          { id: "a2", text: "25" },
          { id: "a3", text: "30" },
          { id: "a4", text: "35" },
        ],
      },
      {
        id: "q13",
        question: "Which of the following is a prime number?",
        options: [
          { id: "a1", text: "12" },
          { id: "a2", text: "18" },
          { id: "a3", text: "23" },
          { id: "a4", text: "36" },
        ],
      },
      {
        id: "q14",
        question: "What is the value of π (Pi) rounded to two decimal places?",
        options: [
          { id: "a1", text: "3.14" },
          { id: "a2", text: "2.14" },
          { id: "a3", text: "4.14" },
          { id: "a4", text: "3.04" },
        ],
      },
      {
        id: "q15",
        question: "Solve the equation: 3x + 5 = 20. What is x?",
        options: [
          { id: "a1", text: "2" },
          { id: "a2", text: "5" },
          { id: "a3", text: "7" },
          { id: "a4", text: "10" },
        ],
      },
    ],
  },
];


// Define the type for navigation parameters if using React Navigation
type QuizPageRouteProp = RouteProp<{ params: { chapter: string } }, "params">;

export default function QuizPage() {
  const route = useRoute<QuizPageRouteProp>();
  const { chapter } = route.params;
  const navigation = useNavigation(); // Initialize useNavigation

  // Initialize state
  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [isSubmitEnabled, setIsSubmitEnabled] = useState<boolean>(false);

  useEffect(() => {
    // Find quiz data based on the chapter
    const selectedQuiz = quizData[0];
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
    // For demonstration, we'll just display the selected answers
    let resultText = "Your Answers:\n\n";
    currentQuiz?.questions.forEach((question) => {
      const selectedOptionId = answers[question.id];
      const selectedOption = question.options.find(
        (opt) => opt.id === selectedOptionId
      );
      resultText += `${question.question}\nYour Answer: ${
        selectedOption ? selectedOption.text : "Not Answered"
      }\n\n`;
    });

    Alert.alert("Quiz Submitted", resultText, [
      { text: "OK", onPress: () => navigation.goBack() }, // Go back to the previous page
    ]);
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
