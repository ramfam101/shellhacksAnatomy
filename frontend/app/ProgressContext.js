import React, { createContext, useState, useContext } from 'react';

// Create the context
const ProgressContext = createContext();

// Custom hook to use the context
export const useProgress = () => useContext(ProgressContext);

// Provider component to wrap your app
export const ProgressProvider = ({ children }) => {
  // Initialize progress for each chapter (set to 0 initially)
  const [chapterProgress, setChapterProgress] = useState({
    "Introduction to Anatomy and Physiology": 0,
    "Cells and Tissues": 0,
    "The Integumentary System": 0,
    "The Skeletal System": 0,
    "The Muscular System": 0,
    "The Nervous System": 0,
    "The Endocrine System": 0,
    "The Cardiovascular System": 0,
    "The Lymphatic System and Immunity": 0,
    "The Respiratory System": 0,
    "The Digestive System": 0,
    "The Urinary System": 0,
    "The Reproductive System": 0,
    "The Special Senses": 0,
  });

  // Calculate overall progress based on the average of all chapters' progress
  const overallProgress = Object.values(chapterProgress).reduce((a, b) => a + b, 0) / Object.keys(chapterProgress).length;

  // Function to update progress for an individual chapter
  const updateChapterProgress = (chapter, progress) => {
    setChapterProgress((prev) => ({
      ...prev,
      [chapter]: progress,
    }));
  };

  return (
    <ProgressContext.Provider value={{ overallProgress, chapterProgress, updateChapterProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};
