import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the types for the result data
interface Result {
  questionId: string;
  correct: boolean;
}

// Define the shape of the context
interface QuizResultContextProps {
  result: Result[];
  setResult: (newResult: Result[]) => void;
}

// Create the context with a default value of an empty result array
const QuizResultContext = createContext<QuizResultContextProps | undefined>(undefined);

// Create a provider component
export const QuizResultProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [result, setResult] = useState<Result[]>([]);

  return (
    <QuizResultContext.Provider value={{ result, setResult }}>
      {children}
    </QuizResultContext.Provider>
  );
};

// Create a custom hook to use the context
export const useQuizResult = () => {
  const context = useContext(QuizResultContext);
  if (!context) {
    throw new Error("useQuizResult must be used within a QuizResultProvider");
  }
  return context;
};
